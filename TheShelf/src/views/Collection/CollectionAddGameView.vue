<template>
  <div class="d-flex flex-column flex-md-row justify-content-center mb-2">
    <SearchBar @onSubmit="searchTitle" placeholder="Search for a game..." />
    <CollectionNavGroup />
  </div>
  <div v-if="loadingGamesStatus === loadingGamesEnum.init" class="d-flex justify-content-center">
    <p class="text-center">Use the search bar to find a game</p>
  </div>
  <div
    v-else-if="loadingGamesStatus === loadingGamesEnum.resultsLoading"
    class="d-flex justify-content-center align-items-center h-100"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
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
    @cancelAddGame="cancelAdd"
    @addGame="addGame"
  />
</template>

<script lang="ts" setup>
import CollectionNavGroup from '@/components/gameCollection/CollectionNavGroup.vue'
import SearchBar from '@/components/SearchBar.vue'
import SearchTable from '@/components/gameCollection/SearchTable.vue'
import AddGameModal from '@/components/gameCollection/AddGameModal.vue'
import {
  getGames,
  getGameDetails,
  type GameSearchResponse,
  type GameIdResponse
} from '@/services/boardGamesApi'
import { loadingGamesEnum, loadingGameEnum } from '@/enums/modules/LoadingEnum'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
// import type { GameCollection } from '@/services/fireUserData'

let results = ref([] as GameSearchResponse[])
let loadingGamesStatus = ref('init')
let loadingGameStatus = ref('init')
let activeGame = ref({} as GameIdResponse)

const searchTitle = async (query: string) => {
  if (query === '') {
    loadingGamesStatus.value = loadingGamesEnum.init
    return (results.value = [])
  }

  loadingGamesStatus.value = loadingGamesEnum.resultsLoading

  const searchResults = await getGames(query)
  if (searchResults === undefined || searchResults.length === 0) {
    loadingGamesStatus.value = loadingGamesEnum.noResults
    return
  }

  const sortedResults = sortResults(searchResults)
  const filteredResults = removeDuplicates(sortedResults)

  loadingGamesStatus.value = loadingGamesEnum.resultsLoaded
  return (results.value = filteredResults)
}

const removeDuplicates = (list: GameSearchResponse[]) => {
  // https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
  const uniqueList = [...new Map(list.map((item) => [item['@_id'], item])).values()]

  return uniqueList
}

const sortResults = (resultsToSort: GameSearchResponse[]) => {
  const list = resultsToSort
  list.sort((a, b) => {
    return a.yearpublished?.['@_value'] - b.yearpublished?.['@_value']
  })
  return list
}

const searchGameById = async (query: number) => {
  if (query.toString().trim() === '') {
    return (activeGame.value = {} as GameIdResponse)
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

const cancelAdd = () => {
  activeGame.value = {} as GameIdResponse
}

const addGame = async (game: GameIdResponse) => {
  console.log('game', game)
  const userStore = useUserStore()

  await userStore.addGame(game)

  activeGame.value = {} as GameIdResponse
}
</script>

<style scoped></style>
