import { useFirestore } from 'vuefire'
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayRemove
} from 'firebase/firestore'

export type FireUser = {
  id: string
  displayName: string
  email: string
  photoURL: string
  dateCreated: string
  games: GameCollection[]
  lastPlayed: string
  mostPlayed: string
}

type Plays = {
  date: string
  location: string
  players: string[]
  winner: string
}

export type GameCollection = {
  gameId: string
  name: string
  plays: Plays[]
  rating: number
  comment: string
}

export async function getFireUser(id: string) {
  const db = useFirestore()
  const userRef = doc(db, 'users', id)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User does not exist')
  }
  return userSnap.data()
}

export async function addFireUser(user: FireUser) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.id)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    throw new Error('User already exists')
  }

  await setDoc(userRef, user)
}

export async function updateFireUser(user: FireUser) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.id)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User does not exist')
  }

  await updateDoc(userRef, { ...user })
}

export async function addFireUserGame(user: FireUser, game: GameCollection) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.id)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User does not exist')
  }

  if (user.games.find((g) => g.gameId === game.gameId)) {
    throw new Error('Game already exists')
  }

  await updateDoc(userRef, {
    games: arrayUnion(game)
  })
}

export async function deleteFireUserGame(user: FireUser, game: GameCollection) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.id)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User does not exist')
  }

  await updateDoc(userRef, {
    games: arrayRemove(game)
  })
}

export async function deleteFireUser(user: FireUser) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.id)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    await deleteDoc(userRef)
  }
}
