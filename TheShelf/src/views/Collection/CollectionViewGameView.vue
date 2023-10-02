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
      findGamePlays()
    }
  })
}

if (userStore.gamesData) {
  watchArray(userStore.gamesData, (newGames, oldGames) => {
    if (newGames !== oldGames || newGames !== undefined) {
      const gameData = findGame()
      game.value = gameData
    }
  })
}
const findGame = () => {
  const gameData = userStore.gamesData?.find((game) => game.bggId === props.id)
  if (gameData === undefined) {
    return (game.value = {} as GameType)
  }
  return (game.value = gameData)
}

const findGamePlays = () => {
  const playsData = userStore.user?.plays?.filter((play) => play.gameId === props.id)
  if (playsData === undefined) {
    return (userPlays.value = [] as Plays[])
  }
  return (userPlays.value = playsData)
}

onMounted(async () => {
  const userGameData = userStore.user?.games?.find((game) => game.gameId === props.id)
  findGamePlays()
  const gameData = findGame()

  if (gameData.bggId === undefined || userGameData === undefined) {
    return
  }

  userGameInfo.value = userGameData
  game.value = gameData
  return
})
</script>

<style scoped></style>
