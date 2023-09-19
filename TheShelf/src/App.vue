<script lang="ts" setup>
import AppFrame from '@/components/layout/AppFrame.vue'
import AppNoFrame from '@/components/layout/AppNoFrame.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'

const $route = useRoute()

const userStore = useUserStore()
userStore.init()

const useFrame = (): boolean => {
  if ($route.meta.frame === undefined || $route.meta.frame === false) {
    return false
  }
  return true
}
</script>

<template>
  <AppFrame v-if="useFrame()" />
  <AppNoFrame v-else />
</template>

<style scoped></style>
