<template>
  <GameDetails :game="game" :userGameInfo="userGameInfo" :userPlays="userPlays" />
</template>

<script setup lang="ts">
import GameDetails from '@/components/gameCollection/GameEdit/GameDetails.vue'
import type { GameType } from '@/services/fireGameData'
import type { GameCollection, Plays } from '@/services/fireUserData'
import { useUserStore } from '@/stores/user'
import { onMounted, ref, watch } from 'vue'

const game = ref({} as GameType)
const userGameInfo = ref({} as GameCollection)
const userPlays = ref([] as Plays[])
const userStore = useUserStore()

const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  const userGameData = userStore.user?.games?.find((game) => game.gameId === props.id)
  const gameData = userStore.games?.find((game) => game.bggId === props.id)
  const playsData = userStore.user?.plays?.filter((play) => play.gameId === props.id)

  if (gameData === undefined || userGameData === undefined || playsData === undefined) {
    return
  }
  userGameInfo.value = userGameData
  game.value = gameData
  userPlays.value = playsData
  return
})
</script>

<style scoped></style>
