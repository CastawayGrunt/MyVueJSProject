<template>
  <GameDetails :game="game" :userGameInfo="userGameInfo" :userPlays="userPlays" />
</template>

<script setup lang="ts">
import GameDetails from '@/components/gameCollection/GameEdit/GameDetails.vue'
import { watchArray } from '@vueuse/core'
import type { GameType } from '@/services/fireGameData'
import type { GameCollection, Plays } from '@/services/fireUserData'
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'

const game = ref({} as GameType)
const userGameInfo = ref({} as GameCollection)
const userPlays = ref([] as Plays[])
const userStore = useUserStore()

const props = defineProps<{
  id: string
}>()

if (userStore.user?.plays) {
  watchArray(userStore.user?.plays, (newPlays, oldPlays) => {
    if (newPlays !== oldPlays || newPlays !== undefined) {
      userPlays.value = newPlays
    }
  })
}

if (userStore.games) {
  watchArray(userStore.games, (newGames, oldGames) => {
    if (newGames !== oldGames || newGames !== undefined) {
      const gameData = findGame()
      game.value = gameData
    }
  })
}
const findGame = () => {
  const gameData = userStore.games?.find((game) => game.bggId === props.id)
  if (gameData === undefined) {
    return (game.value = {} as GameType)
  }
  return (game.value = gameData)
}

onMounted(async () => {
  const userGameData = userStore.user?.games?.find((game) => game.gameId === props.id)
  const playsData = userStore.user?.plays?.filter((play) => play.gameId === props.id)

  const gameData = findGame()

  if (gameData.bggId === undefined || userGameData === undefined || playsData === undefined) {
    return
  }
  userGameInfo.value = userGameData
  game.value = gameData
  userPlays.value = playsData
  return
})
</script>

<style scoped></style>
