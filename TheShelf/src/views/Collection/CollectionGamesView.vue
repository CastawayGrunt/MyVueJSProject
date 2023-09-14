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
    <p v-else class="d-flex justify-content-center">No search results</p>
  </div>
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import GameSummary from '@/components/gameCollection/GameSummary.vue'

import { ref, onMounted, computed } from 'vue'
import { type GameType } from '@/services/fireGameData'
import { useUserStore } from '@/stores/user'

const searchResults = ref([{} as GameType])
const collection = ref([{} as GameType])

const filterGames = (query: string) => {
  console.log('filtering?')
  const filteredGames = collection.value.filter((game) => {
    return game.name.toLowerCase().includes(query.toLowerCase())
  })
  return (searchResults.value = filteredGames)
}

const listPopulated = computed((): boolean => {
  // debugger
  console.log('results', searchResults.value)
  console.log('collection', collection.value)
  console.log('start', searchResults.value.length, searchResults.value)
  if (searchResults.value.length == 0) {
    console.log('populated false', searchResults.value.length, searchResults.value)
    return false
  } else {
    console.log('populated true', searchResults.value.length, searchResults.value)
    return true
  }
})

onMounted(() => {
  const loadCollection = useUserStore().getGames()
  if (loadCollection === null) {
    searchResults.value = []
  } else {
    collection.value = loadCollection
    searchResults.value = loadCollection
    console.log('mountcollection', collection.value)
    console.log('mountsearchResults', searchResults.value)
  }
})
</script>

<style scoped></style>
