<template>
  <div class="d-flex flex-column md:flex-row justify-content-between mb-2">
    <SearchBar @onSubmit="searchTitle" placeholder="Search for a game..." />
    <CollectionNavGroup />
  </div>
  <div v-if="loadingGamesStatus === loadingGamesEnum.init" class="d-flex justify-content-center">
    <p class="text-center">Use the search bar to find a game</p>
  </div>
  <LoadingSpinner v-else-if="loadingGamesStatus === loadingGamesEnum.resultsLoading" />
  <div
    v-else-if="loadingGamesStatus === loadingGamesEnum.noResults"
    class="d-flex justify-content-center"
  >
    <p class="text-center">No results found, try again</p>
  </div>

  <SearchTable
    v-else-if="loadingGamesStatus === loadingGamesEnum.resultsLoaded"
    :games="results"
    @openAddGameModal="openAddGameModal"
  />
  <AddGameModal
    v-if="activeGame"
    :game="activeGame"
    @cancelAddGame="resetActiveGame"
    @addGame="addGame"
  />
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import CollectionNavGroup from '@/components/gameCollection/CollectionNavGroup.vue'
import SearchTable from '@/components/gameCollection/GameAdd/SearchTable.vue'
import AddGameModal from '@/components/gameCollection/GameAdd/AddGameModal.vue'
import {
  getGameDetails,
  type GameSearchResponse,
  type GameIdResponse
} from '@/services/boardGamesApi'
import { loadingGamesEnum, loadingGameEnum } from '@/enums/modules/LoadingEnum'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useGameSearchStore } from '@/stores/gameSearch'
import { useToast } from 'primevue/usetoast'
import { findGameName } from '@/helpers/stringHelpers'

const results = ref([] as GameSearchResponse[])
const loadingGamesStatus = ref('init')
const loadingGameStatus = ref('init')
const activeGame = ref({} as GameIdResponse)
const toast = useToast()

const gameSearchStore = useGameSearchStore()

const searchTitle = async (query: string) => {
  if (query === '') {
    loadingGamesStatus.value = loadingGamesEnum.init
    return (results.value = [])
  }

  loadingGamesStatus.value = loadingGamesEnum.resultsLoading

  const getGames = await gameSearchStore.getSearchGames(query)

  const searchResults = getGames
  if (searchResults === undefined || searchResults.length === 0) {
    loadingGamesStatus.value = loadingGamesEnum.noResults
    return
  }

  loadingGamesStatus.value = loadingGamesEnum.resultsLoaded
  return (results.value = searchResults)
}

const searchGameById = async (query: number) => {
  if (query.toString().trim() === '') {
    return resetActiveGame()
  }

  loadingGameStatus.value = loadingGameEnum.resultsLoading
  const searchResults = await getGameDetails(query)
  if (searchResults === undefined) {
    return
  }
  activeGame.value = searchResults

  loadingGameStatus.value = loadingGameEnum.resultsLoaded
  return
}

const openAddGameModal = async (gameId: number) => {
  const gameToAdd = await searchGameById(gameId)
  return gameToAdd
}

const resetActiveGame = () => {
  activeGame.value = {} as GameIdResponse
}

const addGame = async (game: GameIdResponse) => {
  const userStore = useUserStore()

  await userStore.addGame(game)
  const name = findGameName(game)

  toast.add({
    severity: 'success',
    summary: 'Game Added',
    detail: `${name} has been added to your collection`,
    life: 3000
  })
  resetActiveGame()
}
</script>

<style scoped></style>
