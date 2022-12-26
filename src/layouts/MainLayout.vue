<template lang="pug">
q-layout(view="lHh Lpr lFf")
		q-header(elevated)
			q-toolbar.bg-primary
				q-btn(
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="leftDrawerOpen = !leftDrawerOpen"
				)
				q-toolbar-title(style="padding-left: 10px") Welcome!
				login-handler Login
		q-drawer.bg-dark(
			v-model="leftDrawerOpen"
			show-if-above
			:width='350'
			:breakpoint='350'
			elevated
		)
			q-scroll-area(style="height: calc(100% - 150px)")
				div.row(style="padding: 10px")
					div.column.items-start
						q-btn(flat dense icon="dark_mode" color="white")
					div.col
						q-btn(flat dense icon="language" color="white")
					div.column.items-end
						q-btn(
							flat
							dense
							icon="arrow_back"
							color="primary"
							aria-label="Close Drawer"
							@click="leftDrawerOpen = !leftDrawerOpen"
						)
				q-list.text-white()
					q-item(to="/" exact clickable v-ripple)
						q-item-section(avatar)
							q-icon(name="home")
						q-item-section Home

					//- q-item(:to="{path: 'account/' + accountName.value}" exact clickable v-ripple)
					//- 	q-item-section(avatar)
					//- 		q-icon(name="account_balance_wallet")
					//- 	q-item-section Wallet

					q-item(to="/select_role" exact clickable v-ripple)
						q-item-section(avatar)
							q-icon(name="favorite")
						q-item-section Get Married!

					q-item(to="/guide" exact clickable v-ripple)
						q-item-section(avatar)
							q-icon(name="auto_stories")
						q-item-section Guide to use Lovebets

					q-item(to="/docs" exact clickable v-ripple)
						q-item-section(avatar)
							q-icon(name="description")
						q-item-section Docs

					q-item(to="/high_scores" exact clickable v-ripple)
						q-item-section(avatar)
							q-icon(name="leaderboard")
						q-item-section Highscores

					q-item(to="/contact" exact clickable v-ripple)
						q-item-section(avatar)
							q-icon(name="contact_page")
						q-item-section Contact

					q-item(to="/support_me" exact clickable v-ripple)
						q-item-section(avatar)
							q-icon(name="volunteer_activism")
						q-item-section Support Me

		q-page-container
			router-view
</template>

<script>
import LoginHandler from 'components/LoginHandler.vue';
import { useAuthenticator } from 'src/composables/useAuthenticator';

export default {
	name: 'MainLayout',
	components: { LoginHandler },
	data() {
		const { accountName, isAuthenticated, getUser } = useAuthenticator();
		return {
			accountName,
			leftDrawerOpen: false,
			closeDrawer() {
				leftDrawerOpen = false;
			},
		};
	}
};
</script>

<style>
.justify-right {
	display: flex;
	justify-content: right;
	align-items: center;
}
</style>
