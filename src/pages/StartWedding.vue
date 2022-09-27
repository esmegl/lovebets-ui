<template lang="pug">
q-page(padding)
	q-form(
		style="maxWidth: 720px"
		autocorrect="off"
		autocapitalize="off"
		autocomplete="off"
		spellcheck="false"
		@submit="onSubmit"
		greedy
	)
		h1.text-h6.q-ma-none Minister
		div.row.justify-start.q-col-gutter-lg
			div.col-8.col-sm
				q-input(
					outlined
					dense
					hide-bottom-space
					readonly
					v-model="formData.proposer"
					text-color="blue"
				)
			div.col-auto.col-sm
				q-select(
					outlined
					dense
					label="Permission"
					v-model="inputData.minister_permission"
					:options="permissionOptions"
					:rules="[value => !!value || 'Field is required']"
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
					:rules="[value => !!value || 'Wedding Name is required']"
					hint="Characters allowed are letters from a to z and numbers from 1 to 5"
					hide-hint
				)
		h1.text-h6.q-ma-none Brides and Grooms
			div.row
				div.col-12.col-sm
					BettorAuthorization(
						v-for="(item, index) in inputData.bettors"
						:key="index"
						v-model:actor="item.name"
						v-model:permission="item.permission"
						v-model:amount="item.amount"
						@remove="inputData.bettors.splice(index, 1)"
					)

			div.row.q-pb-md
				q-btn(
					color="blue"  
					label="Add Actor"
					@click="inputData.bettors.push({})"
				)
				
		h1.text-h6.q-ma-none Set loss percentage
		div.row.justify-start
			q-input(
				dense
				v-model="inputData.loss"
				color="blue"
				mask="#.####"
				fill-mask="00001"
				reverse-fill-mask
				suffix="%"
				:rules="[value => value > 0 || 'Loss percentage must be greater than zero']"
			)

		h1.text-h6.q-ma-none Invite Witnesses
		div.row.justify-start
			div.col-12
				WitnessAuthorization(
					v-for="(item, index) in inputData.witnesses"
					:key="index"
					v-model:actor="item.name"
					v-model:permission="item.permission"
					@remove="inputData.witnesses.splice(index, 1)"
				)
		div.row.q-pb-md
			q-btn(
				color="blue" 
				label="Add Witness" 
				@click="inputData.witnesses.push({})"
		)


		div.row
			div.col.justify-right.q-pr-sm
				q-btn(
					color="blue"
					label="Start Wedding"
					type="submit"
				)
			div.col(style="padding-left: 5px")
				q-btn(
					flat
					to="/select_role"
					color="blue"
					label="Cancel"
				)

</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import ProposalSuccess from 'components/ProposalSuccess.vue';
import BettorAuthorization from 'components/BettorAuthorization.vue';
import WitnessAuthorization from 'components/WitnessAuthorization.vue';
import { Authorization, ProposalForm, Error } from 'src/types';
import { api } from 'src/api';
import { useAuthenticator } from 'src/composables/useAuthenticator';
import { serializeActionData } from 'src/utils/serializeActionData';
import { randomEosioName } from 'src/utils/handleEosioName';
import { useQuasar } from 'quasar';

interface InputData {
	bettor: string;
	permission: string;
	minister_permission: string;
	bettor_quantity: number;
	bettors: {
		name: string;
		permission: string;
		amount: number;
	}[];
	witness: string;
	witnesses: {
		name: string;
		permission: string;
	}[];
	loss: number;
}

interface Data {
	bet_name: string;
	minister: string;
	bettors: string[];
	witnesses: string[];
	loss: string;
	bettor_quantity: string[];
}

export default defineComponent({
	name: 'NewWedding',
	components: {
		ProposalSuccess,
		BettorAuthorization,
		WitnessAuthorization
	},
	setup() {

		const permissionOptions = ['active', 'owner'];

		const router = useRouter();
		const { account, isAuthenticated, getUser } = useAuthenticator();
		const $q = useQuasar();

		const amountOfDaysToExpire = ref(7);
		const blockProducers = ref<Authorization[]>([]);
		// const areBlockProducersApproving = ref(false);

		const success = reactive({
			proposalName: '',
			transactionId: '',
			showModal: false
		});

		const inputData: InputData = reactive({
			bettor: '',
			permission: '',
			minister_permission: '',
			bettor_quantity: 0,
			bettors: [
				{
					name: '',
					permission: '',
					amount: 0
				}
			],
			witness: '',
			witnesses: [ 
				{
					name: '',
					permission: ''
				}
			],
			loss: 0,
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
				actions: [
					{
						account: '',
						name: '',
						authorization: [
							{
								actor: '',
								permission: ''
							}
						],
						data: {}
					}
				]
			}
		});

		const weddingData: Data = reactive({
			bet_name: '',
			minister: '',
			bettors: [],
			witnesses: [],
			loss: '',
			bettor_quantity: []
		});

		onMounted(() => {
			formData.proposal_name = randomEosioName();

			// The minister is also the proposer
			formData.proposer = account.value;
			weddingData.minister = account.value;

			formData.trx.actions[0].authorization[0].actor = formData.proposer;

			// Add minister request to sign
			formData.requested[0].actor = account.value;

			// Set formData action constants
			formData.trx.actions[0].account = 'esmeesmeesme';
			formData.trx.actions[0].name = 'initbet';
		});

		onMounted(async () => {
			if (!isAuthenticated.value) {
				await router.push('/proposal');
			}
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

			weddingData.bet_name = formData.proposal_name;

			// Minister authorization permission
			formData.trx.actions[0].authorization[0].permission = inputData.minister_permission;
			// Minister requested permission
			formData.requested[0].permission = inputData.minister_permission;

			// Bettors
			for(let i = 0; i < inputData.bettors.length; i++) {
				// Requested actors to sign
				formData.requested.push({
					actor: inputData.bettors[i].name,
					permission: inputData.bettors[i].permission,
				});

				// Wedding list
				weddingData.bettors.push(inputData.bettors[i].name);
				weddingData.bettor_quantity.push(`${inputData.bettors[i].amount} TLOS`);
			}

			// Witnesses
			for(let i = 0; i < inputData.witnesses.length; i++) {
				// Requested actors to sign
				formData.requested.push({
					actor: inputData.witnesses[i].name,
					permission: inputData.witnesses[i].permission,
				});
				// Wedding list
				weddingData.witnesses.push(inputData.witnesses[i].name);
			}

			weddingData.loss = `${inputData.loss} TLOS`;

			// Add wedding data to actions
			formData.trx.actions[0].data = weddingData;

			const data = JSON.parse(JSON.stringify(formData)) as ProposalForm;

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
			amountOfDaysToExpire,
			onAmountOfDaysToExpire,
			onExpiration,
			formData,
			permissionOptions,
			blockProducers,
			success,
			inputData
		};
	}
});
</script>

<style>
	.justify-right {
	display: flex;
	justify-content: right;
	align-items: center;
	}
</style>