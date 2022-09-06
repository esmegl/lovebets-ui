<template lang="pug">
q-page.center(padding)
	q-form(
		style="max-width: 720px"
		autocorrect="off"
		autocapitalize="off"
		autocomplete="off"
		spellcheck="false"
		@submit="onSubmit"
		greedy
	)

		h1.text-h6.q-ma-none Minister
		div.row.justify-start(style="padding-bottom: 20px")
			div.col-12
				q-input(
					outlined
					dense
					hide-bottom-space
					lazy-rules
					readonly
					v-model="formData.proposer"
					text-color="blue"
				)
		h1.text-h6.q-ma-none Wedding name
		div.row.justify-start
			div.col-12
				q-input(
					clearable 
					clear-icon="close" 
					dense
					name="bet_name"
					v-model="formData.proposal_name"
					color="blue"
					maxlength="13"
	        :rules="[value => !!value || 'Field is required']"
					hint="Characters allowed are letters from a to z and numbers from 1 to 5"
					hide-hint
				)
		h1.text-h6.q-ma-none Brides and Grooms
		div.row.justify-start
			div.col-12
				ProposalAuthorization(
					v-for="(item, index) in formData.requested"
					:key="index"
					v-model:actor="item.actor"
					v-model:permission="item.permission"
					@remove="formData.requested.splice(index, 1)"
				)
		div.row.justify-start(style="padding-bottom: 20px")
			q-btn(
				padding="sm md" 
				color="blue" 
				label="Add Actor"
				icon-right="add_circle"
				@click="formData.requested.push({})"
			)

		h1.text-h6.q-ma-none Set loss percentage
		div.row.justify-start(style="padding-bottom: 20px")
			q-input(
				dense
				v-model="loss"
				color="blue"
				mask="#.##"
				fill-mask="0"
				reverse-fill-mask
				suffix="%"
			)

		h1.text-h6.q-ma-none Invite Witnesses
		div.row.justify-start(style="padding-bottom: 10px")
			div.col-12
				q-input(
					clearable
					clear-icon="close"
					v-model="witness"
					label="Witness account name"
					color="blue"
				)
		div.row.justify-right
			q-btn(
				color="blue" 
				text-color="white" 
				label="Add Witness" 
				icon-right="add_circle"
				@click="addWitness"
				:disable="witness == ''"
			)


