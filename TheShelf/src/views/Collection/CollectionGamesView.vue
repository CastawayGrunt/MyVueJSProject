<template>
  <div class="d-flex flex-column flex-md-row justify-content-end mb-2">
    <SearchBar @onSubmit="filterGames" placeholder="Search Collection" />
    <RouterLink to="/collection/add" class="btn btn-primary mt-2 mt-md-0">
      Add New Game
    </RouterLink>
  </div>
  <div>
    <div class="row" v-if="listPopulated">
      <GameSummary v-for="game in searchResults" :key="game.bggId" :game="game" />
    </div>
    <p v-else class="d-flex justify-content-center">No results found</p>
  </div>
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import GameSummary from '@/components/gameCollection/GameSummary.vue'

import { ref } from 'vue'
import { type GameType } from '@/services/fireGameData'
import { useUserStore } from '@/stores/user'

const searchResults = ref([{} as GameType])
const collection = ref([{} as GameType])
const listPopulated = ref(false)

const filterGames = (query: string) => {
  console.log('filtering?', query)
  const filteredGames = collection.value.filter((game) => {
    return game.name.toLowerCase().includes(query.toLowerCase())
  })
  console.log('filtersearchResults', searchResults.value)
  if (filteredGames.length === 0) {
    listPopulated.value = false
  } else {
    listPopulated.value = true
  }
  return (searchResults.value = filteredGames)
}

const loadCollection = useUserStore().getGames()
console.log('loadCollection', loadCollection)
if (loadCollection === null) {
  searchResults.value = []
} else {
  collection.value = loadCollection
  searchResults.value = loadCollection
  console.log('mountcollection', collection.value)
  console.log('mountsearchResults', searchResults.value)
  listPopulated.value = true
  console.log('listPopulated', listPopulated.value)
}
</script>

<style scoped></style>
