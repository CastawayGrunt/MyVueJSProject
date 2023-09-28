import { getAPIGames, type GameSearchResponse } from '@/services/boardGamesApi'
import { defineStore } from 'pinia'

export const useGameSearchStore = defineStore('gameSearch', {
  state: () => {
    return {
      games: null as GameSearchResponse[] | null
    }
  },
  getters: {},
  actions: {
    async getSearchGames(query: string) {
      if (query.length > 0) {
        const searchResults = await getAPIGames(query)
        if (searchResults?.length !== undefined) {
          const sortedResults = this.sortResults(searchResults)
          const filteredResults = this.removeDuplicates(sortedResults)

          return (this.games = filteredResults)
        }
      }
    },
    sortResults(resultsToSort: GameSearchResponse[]) {
      const list = resultsToSort
      list.sort((a, b) => {
        return a.yearpublished?.['@_value'] - b.yearpublished?.['@_value']
      })
      return list
    },
    removeDuplicates(list: GameSearchResponse[]) {
      // https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
      const uniqueList = [...new Map(list.map((item) => [item['@_id'], item])).values()]

      return uniqueList
    }
  }
})
