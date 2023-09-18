import { getAPIGames, type GameSearchResponse } from '@/services/boardGamesApi'
import { defineStore } from 'pinia'

const PAGE_SIZE = 10

const getPage = (source: GameSearchResponse[], page = 1) => {
  const skipped = skip(source, (page - 1) * PAGE_SIZE)
  const result = take(skipped, PAGE_SIZE)
  return {
    page: result,
    pageCount: Math.ceil(source.length / PAGE_SIZE)
  }
}

const skip = (source: GameSearchResponse[], n: number) => {
  return source.filter((v, i) => {
    if (i < n) {
      return false
    } else {
      return true
    }
  })
}

const take = (source: GameSearchResponse[], n: number) => {
  return source.filter((v, i) => {
    if (i < n) {
      return true
    } else {
      return false
    }
  })
}

export const useGameSearchStore = defineStore('gameSearch', {
  state: () => {
    return {
      games: null as GameSearchResponse[] | null,
      perPage: PAGE_SIZE,
      pageCount: 0
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

          return (
            (this.games = filteredResults),
            (this.pageCount = Math.ceil(filteredResults.length / PAGE_SIZE))
          )
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
    },
    getPage(page: number) {
      if (!this.games) {
        return
      }
      return getPage(this.games, page)
    }
  }
})
