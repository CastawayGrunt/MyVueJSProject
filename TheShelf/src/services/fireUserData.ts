import { useFirestore } from 'vuefire'
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  FieldValue,
  Timestamp
} from 'firebase/firestore'

export type FireUser = {
  id: string
  displayName: string
  email: string
  photoURL: string
  dateCreated?: FieldValue
  games: GameCollection[]
  plays: Plays[]
  lastPlayed: string
  mostPlayed: string
}

export type Plays = {
  dataAdded?: Date
  gameId: string
  datePlayed: Timestamp
  location: string
  players: Players[]
}

export type Players = {
  name: string
  score: string
  winner: boolean
}

export type GameCollection = {
  gameId: string
  name: string
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

export async function addFireUserGamePlay(user: FireUser, game: GameCollection, play: Plays) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.id)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    throw new Error('User does not exist')
  }

  if (!user.games.find((g) => g.gameId === game.gameId)) {
    throw new Error('Game does not exist')
  }

  if (user.mostPlayed !== game.name) {
    const mostPlayedGameName = findMostPlayedGame(user, game)

    await updateDoc(userRef, {
      plays: arrayUnion(play),
      lastPlayed: game.name,
      mostPlayed: mostPlayedGameName
    })

    return { mostPlayedGameName }
  }

  await updateDoc(userRef, {
    plays: arrayUnion(play),
    lastPlayed: game.name
  })

  return { mostPlayedGameName: user.mostPlayed }
}

function findMostPlayedGame(user: FireUser, game: GameCollection) {
  if (user.plays.length === 0) {
    return game.name
  }
  //found here https://stackoverflow.com/questions/6120931/how-to-count-certain-elements-in-array
  type countPlays = {
    [key: string]: number
  }
  const counts: countPlays = {}
  user.plays.forEach((el) => {
    counts[el.gameId] = counts[el.gameId] ? counts[el.gameId] + 1 : 1
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const countsSorted = Object.entries(counts).sort(([_, a], [__, b]) => a - b)
  const mostPlayedId = countsSorted[countsSorted.length - 1][0]
  const mostPlayedGameName = user.games.find((g) => g.gameId === mostPlayedId)?.name

  if (mostPlayedGameName) {
    return mostPlayedGameName
  }
  return ''
}

export async function deleteFireUserGamePlay(user: FireUser, play: Plays) {
  const db = useFirestore()
  const userRef = doc(db, 'users', user.id)
  const userSnap = await getDoc(userRef)

  console.log('playtoremove', play)
  if (!userSnap.exists()) {
    throw new Error('User does not exist')
  }

  await updateDoc(userRef, {
    plays: arrayRemove(play)
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
