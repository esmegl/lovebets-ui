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
        q-list.text-white(padding)
          q-item(to="/" exact clickable v-ripple)
            q-item-section(avatar)
              q-icon(name="home")
            q-item-section Home

          q-item(to="/select_role" exact clickable v-ripple)
            q-item-section(avatar)
              q-icon(name="favorite")
            q-item-section Get Married!

          q-item(to="/guide" exact clickable v-ripple)
            q-item-section(avatar)
              q-icon(name="help")
            q-item-section Guide to use Lovebets

          q-item(to="/high_scores" exact clickable v-ripple)
            q-item-section(avatar)
              q-icon(name="leaderboard")
            q-item-section Highscores

          q-item(to="/contact" exact clickable v-ripple)
            q-item-section(avatar)
              q-icon(name="mail")
            q-item-section Contact

          q-item(to="/support_me" exact clickable v-ripple)
            q-item-section(avatar)
              q-icon(name="volunteer_activism")
            q-item-section Support Me

    q-page-container
      router-view
</template>

<script>
// import EssentialLink from "components/EssentialLink.vue";
// import ExamplePage from "components/ExamplePage.vue";
// import LoginButton from 'components/LoginButton.vue';
import LoginHandler from 'components/LoginHandler.vue';

const pagesData = [
  {
    title: 'Account',
    caption: 'Account profile and Hyperion history query example',
    icon: 'face',
    path: '/account/exampleuser1'
  },
  {
    title: 'Transfer',
    caption: 'Transfer example, sending/signing actions',
    icon: 'send',
    path: '/transfer'
  },
  {
    title: 'Streaming',
    caption: 'Hyperion event streaming example',
    icon: 'filter_alt',
    path: '/streaming'
  }
];

// const linksData = [
//   {
//     title: 'Use this template!',
//     caption: 'github.com/telosnetwork/ui-template',
//     icon: 'fas fa-rocket',
//     link: 'https://github.com/telosnetwork/ui-template'
//   },
//   {
//     title: 'Telos Github',
//     caption: 'github.com/telosnetwork',
//     icon: 'fab fa-github',
//     link: 'https://github.com/telosnetwork'
//   },
//   {
//     title: 'Telos Docs',
//     caption: 'docs.telos.net',
//     icon: 'menu_book',
//     link: 'https://docs.telos.net'
//   },
//   {
//     title: 'Telos Dev Telegram',
//     caption: 't.me/dappstelos',
//     icon: 'code',
//     link: 'https://t.me/dappstelos'
//   },
//   {
//     title: 'Telos Testnet Faucet',
//     caption: 'app.telos.net/testnet/developers',
//     icon: 'opacity',
//     link: 'https://app.telos.net/testnet/developers'
//   },
//   {
//     title: 'Quasar Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev'
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev'
//   }
// ];

export default {
  name: 'MainLayout',
  components: { LoginHandler },
  data() {
    return {
      leftDrawerOpen: false,
      closeDrawer() {
        leftDrawerOpen = false;
      },
      // essentialLinks: linksData,
      examplePages: pagesData
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
