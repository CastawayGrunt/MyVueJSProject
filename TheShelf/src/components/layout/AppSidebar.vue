<template>
  <!-- Sidebar -->
  <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
    <!-- Sidebar - Brand -->
    <RouterLink to="/" class="d-flex align-items-center justify-content-left py-2"
      ><img class="img-fluid" src="@/assets/img/Logo/ShelfLogoWhite.svg" alt="The Shelf Logo"
    /></RouterLink>

    <!-- Divider -->
    <hr class="sidebar-divider my-0" />

    <!-- Nav Item - Dashboard -->
    <li class="nav-item" @click.prevent="linkToggleSidebar()" id="/dashboard">
      <RouterLink to="/dashboard" class="nav-link">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </RouterLink>
    </li>
    <li class="nav-item" @click.prevent="linkToggleSidebar()" id="/collection">
      <RouterLink to="/collection/games" class="nav-link">
        <i class="fas fa-fw fa-layer-group"></i>
        <span>Collection</span>
      </RouterLink>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block" />

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
      <button
        class="rounded-circle border-0"
        id="sidebarToggle"
        @click.prevent="toggleSidebar()"
      ></button>
    </div>
  </ul>
  <!-- End of Sidebar -->
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  setActiveLink,
  removeActiveLink,
  toggleSidebar,
  closeSidebar,
  openSidebar
} from '@/helpers/sidebarHelper'
import { useWindowSize } from '@vueuse/core'
import { onMounted, watch } from 'vue'
import router from '@/router'

const { width } = useWindowSize()

const linkToggleSidebar = () => {
  if (width.value < 768) {
    toggleSidebar()
  }
}

watch(
  () => width.value,
  (newWidth, oldWidth) => {
    console.log(newWidth, oldWidth)
    if (newWidth > 768 && oldWidth < 768) {
      openSidebar()
    } else if (newWidth < 768 && oldWidth > 768) {
      closeSidebar()
    }
  }
)

watch(
  () => router.currentRoute.value.path,
  (newPath, oldPath) => {
    newPath = path(newPath)
    oldPath = path(oldPath)
    if (newPath === oldPath) return
    setActiveLink(newPath)
    removeActiveLink(oldPath)
  }
)

const path = (route: string) => {
  if (route.includes('/collection')) return '/collection'
  return route
}

onMounted(() => {
  setActiveLink(path(router.currentRoute.value.path))
  if (width.value > 768) {
    openSidebar()
  }
  if (width.value < 768) {
    console.log('close')
    closeSidebar()
  }
})
</script>

<style scoped></style>
