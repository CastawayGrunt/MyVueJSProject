import { useFirestore } from 'vuefire'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import type { GameIdResponse } from './boardGamesApi'
import { findGameName } from '@/helpers/stringHelpers'

export type Ratings = {
  '1star': number
  '2star': number
  '3star': number
  '4star': number
  '5star': number
}

export type GameType = {
  bggId: string
  name: string
  description: string
  minPlayers: number
  maxPlayers: number
  minPlaytime: number
  maxPlaytime: number
  minAge: number
  yearPublished: number
  rating: Ratings
  image: string
}

export async function getFireGame(id: string) {
  const db = useFirestore()
  const gameRef = doc(db, 'games', id)
  const gameSnap = await getDoc(gameRef)

  if (!gameSnap.exists()) {
    throw new Error('Game does not exist')
  }
  return gameSnap.data()
}

export async function getFireGames(games: string[]) {
  const db = useFirestore()
  const q = query(collection(db, 'games'), where('bggId', 'in', games))
  const querySnapshot = await getDocs(q)

  const gamesHolding: GameType[] = []

  querySnapshot.forEach((doc) => {
    gamesHolding.push(doc.data() as GameType)
  })
  return gamesHolding
}

export async function addFireGame(game: GameIdResponse) {
  const newGame: GameType = {
    bggId: game['@_id'].toString(),
    name: findGameName(game),
    description: game.description,
    minPlayers: game.minplayers['@_value'],
    maxPlayers: game.maxplayers['@_value'],
    minPlaytime: game.minplaytime['@_value'],
    maxPlaytime: game.maxplaytime['@_value'],
    minAge: game.minage['@_value'],
    yearPublished: game.yearpublished['@_value'],
    rating: {
      '1star': 0,
      '2star': 0,
      '3star': 0,
      '4star': 0,
      '5star': 0
    },
    image: game.image
  }

  const db = useFirestore()
  const gameRef = doc(db, 'games', newGame.bggId)
  const gameSnap = await getDoc(gameRef)

  if (gameSnap.exists()) {
    return newGame
  }

  await setDoc(gameRef, newGame)
  return newGame
}

export async function changeFireGameRating(game: GameType, rating: number, plusOrMinus: boolean) {
  const db = useFirestore()
  const gameRef = doc(db, 'games', game.bggId)
  const gameSnap = await getDoc(gameRef)

  if (!gameSnap.exists()) {
    throw new Error('game does not exist')
  }
  if (rating < 1 || rating > 5) {
    throw new Error('rating must be between 1 and 5')
  }

  const incrementValue = plusOrMinus ? 1 : -1

  if (rating == 1) {
    await updateDoc(gameRef, {
      'rating.1star': increment(incrementValue)
    })
  } else if (rating == 2) {
    await updateDoc(gameRef, {
      'rating.2star': increment(incrementValue)
    })
  } else if (rating == 3) {
    await updateDoc(gameRef, {
      'rating.3star': increment(incrementValue)
    })
  } else if (rating == 4) {
    await updateDoc(gameRef, {
      'rating.4star': increment(incrementValue)
    })
  } else if (rating == 5) {
    await updateDoc(gameRef, {
      'rating.5star': increment(incrementValue)
    })
  }
}
// export async function deleteFireGame(game: GameType) {
//   const db = useFirestore()
//   const gameRef = doc(db, 'boardgames', game.id)
//   const userSnap = await getDoc(gameRef)

//   if (userSnap.exists()) {
//     await deleteDoc(gameRef)
//   }
// }
