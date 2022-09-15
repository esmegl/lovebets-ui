<template lang="pug">
q-page.bg-image
  div.q-pa-md.doc-container
    div.row.justify-center
      div.col-8
        q-img(src="~assets/lovebets_logo_full.svg")
    div.row.q-pt-xl
      div.col-12.col-md.self-center.center
        q-btn.btn.bg-primary.text-white(
          to="/select_role"
          label="Get married!"
          size="lg"
        )
      div.col-12.col-md.self-center.center
        q-btn.btn.bg-white.text-primary(
          to="/guide"
          label="Guide"
          size="lg"
        )
  //- About section
  div.row.q-pa-lg.text-white
    h3.text-bold About this project

  div.row.q-pa-lg.q-pb-xl.justify-center.q-gutter-md
    div.col-12.col-md.text-white
      q-card.card-bg(flat style="height: 250px")
        q-card-section
          div.text-h6 Register your love on blockchain
        q-card-section
          div.q-pt-sm Lovebets is a smart contract that allows you to register your marriage on the Telos blockchain and bet you will be together until death do you part.
          div.q-pt-sm You can choose your ministier and invite all the witnesses you want!

    div.col-12.col-md.text-white
      q-card.card-bg(style="height: 250px")
        q-card-section
          div.text-h6 Tell everyone how much you love your significant other!
        q-separator(inset)
        q-card-section.q-pt-sm You will be able to see the marriage's high scores, the more time you are together and the more you bet, the more points you get!

    div.col-12.col-md.text-white
      q-card.card-bg(style="height: 250px")
        q-card-section
          div.text-h6 Are you polyamorous?
          div.text-subtitle2 Lovebets is also for you!
        q-separator(inset)
        q-card-section
          div.q-pt-sm It also allows you to marry with multilple people. Don't stop being in the last vanguard of thechnology.
    div.col-12.col-md.text-white
      q-card.card-bg(style="height: 250px")
        q-card-section
          div.text-h6 Marriage not going so well?
          div.text-subtitle2 Don't worry!
        q-separator(inset)
        q-card-section
          div.q-pt-sm You can also divorce and your union will stop appearing on the blockchain. It is like a tattoo, it costs to get it and it costs to erase it.
</template>

<style lang="sass">
.center 
  display: flex
  justify-content: center
  align-items: center

.justify-right 
  display: flex
  justify-content: right
  align-items: center


.justify-left 
  display: flex
  justify-content: right
  align-items: center

.btn 
  top: 50%
  font-size: 16px
  padding: 15px 27px
  border: none
  cursor: pointer
  border-radius: 5px
  position: relative

.bg-image 
  background-image: url(../assets/bg2.jpg)
  background-repeat: repeat
  background-position: center
  background-size: auto

.card-bg
  background: rgba(0,0,0,0.6)
</style>
