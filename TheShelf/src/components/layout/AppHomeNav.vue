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
      <RouterLink to="/login" class="btn btn-primary my-auto">Login</RouterLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

// export default {
//   name: 'AppHomeNav'
// }
</script>

<style scoped></style>
