<template>
  <div class="card p-3">
    <DataTable
      :value="games"
      paginator
      stripedRows
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      :paginatorTemplate="paginatorTemplate"
      currentPageReportTemplate="{totalRecords} results"
    >
      <Column field="name.@_value" sortable header="Name">
        <template #body="slotProps">
          <span v-html="slotProps.data.name['@_value']"></span>
        </template>
      </Column>
      <Column field="yearpublished.@_value" sortable header="Year Published">
        <template #body="slotProps">
          {{ slotProps.data.yearpublished?.['@_value'] }}
        </template>
      </Column>
      <Column v-if="showType" field="@_type" sortable header="Type">
        <template #body="slotProps">
          {{ slotProps.data['@_type'] === 'boardgame' ? 'Board&nbsp;Game' : 'Expansion' }}
        </template>
      </Column>
      <Column header="Action">
        <template #body="slotProps">
          <button
            :disabled="gameExists(slotProps.data['@_id']) || addingGame"
            class="btn btn-primary btn-sm"
            data-toggle="modal"
            data-target="#addGameModal"
            @click="$emit('openAddGameModal', slotProps.data['@_id'])"
          >
            Add
          </button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { type GameSearchResponse } from '@/services/boardGamesApi'
import { useUserStore } from '@/stores/user'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { onMounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { setPaginatorTemplate } from '@/helpers/paginatorTemplateHelper'

const { width } = useWindowSize()
const userStore = useUserStore()

defineProps<{
  games: GameSearchResponse[]
  addingGame: boolean
}>()

const paginatorTemplate = ref('')
const showType = ref(true)

const gameExists = (gameId: number): boolean => {
  let gameExists = false
  userStore.user?.games?.find((game) => {
    if (game.gameId === gameId?.toString()) {
      return (gameExists = true)
    }
  })
  return gameExists
}

const updateShowType = (width: number) => {
  if (width < 768) {
    showType.value = false
  } else {
    showType.value = true
  }
}

onMounted(() => {
  updateShowType(width.value)
  paginatorTemplate.value = setPaginatorTemplate(width.value)
})

watch(width, (newWidth, oldWidth) => {
  updateShowType(newWidth)
  if (newWidth !== oldWidth) {
    paginatorTemplate.value = setPaginatorTemplate(newWidth)
  }
})
</script>

<style scoped></style>
