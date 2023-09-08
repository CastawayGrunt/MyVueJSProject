import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'

export interface credentials {
  email: string
  password: string
}

export interface userInfo {
  id: string
  displayName: string
  email: string
}

export const registerUser = async ({ email, password }: credentials) => {
  const auth = getAuth()
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  if (cred.user) {
    return cred.user
  } else {
    return null
  }
}

export const loginUser = async ({ email, password }: credentials) => {
  const auth = getAuth()
  const cred = await signInWithEmailAndPassword(auth, email, password)

  return cred
}

export const logoutUser = async () => {
  const auth = getAuth()
  await signOut(auth)
}

export const updateUserProfile = async (user: userInfo) => {
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
