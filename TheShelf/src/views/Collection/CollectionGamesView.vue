<template>
  <div class="d-flex flex-column flex-md-row justify-content-end mb-2">
    <SearchBar @onSubmit="filterGames" placeholder="Search Collection" />
    <RouterLink to="/collection/add" class="btn btn-primary mt-2 mt-md-0"> Add Game </RouterLink>
  </div>
  <div>
    <div class="row" v-if="listPopulated">
      <GameSummary v-for="game in searchResults" :key="game.id" :game="game" />
    </div>
    <p v-else>No search results</p>
  </div>
</template>

<script lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import GameSummary from '@/components/gameCollection/GameSummary.vue'

import { GameType } from '@/stores/game'
import { useGameStore } from '@/stores/game'

export default {
  name: 'CollectionGamesView',
  data() {
    return {
      searchResults: [{} as GameType],
      collection: [{} as GameType],
      query: ''
    }
  },
  components: {
    GameSummary,
    SearchBar
  },
  methods: {
    filterGames(query: string) {
      const filteredGames = this.collection.filter((game) => {
        return game.name.toLowerCase().includes(query.toLowerCase())
      })
      return (this.searchResults = filteredGames)
    }
  },
  computed: {
    listPopulated(): boolean {
      if (this.searchResults.length === 0) {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    const gameStore = useGameStore()
    const loadCollection = gameStore.getGames

    if (loadCollection === null) {
      return (this.searchResults = [])
    }

    return (this.searchResults = loadCollection), (this.collection = loadCollection)
  }
}
</script>

<style scoped></style>