</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import ProposalSuccess from 'components/ProposalSuccess.vue';
import ProposalAuthorization from 'components/ProposalAuthorization.vue';
import ProposalAction from 'components/ProposalAction.vue';
import { Authorization, ProposalForm, Error } from 'src/types';
import { api } from 'src/api';
import { useAuthenticator } from 'src/composables/useAuthenticator';
import { serializeActionData } from 'src/utils/serializeActionData';
import { randomEosioName } from 'src/utils/handleEosioName';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ProposalNew',
  components: {
    ProposalSuccess,
    ProposalAuthorization,
    ProposalAction
  },
  setup() {
    const router = useRouter();
    const { account, isAuthenticated, getUser } = useAuthenticator();
    const $q = useQuasar();

    const amountOfDaysToExpire = ref(7);
    const blockProducers = ref<Authorization[]>([]);
    const areBlockProducersApproving = ref(false);

    const success = reactive({
      proposalName: '',
      transactionId: '',
      showModal: false
    });

    const formData: ProposalForm = reactive({
      proposer: '',
      proposal_name: '',
      requested: [
        {
          actor: '',
          permission: ''
        }
      ],
      trx: {
        expiration: moment()
          .add(amountOfDaysToExpire.value, 'days')
          .format('YYYY-MM-DDTHH:mm:ss'),
        ref_block_num: 0,
        ref_block_prefix: 0,
        max_net_usage_words: 0,
        max_cpu_usage_ms: 0,
        delay_sec: 0,
        context_free_actions: '',
        transaction_extensions: '',
        actions: []
      }
    });

    var loss = ref(0);

    onMounted(() => {
      formData.proposal_name = randomEosioName();
      formData.proposer = account.value;
    });

    onMounted(async () => {
      if (!isAuthenticated.value) {
        await router.push('/proposal');
      }
    });

    onMounted(async () => {
      const producers = await api.getProducers();
      const producersAccount = [] as Authorization[];

      for (let index = 0; index < producers.rows.length; index++) {
        const item = producers.rows[index];
        if (item.is_active === 1) {
          producersAccount.push({
            actor: item.owner,
            permission: 'active'
          });
        }
      }

      blockProducers.value = producersAccount;
    });

    function handleError(message: string) {
      $q.notify({
        color: 'negative',
        message,
        actions: [
          {
            label: 'Dismiss',
            color: 'white'
          }
        ]
      });
    }

    async function onSubmit() {
      const data = JSON.parse(JSON.stringify(formData)) as ProposalForm;

      if (areBlockProducersApproving.value) {
        data.requested = data.requested.concat(
          JSON.parse(JSON.stringify(blockProducers.value))
        );
      }

      if (data.requested.length === 0) {
        handleError('At least one requested approval');
        return;
      }

      if (data.trx.actions.length === 0) {
        handleError('At least one action');
        return;
      }

      data.trx.transaction_extensions = data.trx.transaction_extensions
        ? (data.trx.transaction_extensions as string).split(',')
        : [];

      data.trx.context_free_actions = data.trx.context_free_actions
        ? (data.trx.context_free_actions as string).split(',')
        : [];

      try {
        for (let i = 0; i < data.trx.actions.length; i++) {
          const item = data.trx.actions[i] as {
            account: string;
            name: string;
            data: unknown;
          };

          const hexData = await serializeActionData({
            account: item.account,
            name: item.name,
            data: item.data
          });

          data.trx.actions[i].data = hexData;
        }

        const user = await getUser();
        const transaction = await user.signTransaction(
          {
            actions: [
              {
                account: 'eosio.msig',
                name: 'propose',
                authorization: [
                  {
                    actor: account.value,
                    permission: 'active'
                  }
                ],
                data
              }
            ]
          },
          {
            blocksBehind: 3,
            expireSeconds: 30
          }
        );

        success.showModal = true;
        success.transactionId = transaction.transactionId;
        success.proposalName = data.proposal_name;
      } catch (e) {
        const error = JSON.parse(JSON.stringify(e)) as Error;
        handleError(
          error?.cause?.json?.error?.what || 'Unable to create a proposal'
        );
      }
    }

    function onAddAction() {
      formData.trx.actions.push({
        account: '',
        name: '',
        authorization: [
          {
            actor: '',
            permission: ''
          }
        ],
        data: {}
      });
    }

    function onAmountOfDaysToExpire(days: number) {
      if (days) {
        formData.trx.expiration = moment()
          .add(days, 'days')
          .format('YYYY-MM-DDTHH:mm:ss');
      }
    }

    function onExpiration(value: string) {
      if (value === null) {
        amountOfDaysToExpire.value = 7;
        onAmountOfDaysToExpire(7);
        return;
      }

      const now = new Date().getTime();
      const date = new Date(value).getTime();
      if (!isNaN(date)) {
        const diffTime = Math.abs(date - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        amountOfDaysToExpire.value = diffDays;
      }
    }

    return {
      onSubmit,
      onAddAction,
      amountOfDaysToExpire,
      onAmountOfDaysToExpire,
      onExpiration,
      formData,
      areBlockProducersApproving,
      blockProducers,
      success,
      loss
    };
  }
});
</script>

<style>

	.center {
	justify-content: center;
	align-items: center;
	}

	.justify-right {
	display: flex;
	justify-content: right;
	align-items: center;
	}

/*	.justify-left {
	display: flex;
	justify-content: right;
	align-items: center;
	}*/

</style>