<template>
  <div class="d-flex flex-column flex-md-row justify-content-between mb-2 mb-md-4">
    <SearchBar @onSubmit="filterGames" placeholder="Search Collection" />
    <SortCollection
      class="order-2 order-md-0"
      :disableButton="disableButton"
      @sortName="sortName()"
      @sortYear="sortYear()"
      @sortRating="sortRating()"
    />
    <CollectionNavGroup />
  </div>
  <div>
    <p v-if="loadingGamesStatus === loadingGamesEnum.init" class="d-flex justify-content-center">
      Start your collection by clicking Add New Game
    </p>
    <LoadingSpinner v-else-if="loadingGamesStatus === loadingGamesEnum.resultsLoading" />
    <div
      class="row row-cols-1 row-cols-lg-2"
      v-else-if="loadingGamesStatus === loadingGamesEnum.resultsLoaded"
    >
      <GameSummary
        v-for="game in searchResults"
        :key="game.bggId"
        :game="game"
        @onDeleteGame="removeGame(game)"
      />
    </div>
    <p v-else class="d-flex justify-content-center">No games found</p>
  </div>
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import GameSummary from '@/components/gameCollection/GameView/GameSummary.vue'
import SortCollection from '@/components/gameCollection/GameView/SortCollection.vue'
import CollectionNavGroup from '@/components/gameCollection/CollectionNavGroup.vue'
import { loadingGamesEnum } from '@/enums/modules/LoadingEnum'
import { ratingAverage } from '@/helpers/ratingsHelpers'

import { ref, onMounted } from 'vue'
import { type GameType } from '@/services/fireGameData'
import { useUserStore } from '@/stores/user'

const searchResults = ref([] as GameType[])
const collection = ref([] as GameType[])
const loadingGamesStatus = ref('init')
const disableButton = ref('name')

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
  const games = useUserStore().games

  if (!games) {
    const games = await useUserStore().getGames()
    if (games) {
      collection.value = games
      return (loadingGamesStatus.value = loadingGamesEnum.resultsLoaded)
    }
  }

  if (games && games?.length > 0) {
    collection.value = games
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
  disableButton.value = 'name'
}

const sortYear = () => {
  const sortedGames = searchResults.value.sort((a, b) => {
    if (a.yearPublished < b.yearPublished) {
      return -1
    }
    if (a.yearPublished > b.yearPublished) {
      return 1
    }
    return 0
  })
  searchResults.value = sortedGames
  disableButton.value = 'year'
}

const sortRating = () => {
  const sortedGames = searchResults.value.sort((a, b) => {
    const aRating = ratingAverage(a.rating)
    const bRating = ratingAverage(b.rating)
    if (aRating.formattedAverageString > bRating.formattedAverageString) {
      return -1
    }
    if (aRating.formattedAverageString < bRating.formattedAverageString) {
      return 1
    }
    return 0
  })
  searchResults.value = sortedGames
  disableButton.value = 'rating'
}

const removeGame = async (game: GameType) => {
  const gameRemoved = await useUserStore().deleteUserGame(game)
  if (gameRemoved) {
    collection.value = collection.value.filter((g) => g.bggId !== game.bggId)
    searchResults.value = collection.value
  }
}

onMounted(async () => {
  await loadCollection()
  searchResults.value = collection.value
  sortName()
})
</script>

<style scoped></style>
