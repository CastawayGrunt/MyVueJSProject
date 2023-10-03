<template>
  <div class="d-flex flex-column md:flex-row justify-content-between mb-2 md:mb-4">
    <SearchBar @onSubmit="filterGames" placeholder="Search Collection" />
    <CollectionNavGroup />
  </div>
  <div>
    <p v-if="loadingGamesStatus === loadingGamesEnum.init" class="d-flex justify-content-center">
      Start your collection by clicking Add New Game
    </p>
    <LoadingSpinner v-else-if="loadingGamesStatus === loadingGamesEnum.resultsLoading" />
    <div v-else-if="loadingGamesStatus === loadingGamesEnum.resultsLoaded">
      <GameSummary
        :games="searchResults"
        @onDeleteGame="removeGame"
        @showRemoveGameModal="showRemoveGameModal"
      />
      <RemoveGameModal
        v-if="removeGameModalVisible"
        :game="activeGame"
        @deleteGame="removeGame"
        @cancelDelete="hideRemoveGameModal()"
      />
    </div>
    <p v-else class="d-flex justify-content-center">No games found</p>
  </div>
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import RemoveGameModal from '@/components/gameCollection/GameView/RemoveGameModal.vue'
import GameSummary from '@/components/gameCollection/GameView/GameSummary.vue'
import CollectionNavGroup from '@/components/gameCollection/CollectionNavGroup.vue'
import { loadingGamesEnum } from '@/enums/modules/LoadingEnum'

import { ref, onMounted } from 'vue'
import { type GameType } from '@/services/fireGameData'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import { watchArray } from '@vueuse/core'

const searchResults = ref([] as GameType[])
const collection = ref([] as GameType[])
const loadingGamesStatus = ref('init')
const removeGameModalVisible = ref(false)
const activeGame = ref({} as GameType)
const toast = useToast()

const filterGames = (query: string) => {
  const filteredGames = collection.value?.filter((game) => {
    return game.name.toLowerCase().includes(query.toLowerCase())
  })

  if (filteredGames === undefined || filteredGames.length === 0) {
    loadingGamesStatus.value = loadingGamesEnum.noResults
  } else {
    loadingGamesStatus.value = loadingGamesEnum.resultsLoaded
  }
  return (searchResults.value = filteredGames)
}

const loadCollection = async () => {
  loadingGamesStatus.value = loadingGamesEnum.resultsLoading
  const gamesDb = useUserStore().gamesData

  if (!gamesDb) {
    const fetchedGames = await useUserStore().getGames()
    if (fetchedGames) {
      collection.value = fetchedGames
      return (loadingGamesStatus.value = loadingGamesEnum.resultsLoaded)
    }
  }

  if (gamesDb && gamesDb?.length > 0) {
    collection.value = gamesDb
    return (loadingGamesStatus.value = loadingGamesEnum.resultsLoaded)
  } else {
    return (loadingGamesStatus.value = loadingGamesEnum.init)
  }
}

const sortName = () => {
  const sortedGames = searchResults.value.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
  searchResults.value = sortedGames
}

const showRemoveGameModal = (data: GameType) => {
  removeGameModalVisible.value = true
  activeGame.value = data
}

const hideRemoveGameModal = () => {
  removeGameModalVisible.value = false
  activeGame.value = {} as GameType
}

const removeGame = async (game: GameType) => {
  const gameRemoved = await useUserStore().deleteUserGame(game)
  if (gameRemoved) {
    collection.value = collection.value.filter((g) => g.bggId !== game.bggId)
    searchResults.value = collection.value
    toast.add({
      severity: 'success',
      summary: 'Game Removed',
      detail: `${game.name} has been removed from your collection`,
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `There was an error removing ${game.name} from your collection`,
      life: 3000
    })
  }
}

onMounted(async () => {
  await loadCollection()
  searchResults.value = collection.value
  sortName()
})

watchArray(
  () => collection.value,
  (newcollection, oldcollection) => {
    if (newcollection !== oldcollection) {
      searchResults.value = newcollection
    }
  }
)
</script>

<style scoped></style>
