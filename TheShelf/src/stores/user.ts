import { defineStore } from 'pinia'
import {
  type Credentials,
  loginUser,
  logoutUser,
  registerUser,
  sendPasswordEmail,
  updateUserProfile
} from '@/services/fireUserAuth'
import {
  type FireUser,
  type GameCollection,
  addFireUser,
  getFireUser,
  addFireUserGame,
  deleteFireUserGame,
  updateFireUser,
  type Plays,
  addFireUserGamePlay
} from '@/services/fireUserData'
import type { GameIdResponse } from '@/services/boardGamesApi'
import {
  addFireGame,
  getFireGame,
  type GameType,
  changeFireGameRating
} from '@/services/fireGameData'
import { useStorage } from '@vueuse/core'
import { deleteUserImage, uploadUserImage } from '@/services/fireFileBucket'
import { serverTimestamp } from 'firebase/firestore'

const defaultUserLocal: FireUser = {
  id: '',
  displayName: '',
  email: '',
  photoURL: '',
  dateCreated: serverTimestamp(),
  games: [],
  plays: [],
  lastPlayed: '',
  mostPlayed: ''
}
const userLocalStorage = useStorage('user', defaultUserLocal)

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
    },
    getUser(): FireUser | null {
      if (userLocalStorage.value.id === '') {
        return (this.user = null)
      }
      return (this.user = userLocalStorage.value)
    }
  },
  actions: {
    init() {
      if (this.user) {
        return
      }
      if (userLocalStorage.value.id === '' || userLocalStorage === null) {
        return
      }
      this.user = userLocalStorage.value
    },
    async login({ email, password }: Credentials) {
      userLocalStorage.value = null
      const userAccount = await loginUser({ email, password })

      if (userAccount.user.displayName != null && userAccount.user.email != null) {
        const userData = await getFireUser(userAccount.user.uid)
        console.log('userdata', userData)
        userLocalStorage.value = {
          id: userData.id,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          dateCreated: userData.dateCreated,
          games: userData.games,
          plays: userData.plays,
          lastPlayed: userData.lastPlayed,
          mostPlayed: userData.mostPlayed
        }
        this.user = userLocalStorage.value
        return true
      } else {
        this.user = null
        return false
      }
    },
    async logout() {
      await logoutUser()
      this.user = null
      userLocalStorage.value = null
    },
    async register({ email, password }: Credentials, user: FireUser) {
      const registeredUser = await registerUser({ email, password })
      if (registeredUser !== null) {
        await updateUserProfile(user)

        const userData = {
          id: registeredUser.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          games: user.games,
          plays: user.plays,
          dateCreated: serverTimestamp(),
          lastPlayed: user.lastPlayed,
          mostPlayed: user.mostPlayed
        }
        await addFireUser(userData)
        userLocalStorage.value = userData

        if (registeredUser.displayName != null && registeredUser.email != null) {
          return (this.user = userData)
        }
      }
    },
    async requestChangePasswordEmail(email: string) {
      const changePasswordEmailSent = await sendPasswordEmail(email)
      return changePasswordEmailSent
    },
    async uploadProfilePicture(file: File) {
      const imageFilePath = `${this.user?.id}_${file.name}`
      const url = await uploadUserImage(imageFilePath, file)

      if (!url || url.length == 0) {
        return null
      }
      if (!this.user) {
        return null
      }
      this.user.photoURL = url
      await updateFireUser(this.user)

      return url
    },
    async removeProfilePicture() {
      const placeholderImg = '/img/undraw_profile.svg'
      if (this.user?.photoURL.includes(placeholderImg)) {
        return true
      }

      if (this.user?.photoURL) {
        const imageUrl = new URL(this.user?.photoURL)
        const imageName = imageUrl.pathname.split('/ProfilePictures%2F').at(-1)

        if (!imageName) {
          return false
        }
        await deleteUserImage(imageName)
        this.user.photoURL = placeholderImg
        await updateFireUser(this.user)

        return true
      }
      return false
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
    async addGamePlay(game: GameCollection, play: Plays) {
      if (this.user) {
        const gameIndex = this.user.games.findIndex((g) => g.gameId === game.gameId)

        if (gameIndex === -1) {
          return false
        }
        if (gameIndex > -1) {
          const mapPlay: Plays = {
            timestamp: new Date(),
            gameId: play.gameId,
            datePlayed: play.datePlayed,
            location: play.location,
            players: play.players
          }
          await addFireUserGamePlay(this.user, game, mapPlay)
          this.user.plays.push(play)
          return true
        }
      }
    },
    async updateGameRating(game: GameType, rating: number) {
      if (!this.games || !this.user) {
        return false
      }

      const gameToUpdate = this.user?.games.find((g) => g.gameId === game.bggId)
      const currentRating = this.user?.games.find((g) => g.gameId === game.bggId)?.rating

      if (gameToUpdate) {
        gameToUpdate.rating = rating
        await updateFireUser(this.user)
      }

      if (currentRating === null) {
        const updatedGame = await changeFireGameRating(game, rating, true)
        const index = this.games.findIndex((g) => g.bggId === game.bggId)
        if (index >= 0) {
          this.games[index] = updatedGame
        }
      }
      if (currentRating && currentRating >= 1 && currentRating <= 5) {
        await changeFireGameRating(game, currentRating, false)
        const gameNewRating = await changeFireGameRating(game, rating, true)
        const index = this.games.findIndex((g) => g.bggId === game.bggId)
        if (index >= 0) {
          this.games[index] = gameNewRating
        }
      }
      return true
    },
    // async updateUserGameRating(game: GameType, rating: number) {
    //   if (!this.games) {
    //     return false
    //   }
    //   const updatedGame = await updateFireUser(game, rating)
    //   const index = this.games.findIndex((g) => g.bggId === game.bggId)
    //   if (index >= 0) {
    //     this.games[index] = updatedGame
    //   }
    //   return true
    // },
    async deleteUserGame(game: GameType) {
      if (this.user) {
        const gameIndex = this.user.games.findIndex((g) => g.gameId === game.bggId)
        const GametoRemove = this.user.games[gameIndex]

        if (gameIndex === -1) {
          return false
        }
        if (gameIndex > -1) {
          await deleteFireUserGame(this.user, GametoRemove)
          this.user.games.splice(gameIndex, 1)
          this.games?.splice(gameIndex, 1)

          return true
        }
      }
    }
  }
})
