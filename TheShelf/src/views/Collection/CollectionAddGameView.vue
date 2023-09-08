<template>
  <div>
    <SearchBar @onSubmit="search" />
  </div>
  <p v-for="game in results" :key="game['@_id']">
    {{ `${game.name['@_value']} ${game.yearpublished?.['@_value']}` }}{{ game['@_type'] }}
  </p>
</template>

<script lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import { searchGames, GameDetailResponse } from '@/services/boardGamesApi'

export default {
  name: 'CollectionAddGameView',
  components: {
    SearchBar
  },
  data() {
    return {
      results: [] as GameDetailResponse[]
    }
  },
  methods: {
    async search(query: string) {
      if (query === '') {
        return (this.results = [])
      }
      const searchResults = await searchGames(query)
      this.results = searchResults

      const sortedResults = this.sortResults(this.results)
      return sortedResults
    },
    sortResults(resultsToSort: GameDetailResponse[]) {
      // sort results by year published
      const list = resultsToSort
      list.sort((a, b) => {
        return a.yearpublished?.['@_value'] - b.yearpublished?.['@_value']
      })
      return list
    }
  },

  computed: {}
}
</script>

<style scoped></style>
