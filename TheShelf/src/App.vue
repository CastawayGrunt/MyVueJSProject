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
  <Toast>
    <template #message="slotProps">
      <div class="mr-auto">
        <div class="font-bold text-xl mb-3">{{ slotProps.message.summary }}</div>
        <div class="toast-details" v-html="slotProps.message.detail" />
      </div>
    </template>
  </Toast>
</template>

<style scoped></style>
