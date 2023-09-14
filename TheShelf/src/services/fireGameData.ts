import { useFirestore } from 'vuefire'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import type { GameIdResponse } from './boardGamesApi'
import { findGameName } from '@/helpers/stringHelpers'

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
  rating: {
    '1star': number
    '2star': number
    '3star': number
    '4star': number
    '5star': number
  }
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

export async function updateFireGame(game: GameType) {
  const db = useFirestore()
  const gameRef = doc(db, 'boardgames', game.bggId)
  const gameSnap = await getDoc(gameRef)

  if (!gameSnap.exists()) {
    throw new Error('game do not exist')
  }

  await updateDoc(gameRef, {
    bggId: game.bggId,
    name: game.name,
    description: game.description,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    minPlaytime: game.minPlaytime,
    maxPlaytime: game.maxPlaytime,
    minAge: game.minAge,
    yearPublished: game.yearPublished,
    rating: [],
    image: game.image
  })
}

// export async function deleteFireGame(game: GameType) {
//   const db = useFirestore()
//   const gameRef = doc(db, 'boardgames', game.id)
//   const userSnap = await getDoc(gameRef)

//   if (userSnap.exists()) {
//     await deleteDoc(gameRef)
//   }
// }
