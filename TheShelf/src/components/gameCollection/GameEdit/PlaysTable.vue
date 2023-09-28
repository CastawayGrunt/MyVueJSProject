<template>
  <div class="card p-3">
    <DataTable
      :value="userPlays"
      striped-rows
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
    >
      <ColumnGroup>
        <Row>
          <Column field="datePlayed" sortable header="Date"></Column>
          <Column field="location" sortable header="Location"></Column>
          <Column header="Players"></Column>
          <Column header="Players.Name"></Column>
          <Column header="Players.Score"></Column>
          <Column header="Players.Winnner"></Column>
          <Column field="Actions" header="Actions"></Column>
        </Row>
      </ColumnGroup>
      <Column field="datePlayed" sortable header="Date"></Column>
      <Column field="location" sortable header="Location"></Column>
      <Column field="players.name" header="Players">
        <template #body="slotProps">
          <table
            v-if="slotProps.data.players.length > 0"
            class="table table-hover table-sm table-responsive-md user-select-none"
          >
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Score</th>
                <th scope="col">Winnner</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="players in slotProps.data.players" :key="players.name">
                <th scope="row">{{ players.name }}</th>
                <td>{{ players.score }}</td>
                <td class="text-center">{{ players.winner ? '&#10003;' : '' }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </Column>
      <Column field="Actions" header="Actions">
        <template #body="slotProps">
          <button
            class="btn btn-outline-danger btn-sm"
            data-toggle="modal"
            data-target="#removePlayModal"
            @click="$emit('openRemoveGamePlayModal', slotProps.data)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import type { Plays } from '@/services/fireUserData'
import DataTable from 'primevue/datatable'
import ColumnGroup from 'primevue/columngroup'
import Column from 'primevue/column'
import Row from 'primevue/row'
import { onMounted, watch, ref } from 'vue'

const props = defineProps<{
  userPlays: Plays[]
}>()

const tableData = ref([] as Plays[])

onMounted(() => {
  tableData.value = props.userPlays
})

watch(
  () => props.userPlays,
  (newData) => {
    tableData.value = newData
  }
)
</script>

<style scoped></style>
