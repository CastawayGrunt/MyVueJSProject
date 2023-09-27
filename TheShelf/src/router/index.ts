import { START_LOCATION, createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CollectionView from '@/views/CollectionView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import AboutView from '@/views/AboutView.vue'

import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
        auth: false,
        frame: false
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        title: 'About',
        auth: false,
        frame: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
        auth: false,
        frame: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Register',
        auth: false,
        frame: false
      }
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: ForgotPasswordView,
      meta: {
        title: 'Forgot Password',
        auth: false,
        frame: false
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard',
        auth: true,
        frame: true
      }
    },
    {
      path: '/collection',
      name: 'collection',
      component: CollectionView,
      meta: {
        auth: true,
        frame: true
      },
      children: [
        {
          path: 'add-game',
          name: 'addGame',
          component: () => import('@/views/Collection/CollectionAddGameView.vue'),
          meta: {
            title: 'Add Game',
            auth: true,
            frame: true
          }
        },
        {
          path: 'view-game/:id',
          name: 'viewGame',
          component: () => import('@/views/Collection/CollectionViewGameView.vue'),
          props: true,
          meta: {
            title: 'View Game',
            auth: true,
            frame: true
          }
        },
        {
          path: 'games',
          name: 'games',
          component: () => import('@/views/Collection/CollectionGamesView.vue'),
          meta: {
            title: 'Collection',
            auth: true,
            frame: true
          }
        }
      ]
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        title: 'Profile',
        auth: true,
        frame: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: PageNotFoundView,
      meta: {
        title: 'Page Not Found',
        auth: false,
        frame: false
      }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `The Shelf - ${title}`
  }
  const userStore = useUserStore()
  if (to.path === '/' && userStore.isAuthenticated) {
    return { name: 'dashboard', replace: true }
  }
  if (to.path === '/collection' || (to.path === '/collection/' && userStore.isAuthenticated)) {
    return { name: 'games', replace: true }
  }
  if (to.meta.auth && !userStore.isAuthenticated) {
    return { name: 'login', replace: true }
  }
  if (from === START_LOCATION && userStore.isAuthenticated) {
    await useUserStore().getGames()
  }
})

export default router
