<template>
  <nav class="navbar navbar-expand w-100 navbar-light bg-white topbar mb-4 shadow">
    <!-- Topbar Navbar -->
    <RouterLink to="/" class="navbar-brand">
      <img
        height="50"
        src="@/assets/img/Logo/ShelfLogoGray.svg"
        class="align-items-center justify-content-center"
        alt="the shelf logo"
      />
    </RouterLink>
    <ul class="navbar-nav ml-auto">
      <RouterLink v-if="showAbout" to="/about" class="my-auto mr-4">About</RouterLink>
      <RouterLink v-if="isLoggedIn" to="/Dashboard" class="btn btn-primary my-auto"
        >Return to App</RouterLink
      >
      <RouterLink v-else to="/login" class="btn btn-primary my-auto">Login</RouterLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const isLoggedIn = ref(false)
const showAbout = ref(true)

onMounted(() => {
  const isAuthenticated = userStore.isAuthenticated
  isLoggedIn.value = isAuthenticated

  const route = router.currentRoute.value
  if (route.path === '/about' && isAuthenticated) {
    showAbout.value = false
  }
})
</script>

<style scoped></style>
