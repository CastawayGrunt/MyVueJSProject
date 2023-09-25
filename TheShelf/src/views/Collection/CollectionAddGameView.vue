<template>
  <div class="d-flex flex-column flex-md-row justify-content-between mb-2">
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
  <AppPagination
    v-if="loadingGamesStatus === loadingGamesEnum.resultsLoaded"
    :pageCount="pages"
    :current-page="currentPage"
    :first-page="firstPage"
    :last-page="lastPage"
    @onNextClicked="onNext"
    @onPrevClicked="onPrev"
    @onPageClicked="onPage"
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
import AppPagination from '@/components/gameCollection/AppPagination.vue'
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

const results = ref([] as GameSearchResponse[])
const loadingGamesStatus = ref('init')
const loadingGameStatus = ref('init')
const activeGame = ref({} as GameIdResponse)
const pages = ref(0)
const currentPage = ref(1)
const firstPage = ref(true)
const lastPage = ref(false)

const searchTitle = async (query: string) => {
  const gameSearchStore = useGameSearchStore()
  if (query === '') {
    loadingGamesStatus.value = loadingGamesEnum.init
    return (results.value = [])
  }

  loadingGamesStatus.value = loadingGamesEnum.resultsLoading

  await gameSearchStore.getSearchGames(query)

  const searchResults = updatePage()
  if (searchResults === undefined || searchResults.length === 0) {
    loadingGamesStatus.value = loadingGamesEnum.noResults
    return
  }

  pages.value = gameSearchStore.pageCount

  loadingGamesStatus.value = loadingGamesEnum.resultsLoaded
  return (results.value = searchResults)
}

const onNext = () => {
  currentPage.value++
  if (currentPage.value === pages.value) {
    lastPage.value = true
  }
  if (currentPage.value > 1) {
    firstPage.value = false
  }
  updatePage()
}

const onPrev = () => {
  currentPage.value--
  if (currentPage.value === 1) {
    firstPage.value = true
  }
  if (currentPage.value < pages.value) {
    lastPage.value = false
  }
  updatePage()
}

const onPage = (page: number) => {
  currentPage.value = page
  if (currentPage.value === pages.value) {
    lastPage.value = true
  }
  if (currentPage.value === 1) {
    firstPage.value = true
  }
  updatePage()
}

const updatePage = () => {
  firstPage.value = currentPage.value == 1
  lastPage.value = currentPage.value == pages.value

  const searchResults = useGameSearchStore().getPage(currentPage.value)
  if (searchResults === undefined || searchResults.page.length === 0) {
    return
  }
  return (results.value = searchResults.page)
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

  resetActiveGame()
}
</script>

<style scoped></style>
