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
		div.row.justify-start(style="padding-bottom: 20px")
			div.col-12
				q-input(
					outlined
					dense
					hide-bottom-space
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
					:rules="[value => !!value || 'Wedding Name is required']"
					hint="Characters allowed are letters from a to z and numbers from 1 to 5"
					hide-hint
				)
		h1.text-h6.q-ma-none Brides and Grooms
		div.row.q-col-gutter-lg
			div.col-4.col-md
				q-input(
					dense
					clearable 
					clear-icon="close" 
					label="Account name" 
					color="blue"
					v-model="inputData.bettor"
					:rules="[value => !!value || 'Field is required']"
				)
			div.col-3.col-md
				q-select(
					outlined
					dense
					label="Permission"
					v-model="inputData.permission"
					:options="permissionOptions"
					:rules="[value => !!value || 'Field is required']"
				)
			div.col-3.col-md
				q-input(
					dense
					v-model="inputData.bettor_quantity"
					color="blue"
					label="Amount to bet"
					mask="#.####"
					fill-mask="0"
					reverse-fill-mask
					input-class="text-left"
					suffix="TELOS"
					hint="Minimum amount allowed is 30 TLOS"
					hide-hint
				)
			div.col-2.col-md
				q-btn(
					dense
					padding="sm md" 
					color="blue" 
					label="Add Actor"
					@click="onAddActor"
					:disable="inputData.bettor == '' || inputData.permission == '' || inputData.bettor_quantity == 0"
				)

		q-list(v-if="inputData.bettors.length > 0" separator)
			q-item(
			v-for="(bettor, index) in inputData.bettors")
				q-item-section
					div.row.q-col-gutter-lg
						div.col-auto.col-sm
							q-input(
								dense
								readonly
								outlined
								v-model="bettor.name"
							)
						div.col-3.col-sm
							q-input(
								dense
								readonly
								outlined
								v-model="bettor.permission"
							)
						div.col-3
							q-input(
								dense
								readonly
								outlined
								v-model="bettor.amount"
							)
						div.col-2.items-left
							q-btn(
								flat
								padding="sm md"
								color="white"
								text-color="red"
								label="Remove"
								@click="onRemoveActor(inedx)"
							)
			

		h1.text-h6.q-ma-none Set loss percentage
		div.row.justify-start(style="padding-bottom: 20px")
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
		//- div.row.justify-start(style="padding-bottom: 10px")
		//- 	div.col-12
		//- 		WitnessAuthorization(
		//- 			v-for="(item, index) in formData.requested"
		//- 			:key="index"
		//- 			v-model:actor="item.actor"
		//- 			v-model:permission="item.permission"
		//- 			@remove="formData.requested.splice(index, 1)"
		//- 		)
		//- div.row.justify-right(style="padding-bottom: 40px")
		//- 	q-btn(
		//- 		color="blue" 
		//- 		text-color="white" 
		//- 		label="Add Witness" 
		//- 		icon-right="add_circle"
		//- 		@click="formData.requested.push({})"
		//- 		:disable="witness == ''"
		//- )


		div.row
			div.col.justify-right(style="padding-right: 5px")
				q-btn(
					size="lg"
					color="blue"
					label="Start Wedding"
					type="submit"
				)
			div.col(style="padding-left: 5px")
				q-btn(
					size="lg"
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

		const inputData = reactive({
			bettor: '',
			permission: '',
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
						data: {
							bet_name: '',
							minister: '',
							bettors: [],
							witnesses: [],
							loss: '',
							bettor_quantity: []
						}
					}
				]
			}
		});

		onMounted(() => {
			formData.proposal_name = randomEosioName();
			formData.trx.actions[0].data.bet_name = formData.proposal_name;

			formData.proposer = account.value;
			formData.trx.actions[0].data.minister = account.value;
			formData.trx.actions[0].authorization[0].actor = formData.proposer;
			formData.trx.actions[0].authorization[0].permission = 'active';

			// Add minister request to sign
			formData.requested[0].actor = account.value;
			formData.requested[0].permission = 'active';

			// Set formData constants
			formData.trx.actions[0].account = 'esmeesmeesme';
			formData.trx.actions[0].name = 'initbet';
		});

		onMounted(async () => {
			if (!isAuthenticated.value) {
				await router.push('/proposal');
			}
		});

		// onMounted(async () => {
		// 	const producers = await api.getProducers();
		// 	const producersAccount = [] as Authorization[];

		// 	for (let index = 0; index < producers.rows.length; index++) {
		// 		const item = producers.rows[index];
		// 		if (item.is_active === 1) {
		// 			producersAccount.push({
		// 				actor: item.owner,
		// 				permission: 'active'
		// 			});
		// 		}
		// 	}

		// 	blockProducers.value = producersAccount;
		// });

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
			// Transform loss and quantity values to correct string format

			// Add bettors to requested and to the smart contract list
			for(let i = 0; i < inputData.bettors.length; i++) {
				formData.requested.push({
					actor: inputData.bettors[i].name,
					permission: inputData.bettors[i].permission,
				});

				formData.trx.actions[0].data.bettors.push(inputData.bettors[i].name);
				// formData.trx.actions[0].data.bettor_quantity.push('${inputData.bettors[i].amount} TLOS');
			}

			// Add witnesses to requested and to the smart contract list
			for(let i = 0; i < inputData.witnesses.length; i++) {
				formData.requested.push({
					actor: inputData.witnesses[i].name,
					permission: inputData.witnesses[i].permission,
				});

				formData.trx.actions[0].data.witnesses.push(inputData.witnesses[i].name);
			}


			// Add witnesses and bettors to requested 

			// Fill the requested list with the bettors
			// for (let i = 1; i < .bettors.length; i++) {
			// 	formData.requested[i].actor = .bettors[i];
			// 	formData.requested[i].permission = 'active';
			// };

			// Fill the requested list with the witnesses
			// for (let i = 0; i < raw_data.bettors.length; i++) {
			// 	formData.requested[i].actor = raw_data.witnesses[i];
			// 	formData.requested[i].permission = 'active';
			// };

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

					// data.trx.actions[i].data = hexData;
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

		function onAddActor() {

			// Add actors to be displayed 
			inputData.bettors.push({
	        	name: inputData.bettor,
	        	permission: inputData.permission,
	        	amount: inputData.bettor_quantity
	        });	

			// Reset input values
		}

		function onRemoveActor(index: number) {
			inputData.bettors.splice(index, 1);
		}

		// Change to add bettor and add witness
		// function onAddAction() {
		// 	formData.trx.actions.push({
		// 		account: 'esmeesmeesme',
		// 		name: 'initbet',
		// 		authorization: [
		// 			{
		// 				actor: '',
		// 				permission: ''
		// 			}
		// 		],
		// 		data: {}
		// 	});
		// }

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
			onAddActor,
			onRemoveActor,
			amountOfDaysToExpire,
			onAmountOfDaysToExpire,
			onExpiration,
			formData,
			// areBlockProducersApproving,
			permissionOptions,
			blockProducers,
			success,
			inputData
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