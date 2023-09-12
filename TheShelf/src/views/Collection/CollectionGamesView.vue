<template>
  <div class="d-flex flex-column flex-md-row justify-content-end mb-2">
    <SearchBar @onSubmit="filterGames" placeholder="Search Collection" />
    <RouterLink to="/collection/add" class="btn btn-primary mt-2 mt-md-0">
      Add New Game
    </RouterLink>
  </div>
  <div>
    <div class="row" v-if="listPopulated()">
      <GameSummary v-for="game in searchResults" :key="game.id" :game="game" />
    </div>
    <p v-else>No search results</p>
  </div>
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import GameSummary from '@/components/gameCollection/GameSummary.vue'

import { ref, onMounted } from 'vue'
import { type GameType } from '@/stores/game'
import { useGameStore } from '@/stores/game'

const searchResults = ref([{} as GameType])
const collection = ref([{} as GameType])

const filterGames = (query: string) => {
  const filteredGames = collection.value.filter((game) => {
    return game.name.toLowerCase().includes(query.toLowerCase())
  })
  return (searchResults.value = filteredGames)
}

const listPopulated = (): boolean => {
  if (searchResults.value.length === 0) {
    return false
  } else {
    return true
  }
}
onMounted(() => {
  const gameStore = useGameStore()
  const loadCollection = gameStore.getGames

  if (loadCollection === null) {
    return (searchResults.value = [])
  }

  return (searchResults.value = loadCollection), (collection.value = loadCollection)
})
</script>

<style scoped></style>
