<script lang="ts">
import { defineComponent, toRef } from 'vue';

export default defineComponent({
  name: 'TransactionsTable',
  props: {
    account: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const type = toRef(props, 'type');
    const account = toRef(props, 'account');

    return {
      accType: type,
      accAccount: account
    };
  }
});
</script>

<template lang="pug">
a(:href=" '/' + type + '/' + accAccount" class="hover-dec") {{type === 'transaction' ? accAccount.slice(0, 8) : accAccount}}
</template>

<style lang="sass" scoped>
.hover-dec
  text-decoration: none
  &:hover
    text-decoration: underline
</style>
