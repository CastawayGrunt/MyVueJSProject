<template>
  <!-- Sidebar -->
  <ul
    class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled"
    id="accordionSidebar"
  >
    <!-- Sidebar - Brand -->
    <RouterLink to="/" class="d-flex align-items-center justify-content-left py-2"
      ><img class="img-fluid" src="@/assets/img/Logo/ShelfLogoWhite.svg" alt="The Shelf Logo"
    /></RouterLink>

    <!-- Divider -->
    <hr class="sidebar-divider my-0" />

    <!-- Nav Item - Dashboard -->
    <li class="nav-item active" @click.prevent="linkToggleSidebar()">
      <RouterLink to="/dashboard" class="nav-link">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </RouterLink>
    </li>
    <li class="nav-item active" @click.prevent="linkToggleSidebar()">
      <RouterLink to="/collection/games" class="nav-link">
        <i class="fas fa-fw fa-layer-group"></i>
        <span>Collection</span>
      </RouterLink>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider" />

    <!-- Heading -->
    <div class="sidebar-heading">Interface</div>

    <!-- Nav Item - Pages Collapse Menu -->
    <li class="nav-item">
      <a
        class="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseTwo"
        aria-expanded="true"
        aria-controls="collapseTwo"
      >
        <i class="fas fa-fw fa-cog"></i>
        <span>Components</span>
      </a>
      <div
        id="collapseTwo"
        class="collapse"
        aria-labelledby="headingTwo"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <h6 class="collapse-header">Custom Components:</h6>
          <a class="collapse-item" href="buttons.html">Buttons</a>
          <a class="collapse-item" href="cards.html">Cards</a>
        </div>
      </div>
    </li>

    <!-- Nav Item - Utilities Collapse Menu -->
    <li class="nav-item">
      <a
        class="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseUtilities"
        aria-expanded="true"
        aria-controls="collapseUtilities"
      >
        <i class="fas fa-fw fa-wrench"></i>
        <span>Utilities</span>
      </a>
      <div
        id="collapseUtilities"
        class="collapse"
        aria-labelledby="headingUtilities"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <h6 class="collapse-header">Custom Utilities:</h6>
          <a class="collapse-item" href="utilities-color.html">Colors</a>
          <a class="collapse-item" href="utilities-border.html">Borders</a>
          <a class="collapse-item" href="utilities-animation.html">Animations</a>
          <a class="collapse-item" href="utilities-other.html">Other</a>
        </div>
      </div>
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
import { toggleSidebar } from '@/helpers/sidebarHelper'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const linkToggleSidebar = () => {
  if (width.value < 768) {
    toggleSidebar()
  }
}
// import router from '@/router'

// const active = () => {
//   const current = router.currentRoute.value.path
//   console.log(current)
//   const links = document.querySelectorAll('.nav-item')
//   links.forEach((link) => console.log(link.baseURI))

//   links.forEach((link) => {
//     if (link.baseURI === current) {
//       link.classList.add('active')
//     } else {
//       link.classList.remove('active')
//     }
//   })

//   return active
// }
</script>

<style scoped></style>
