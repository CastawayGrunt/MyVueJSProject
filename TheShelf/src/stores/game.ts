import { defineStore } from 'pinia'
import { fakeGames } from '@/data/fakeData.json'

export interface GameType {
  id: number
  name: string
  description: string
  minPlayers: number
  maxPlayers: number
  minPlaytime: number
  maxPlaytime: number
  minAge: number
  yearPublished: number
  image: string
  url: string
}

export const useGameStore = defineStore('game', {
  state: () => {
    return {
      games: null as GameType[] | null
    }
  },
  getters: {
    getGames(): GameType[] | null {
      return (this.games = fakeGames)
    }
  },
  actions: {}
})
