<template lang="pug">
q-page(padding)
	div.q-py-lg
		q-btn(
			color="blue"
			text-color="white"
			to="/select_role"
			label="Back"
			icon="arrow_back"
		)
	div.q-py-lg(v-if="isAuthenticated" name="myProposal")
		ProposalTable(
			title="Needs your signature"
			type="needsYourSignature"
			:account="account"
		)
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import ProposalTable from 'src/components/ProposalTable.vue';
import { api } from 'src/api';
import { useAuthenticator } from 'src/composables/useAuthenticator';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'WitnessApproval',
  components: {
    ProposalTable
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const blockProducers = ref<string[]>([]);
    const { account, isAuthenticated } = useAuthenticator();

    const tab = ref<string>((route.query['tab'] as string) || 'myProposal');

    onMounted(() => {
      if (!isAuthenticated.value) {
        tab.value = 'allProposal';
      }
    });

    onMounted(async () => {
      const producers = await api.getProducers();
      const producersAccount = [] as string[];

      for (let index = 0; index < producers.rows.length; index++) {
        const item = producers.rows[index];
        if (item.is_active === 1) {
          producersAccount.push(item.owner);
        }
      }

      blockProducers.value = producersAccount;
    });

    watch([tab], () => {
      void router.push({
        path: router.currentRoute.value.path,
        query: {
          tab: tab.value
        }
      });
    });

    return {
      tab,
      account,
      isAuthenticated,
      blockProducers
    };
  }
});
</script>
