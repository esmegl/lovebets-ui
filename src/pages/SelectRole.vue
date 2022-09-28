<template lang="pug">
q-page.q-px-md
  div
    h2.center Select you role in the wedding
  div(v-if='account')
    div.row.q-pa-md.items-start.q-gutter-md.center
      //- Minister
      div.col-12.col-md
        q-card
          q-card-section(horizontal)
            q-img(src="~assets/minister.jpg")
          q-separator
          q-card-actions.center
            q-btn(
              size="lg"
              flat
              text-color="blue"
              label="I am a Minister"
              to="/start_wedding"
            )

      //- Bettors
      div.col-12.col-md
        q-card
          q-card-section(horizontal)
            q-img(src="~assets/rings_1.jpg")
          q-separator
          q-card-actions.center
            q-btn(
              size="lg"
              flat
              text-color="blue"
              label="I am going to marry"
              to="/bettor_approval"
            )

      //- Witnesses
      div.col-12.col-md
        q-card
          q-card-section(horizontal)
            q-img(src="~assets/wedding_background.jpg")
          q-separator
          q-card-actions.center
            q-btn(
              size="lg"
              flat
              text-color="blue"
              label="I am a Witness"
              to="/witness_approval"
            )
  div(v-else)
    h4.center Please login to start
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({ account: 'account/accountName' })
  }
};
</script>

<style lang="sass">
.center 
  display: flex
  justify-content: center
  align-items: center
</style>
