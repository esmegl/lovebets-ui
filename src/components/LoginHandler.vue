<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import LoginHandlerDropdown from './LoginHandlerDropdown.vue';
import WalletModal from './WalletModal.vue';
import { Authenticator } from 'universal-authenticator-library';

export default defineComponent({
  name: 'LoginHandler',
  components: { LoginHandlerDropdown, WalletModal },
  data() {
    return {
      showDropdown: false,
      showModal: false
    };
  },
  mounted() {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      this.setAccountName(storedAccount);
      const ualName = localStorage.getItem('autoLogin');
      const ual: Authenticator = this.$ual
        .getAuthenticators()
        .availableAuthenticators.find((a) => a.getName() === ualName);
      void this.login({ account: storedAccount, authenticator: ual });
    }
  },
  computed: {
    ...mapGetters({ account: 'account/accountName' })
  },
  methods: {
    ...mapMutations({
      setAccountName: 'account/setAccountName'
    }),
    ...mapActions({
      login: 'account/login'
    })
  }
});
</script>

<template lang="pug">
div.col-lg-5.col-sm-3.col-md-2.col-lg-2
  .q-px-xs-xs.q-px-sm-xs.q-px-md-md.q-px-lg-md.justify-right
    LoginHandlerDropdown(v-if='account' :account='account' color='white' class='text-red')
    q-btn.bg-white.text-primary.btn-login(v-else @click='showModal = true' label='Login' icon-right='login')
    WalletModal( v-model='showModal')
</template>

<style scoped lang="sass">
.btn-login
  width: 60%
  min-width: 120px
  max-width: 140px
  height: 40px
</style>
