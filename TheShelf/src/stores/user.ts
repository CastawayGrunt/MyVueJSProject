import { defineStore } from 'pinia'
import { loginUser, logoutUser, registerUser, updateUserProfile } from '@/services/fireUserAuth'
import type { Credentials } from '@/services/fireUserAuth'
import {
  type FireUser,
  addFireUser,
  getFireUser,
  addFireUserGame,
  type GameCollection
} from '@/services/fireUserData'
import type { GameIdResponse } from '@/services/boardGamesApi'
import { addFireGame, getFireGame, type GameType } from '@/services/fireGameData'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as FireUser | null,
      games: null as GameType[] | null
    }
  },
  getters: {
    isAuthenticated(): boolean {
      if (!this.user) {
        return false
      }
      return this.user.id !== null
    }
  },
  actions: {
    async login({ email, password }: Credentials) {
      const userAccount = await loginUser({ email, password })

      if (userAccount.user.displayName != null && userAccount.user.email != null) {
        const userData = await getFireUser(userAccount.user.uid)
        console.log('userdata', userData)
        return (this.user = {
          id: userData.id,
          displayName: userData.displayName,
          email: userData.email,
          dateCreated: userData.dateCreated,
          games: userData.games,
          lastPlayed: userData.lastPlayed,
          mostPlayed: userData.mostPlayed
        })
      } else {
        this.user = null
        return false
      }
    },
    async logout() {
      await logoutUser()
      this.user = null
    },
    async register({ email, password }: Credentials, user: FireUser) {
      const registeredUser = await registerUser({ email, password })
      if (registeredUser !== null) {
        await updateUserProfile(user)

        const userData = {
          id: registeredUser.uid,
          displayName: user.displayName,
          email: user.email,
          games: [],
          dateCreated: new Date().toISOString(),
          lastPlayed: '',
          mostPlayed: ''
        }
        console.log(userData)
        await addFireUser(userData)

        if (registeredUser.displayName != null && registeredUser.email != null) {
          return (this.user = userData)
        }
      }
    },
    getGames(): GameType[] | null {
      const gameList: GameType[] = []
      this.user?.games.forEach(async (query) => {
        const game = await getFireGame(query.gameId)
        const gameData = {
          bggId: game.bggId,
          name: game.name,
          description: game.description,
          minPlayers: game.minPlayers,
          maxPlayers: game.maxPlayers,
          minPlaytime: game.minPlaytime,
          maxPlaytime: game.maxPlaytime,
          minAge: game.minAge,
          yearPublished: game.yearPublished,
          rating: {
            '1star': game.rating['1star'],
            '2star': game.rating['2star'],
            '3star': game.rating['3star'],
            '4star': game.rating['4star'],
            '5star': game.rating['5star']
          },
          image: game.image
        }
        gameList.push(gameData)
      })
      console.log('gameList', gameList)
      return (this.games = gameList)
    },
    async addGame(game: GameIdResponse) {
      if (this.user) {
        const newGame = await addFireGame(game)

        const mappedGame: GameCollection = {
          gameId: newGame.bggId,
          name: newGame.name,
          plays: [],
          rating: NaN,
          comment: ''
        }

        await addFireUserGame(this.user, mappedGame)

        return (this.user = {
          ...this.user
        })
      }
    }
  }
})
