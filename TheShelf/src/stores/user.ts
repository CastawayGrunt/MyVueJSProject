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
  addFireUserGamePlay,
  deleteFireUserGamePlay
} from '@/services/fireUserData'
import type { GameIdResponse } from '@/services/boardGamesApi'
import {
  addFireGame,
  getFireGame,
  type GameType,
  changeFireGameRating,
  getFireGames
} from '@/services/fireGameData'
import { useStorage } from '@vueuse/core'
import { deleteUserImage, uploadUserImage } from '@/services/fireFileBucket'
import { serverTimestamp } from 'firebase/firestore'
import { placeholderImg } from '@/helpers/placeHolders'

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
const defaultGameDataLocal: GameType[] = []
const userLocalStorage = useStorage('user', defaultUserLocal)
const gameDataLocalStorage = useStorage('gameData', defaultGameDataLocal)

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as FireUser | null,
      gamesData: null as GameType[] | null
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
    },
    getGamesData(): GameType[] | null {
      if (gameDataLocalStorage.value.length === 0) {
        return (this.gamesData = null)
      }
      return (this.gamesData = gameDataLocalStorage.value)
    }
  },
  actions: {
    init() {
      if (this.user && this.gamesData) {
        return
      }
      if (userLocalStorage.value.id === '' || userLocalStorage === null) {
        return
      }
      this.user = userLocalStorage.value
      this.gamesData = gameDataLocalStorage.value
    },
    async login({ email, password }: Credentials) {
      userLocalStorage.value = null
      gameDataLocalStorage.value = null
      try {
        const userAccount = await loginUser({ email, password })

        if (userAccount.user.displayName != null && userAccount.user.email != null) {
          const userData = await getFireUser(userAccount.user.uid)
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
          return { success: true }
        } else {
          this.user = null
          return { success: false }
        }
      } catch (error) {
        const loginError = error as Error
        return { success: false, error: loginError }
      }
    },
    async logout() {
      await logoutUser()
      this.user = null
      this.gamesData = null
      userLocalStorage.value = null
      gameDataLocalStorage.value = null
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
      if (this.user && this.user?.games.length > 0) {
        if (this.gamesData === null || this.gamesData?.length === 0) {
          const userGames = this.user.games.map((g) => g.gameId)
          const tempGames = await getFireGames(userGames)
          gameDataLocalStorage.value = tempGames
          return (this.gamesData = tempGames), tempGames
        }
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
          rating: 0,
          comment: ''
        }

        await addFireUserGame(this.user, mappedGame)
        const gameData = await this.getGame(newGame.bggId)

        this.gamesData?.push(gameData)
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
            dataAdded: new Date(),
            gameId: play.gameId,
            datePlayed: play.datePlayed,
            location: play.location,
            players: play.players
          }
          const gameName = this.user.games[gameIndex].name

          const updateStats = await addFireUserGamePlay(this.user, game, mapPlay)

          if (updateStats.mostPlayedGameName !== this.user.mostPlayed) {
            this.user.mostPlayed = updateStats.mostPlayedGameName
          }
          this.user.plays.push(play)
          this.user.lastPlayed = gameName
          return true
        }
      }
    },
    async deleteGamePlay(play: Plays) {
      if (this.user) {
        const playIndex = this.user.plays.findIndex((g) => g.dataAdded === play.dataAdded)
        const playToRemove = this.user.plays[playIndex]

        if (playIndex === -1) {
          return false
        }
        if (playIndex > -1) {
          await deleteFireUserGamePlay(this.user, playToRemove)
          this.user.plays.splice(playIndex, 1)
          return true
        }
      }
    },
    async updateGameRating(game: GameType, rating: number) {
      if (!this.gamesData || !this.user) {
        return false
      }

      const userGameToUpdate = this.user?.games.find((g) => g.gameId === game.bggId)
      const currentRating = this.user?.games.find((g) => g.gameId === game.bggId)?.rating

      if (userGameToUpdate) {
        userGameToUpdate.rating = rating
        await updateFireUser(this.user)
      }

      if (currentRating === 0) {
        await changeFireGameRating(game, rating, true)
        const updatedGame = await this.getGame(game.bggId)
        const index = this.gamesData.findIndex((g) => g.bggId === game.bggId)
        if (index >= 0) {
          this.gamesData[index] = updatedGame
        }
      }

      if (currentRating && currentRating >= 1 && currentRating <= 5) {
        await changeFireGameRating(game, currentRating, false)
        await changeFireGameRating(game, rating, true)

        const updatedGame = await this.getGame(game.bggId)
        const index = this.gamesData.findIndex((g) => g.bggId === game.bggId)
        if (index >= 0) {
          this.gamesData[index] = updatedGame
        }
      }
      return true
    },
    async updateGameComment(game: GameCollection, comment: string) {
      if (!this.gamesData || !this.user) {
        return false
      }

      const userGameToUpdate = this.user?.games.find((g) => g.gameId === game.gameId)

      if (userGameToUpdate) {
        userGameToUpdate.comment = comment
        await updateFireUser(this.user)
      }
      return true
    },
    async deleteUserGame(game: GameType) {
      if (this.user) {
        const userStoreGameIndex = this.user.games.findIndex((g) => g.gameId === game.bggId)
        const gameStoreIndex = this.gamesData?.findIndex((g) => g.bggId === game.bggId)
        const gameToRemove = this.user.games[userStoreGameIndex]

        if (userStoreGameIndex === -1 || gameStoreIndex === -1 || gameStoreIndex === undefined) {
          return false
        }
        if (userStoreGameIndex > -1 && gameStoreIndex > -1) {
          await deleteFireUserGame(this.user, gameToRemove)

          for (const play of this.user.plays) {
            if (play.gameId === game.bggId) {
              await deleteFireUserGamePlay(this.user, play)
              this.user.plays.splice(this.user.plays.indexOf(play), 1)
            }
          }

          this.user.games.splice(userStoreGameIndex, 1)
          this.gamesData?.splice(gameStoreIndex, 1)

          return true
        }
      }
    }
  }
})
