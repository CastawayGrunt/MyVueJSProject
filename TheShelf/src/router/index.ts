import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CollectionView from '@/views/CollectionView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'

import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        auth: false,
        frame: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        auth: false,
        frame: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        auth: false,
        frame: false
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
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
          path: 'add',
          name: 'add',
          component: () => import('@/views/Collection/CollectionAddGameView.vue'),
          meta: {
            auth: true,
            frame: true
          }
        },
        {
          path: 'edit/:id',
          name: 'edit',
          component: () => import('@/views/Collection/CollectionEditGameView.vue'),
          meta: {
            auth: true,
            frame: true
          }
        },
        {
          path: 'games',
          name: 'games',
          component: () => import('@/views/Collection/CollectionGamesView.vue'),
          meta: {
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
        auth: true,
        frame: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: PageNotFoundView,
      meta: {
        auth: false,
        frame: false
      }
    }
  ]
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (to.path === '/' && userStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
  // if (to.path === '/collection' && userStore.isAuthenticated) {
  //   return { name: 'games' }
  // }
  if (to.meta.auth && !userStore.isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
