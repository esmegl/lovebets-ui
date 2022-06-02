<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'src/store';
import { api } from 'src/api/index';
import { GetTableRowsParams, GenericTable } from 'src/types';
import { TableIndexType } from 'src/types/Api';
import { PaginationSettings } from 'src/types';

export default defineComponent({
  name: 'ContractTable',
  setup() {
    const store = useStore();
    const options = computed(() =>
      store.state.account.abi.abi.tables.map((table) => {
        return table.name;
      })
    );
    const account = computed(() => store.state.account.abi.account_name);
    const table = ref(options.value[0]);
    const scope = ref<string>(store.state.account.abi.account_name);
    const lower = ref<string>(null);
    const upper = ref<string>(null);
    const limit = ref<string>('20');
    const pagination = ref({
      sortBy: 'timestamp',
      descending: true,
      page: 1,
      rowsPerPage: Number(limit.value) || 10
    } as PaginationSettings);

    const rows = ref([]);
    async function getRows() {
      console.log('here');
      const params = {
        code: account.value,
        limit: limit.value,
        lower_bound: lower.value as unknown as TableIndexType,
        scope: scope.value,
        table: table.value,
        json: true,
        key_type: 'i64',
        upper_bound: upper.value as unknown as TableIndexType
      } as GetTableRowsParams;
      rows.value = ((await api.getTableRows(params)) as GenericTable).rows;
    }
    async function updateRows(val: string) {
      const params = {
        code: account.value,
        limit: limit.value,
        lower_bound: lower.value as unknown as TableIndexType,
        scope: scope.value,
        table: val,
        json: true,
        key_type: 'i64',
        upper_bound: upper.value as unknown as TableIndexType
      } as GetTableRowsParams;
      rows.value = ((await api.getTableRows(params)) as GenericTable).rows;
    }
    onMounted(async () => {
      await getRows();
    });

    return {
      table,
      options,
      scope,
      lower,
      upper,
      limit,
      rows,
      getRows,
      pagination,
      updateRows
    };
  }
});
</script>

<template lang="pug">
q-card(
  flat
  style="background: #f4f0fb"
)
  q-card-section.q-pl-md(style="background: #eae2f7")
    div.q-pb-sm.text-subtitle2.text-bold Select table
    .row.justify-content.full-width
      .col-10
        q-select(outlined @update:model-value="updateRows" dense v-model="table" :options="options" color="primary" style="background: #ffffff")
      .col-2.q-pl-md
        q-btn.full-width( unelevated color="primary" label="Refresh" size="15px" @click="getRows")

  q-card-section.q-pt-none
    .row.q-py-md.q-col-gutter-md
      .col-xs-6.col-sm-3
        .text-bold.q-pb-sm Scope
        q-input(outlined @blur="getRows"  dense v-model="scope" style="background: #ffffff")
      .col-xs-6.col-sm-3
        .text-bold.q-pb-sm Lower Bound
        q-input(outlined @blur="getRows" v-model="lower" dense style="background: #ffffff")
      .col-xs-6.col-sm-3
        .text-bold.q-pb-sm Upper Bound
        q-input(outlined @blur="getRows" v-model="upper" dense style="background: #ffffff")
      .col-xs-6.col-sm-3
        .text-bold.q-pb-sm Limit
        q-input(outlined @blur="getRows" v-model="limit" dense style="background: #ffffff")

  q-card-section.q-pt-none
    q-table(
      :rows="rows"
      v-model:pagination="pagination"
    )
      template( v-slot:pagination="scope")
        div.row.col-12.q-mt-md.q-mb-xl()
        div.col-1(align="left")
          q-btn.q-ml-xs.q-mr-xs.col.button-primary(
            :disable="scope.isFirstPage"
            @click="scope.prevPage") PREV
        q-space
        div.col-1(align="right")
          q-btn.q-ml-xs.q-mr-xs.col.button-primary(
            :disable="scope.isLastPage"
            @click="scope.nextPage") NEXT

</template>

<style lang="sass"></style>