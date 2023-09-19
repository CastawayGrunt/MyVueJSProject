import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { type FireUser } from './fireUserData'

export type Credentials = {
  email: string
  password: string
}

type FireRegisterUserInfo = Omit<FireUser, 'games,lastPlayed,mostPlayed,photoURL'>

export const registerUser = async ({ email, password }: Credentials) => {
  const auth = getAuth()
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  if (cred.user) {
    return cred.user
  } else {
    return null
  }
}

export const loginUser = async ({ email, password }: Credentials) => {
  const auth = getAuth()
  const cred = await signInWithEmailAndPassword(auth, email, password)

  return cred
}

export const logoutUser = async () => {
  const auth = getAuth()
  await signOut(auth)
}

export const updateUserProfile = async (user: FireRegisterUserInfo) => {
  const auth = getAuth()
  if (!auth.currentUser) {
    return false
  }
  await updateProfile(auth.currentUser, {
    displayName: user.displayName,
    photoURL: '/assets/img/undraw_male_avatar.svg'
  })
  return true
}

export const sendPasswordEmail = async (email: string) => {
  const auth = getAuth()
  if (!auth.currentUser) {
    return false
  }
  await sendPasswordResetEmail(auth, email)
  return true
}
