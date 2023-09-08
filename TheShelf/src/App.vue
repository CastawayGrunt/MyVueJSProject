<script lang="ts">
import AppFrame from '@/components/layout/AppFrame.vue'
import AppNoFrame from '@/components/layout/AppNoFrame.vue'
// import router from '@/router'

export default {
  name: 'App',
  components: {
    AppFrame,
    AppNoFrame
  },
  computed: {
    useFrame(): boolean {
      if (this.$route.meta.frame === undefined || this.$route.meta.frame === false) {
        return false
      }
      return true
    }
  }
}
</script>

<template>
  <AppFrame v-if="useFrame" />
  <AppNoFrame v-else />
</template>

<style scoped></style>
