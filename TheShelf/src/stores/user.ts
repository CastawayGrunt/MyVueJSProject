import { defineStore } from 'pinia'
import {
  loginUser,
  logoutUser,
  registerUser,
  sendPasswordEmail,
  updateUserProfile
} from '@/services/fireUserAuth'
import type { Credentials } from '@/services/fireUserAuth'
import {
  type FireUser,
  addFireUser,
  getFireUser,
  addFireUserGame,
  type GameCollection,
  deleteFireUserGame
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
          games: user.games,
          dateCreated: user.dateCreated,
          lastPlayed: user.lastPlayed,
          mostPlayed: user.mostPlayed
        }
        console.log(userData)
        await addFireUser(userData)

        if (registeredUser.displayName != null && registeredUser.email != null) {
          return (this.user = userData)
        }
      }
    },
    async requestChangePasswordEmail(email: string) {
      const changePasswordEmailSent = await sendPasswordEmail(email)
      return changePasswordEmailSent
    },
    async getGames() {
      if (this.user) {
        const tempGames = []
        for (const game of this.user.games) {
          const gameData = await this.getGame(game.gameId)
          tempGames.push(gameData)
        }
        return (this.games = tempGames), tempGames
      }
    },
    async getGame(gameId: string) {
      const result = await getFireGame(gameId)
      const gameData = {
        bggId: result.bggId,
        name: result.name,
        description: result.description,
        minPlayers: result.minPlayers,
        maxPlayers: result.maxPlayers,
        minPlaytime: result.minPlaytime,
        maxPlaytime: result.maxPlaytime,
        minAge: result.minAge,
        yearPublished: result.yearPublished,
        rating: {
          '1star': result.rating['1star'],
          '2star': result.rating['2star'],
          '3star': result.rating['3star'],
          '4star': result.rating['4star'],
          '5star': result.rating['5star']
        },
        image: result.image
      }
      return gameData
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
        const gameData = await this.getGame(newGame.bggId)

        this.games?.push(gameData)
        this.user.games.push(mappedGame)
        return
      }
    },
    async deleteUserGame(game: GameType) {
      if (this.user) {
        const gameIndex = this.user.games.findIndex((g) => g.gameId === game.bggId)
        const GametoRemove = this.user.games[gameIndex]

        if (gameIndex === -1) {
          throw new Error('Game does not exist')
        }
        if (gameIndex > -1) {
          const success = await deleteFireUserGame(this.user, GametoRemove)
          this.user.games.splice(gameIndex, 1)
          this.games?.splice(gameIndex, 1)

          return success
        }
      }
    }
  }
})
