<template>
  <GameDetails :game="game" :userGameInfo="userGameInfo" />
</template>

<script setup lang="ts">
import GameDetails from '@/components/gameCollection/GameEdit/GameDetails.vue'
import type { GameType } from '@/services/fireGameData'
import type { GameCollection } from '@/services/fireUserData'
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'

const game = ref({} as GameType)
const userGameInfo = ref({} as GameCollection)
const userStore = useUserStore()

const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  const userGameData = userStore.user?.games?.find((game) => game.gameId === props.id)
  const gameData = userStore.games?.find((game) => game.bggId === props.id)

  if (gameData === undefined || userGameData === undefined) {
    return
  }
  userGameInfo.value = userGameData
  game.value = gameData
  return
})
</script>

<style scoped></style>
