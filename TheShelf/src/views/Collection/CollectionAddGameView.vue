<template>
  <div class="d-flex flex-column flex-md-row justify-content-center mb-2">
    <SearchBar @onSubmit="searchTitle" placeholder="Search game..." />
    <RouterLink to="/collection/games" class="btn btn-primary mt-2 mt-md-0">
      View Collection
    </RouterLink>
  </div>
  <div v-if="loadingStatus === loadingEnum.init" class="d-flex justify-content-center">
    <p class="text-center">Use the search bar to find a game</p>
  </div>
  <div v-else-if="loadingStatus === loadingEnum.noResults" class="d-flex justify-content-center">
    <p class="text-center">No results found, try again</p>
  </div>
  <div
    v-else-if="loadingStatus === loadingEnum.resultsLoading"
    class="d-flex justify-content-center"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <SearchTable
    v-else-if="loadingStatus === loadingEnum.resultsLoaded"
    :games="results"
    @openAddGameModal="openAddGameModal"
  />
  <AddGameModal :game="activeGame" @cancelAddGame="cancelAdd" @addGame="addGame" />
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import SearchTable from '@/components/gameCollection/SearchTable.vue'
import AddGameModal from '@/components/gameCollection/AddGameModal.vue'
import {
  getGames,
  getGameDetails,
  GameSearchResponse,
  GameIdResponse
} from '@/services/boardGamesApi'
import { ref } from 'vue'

const loadingEnum = {
  init: 'init',
  resultsLoading: 'resultsLoading',
  resultsLoaded: 'resultsLoaded',
  noResults: 'noResults'
}

let results = ref([] as GameSearchResponse[])
let loadingStatus = ref('init')
let activeGame = ref({} as GameIdResponse)

const searchTitle = async (query: string) => {
  if (query === '') {
    loadingStatus.value = loadingEnum.init
    return (results.value = [])
  }

  loadingStatus.value = loadingEnum.resultsLoading

  const searchResults = await getGames(query)
  results.value = searchResults

  if (results.value === undefined || results.value.length === 0) {
    loadingStatus.value = loadingEnum.noResults
    return
  }

  // const filteredResults = removeDuplicates(results.value)
  // console.log('filteredResults', filteredResults)
  const sortedResults = sortResults(results.value)
  console.log('sortedResults', sortedResults)

  loadingStatus.value = loadingEnum.resultsLoaded
  return sortedResults
}

// const removeDuplicates = (list: GameSearchResponse[]) => {
//   const uniqueList = list.filter((thing, index) => {
//     const _thing = JSON.stringify(thing)
//     return (
//       index ===
//       list.findIndex((obj) => {
//         return JSON.stringify(obj) === _thing
//       })
//     )
//   })
//   console.log('uniqueList', uniqueList)
//   return uniqueList
// }

const sortResults = (resultsToSort: GameSearchResponse[]) => {
  const list = resultsToSort
  list.sort((a, b) => {
    return a.yearpublished?.['@_value'] - b.yearpublished?.['@_value']
  })
  return list
}
const searchGameById = async (query: number) => {
  if (query.toString() === '') {
    return (activeGame.value = {} as GameIdResponse)
  }
  const searchResults = await getGameDetails(query)
  activeGame.value = searchResults

  return activeGame
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
  // await $store.dispatch('addGame', game)
  activeGame.value = {} as GameIdResponse
}
</script>

<style scoped></style>
