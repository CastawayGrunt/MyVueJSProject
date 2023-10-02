<template>
  <div class="btn-group">
    <button
      @click.prevent="goToCollection"
      :disabled="disableButton === 'games'"
      class="btn btn-primary mt-2 md:mt-0"
    >
      View Collection
    </button>
    <button
      @click.prevent="goToSearch"
      :disabled="disableButton === 'add'"
      class="btn btn-primary mt-2 md:mt-0"
    >
      Add Game
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const disableButton = ref('games')

onMounted(() => setDisabled())

const setDisabled = () => {
  if (router.currentRoute.value.path === '/collection/games') {
    disableButton.value = 'games'
  } else {
    disableButton.value = 'add'
  }
}

const goToCollection = () => {
  router.push({ name: 'games' })
}
const goToSearch = () => {
  router.push({ name: 'addGame' })
}
</script>

<style scoped></style>
