import { defineStore } from 'pinia'
import { loginUser, logoutUser, registerUser, updateUserProfile } from '../services/userAuth'
import type { userInfo, credentials } from '@/services/userAuth'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as userInfo | null
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
    async login({email, password}: credentials) {
      const userAccount = await loginUser({ email, password })
      // console.log(userAccount)
      if (userAccount.user.displayName != null && userAccount.user.email != null) {
        return (this.user = {
          id: userAccount.user.uid,
          displayName: userAccount.user.displayName,
          email: userAccount.user.email,
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
    async register({email, password}: credentials, user: userInfo) {
      const registeredUser = await registerUser({email, password})
      if (registeredUser !== null) {
        await updateUserProfile(user)
        
        if (registeredUser.displayName != null && registeredUser.email != null) {
          return (this.user = {
            id: registeredUser.uid,
            displayName: registeredUser.displayName,
            email: registeredUser.email
          })
        }
      }
    }
  }
})
