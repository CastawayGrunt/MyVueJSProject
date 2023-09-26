<template>
  <!-- Topbar -->
  <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
    <!-- Sidebar Toggle (Topbar) -->
    <button
      id="sidebarToggleTop"
      class="btn btn-link d-md-none rounded-circle mr-3"
      @click.prevent="toggleSidebar()"
    >
      <i class="fa fa-bars"></i>
    </button>
    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto">
      <!-- <div class="topbar-divider d-none d-sm-block"></div> -->

      <!-- Nav Item - User Information -->
      <li class="nav-item dropdown no-arrow">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="userDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span class="mr-2 d-none d-md-inline text-gray-600 small">{{ displayName }}</span>
          <img class="img-profile rounded-circle" :src="profileURL" />
        </a>
        <!-- Dropdown - User Information -->
        <div
          class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
          aria-labelledby="userDropdown"
        >
          <span class="ml-4 d-inline d-md-none text-gray-600 small">{{ displayName }}</span>
          <RouterLink to="/profile" class="dropdown-item">
            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
            Profile
          </RouterLink>
          <RouterLink to="/about" class="dropdown-item">
            <i class="fas fa-lightbulb fa-sm fa-fw mr-2 text-gray-400"></i>
            About The Shelf
          </RouterLink>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" @click.prevent="onLogoutClicked()" type="button">
            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            Logout
          </button>
        </div>
      </li>
    </ul>
  </nav>
  <!-- End of Topbar -->
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { onMounted, watch, ref } from 'vue'
import { toggleSidebar } from '@/helpers/sidebarHelper'

const userStore = useUserStore()
const $router = useRouter()
const displayName = ref('')
const profileURL = ref('')

watch(
  () => userStore.user?.photoURL,
  async (photoURL) => {
    if (photoURL !== undefined) {
      profileURL.value = photoURL
    }
  }
)

onMounted(() => {
  if (userStore.user === null) {
    return (displayName.value = 'update name')
  }

  if (userStore.user) {
    displayName.value = userStore.user.displayName
    profileURL.value = userStore.user.photoURL
  }
})

const onLogoutClicked = async () => {
  await userStore.logout()
  $router.push({ name: 'home' })
}
</script>

<style scoped></style>
