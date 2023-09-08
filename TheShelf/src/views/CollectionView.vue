<template>
  <AppHeader header="Collection" />
  <RouterView />
</template>

<script lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'

export default {
  name: 'CollectionView',
  data() {
    return {}
  },
  components: {
    AppHeader
  },
  methods: {},
  mounted() {}
}
</script>

<style scoped></style>
