<template>
  <div class="card p-3">
    <table class="table table-striped table-hover table-sm table-responsive-lg">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Year Published</th>
          <th scope="col" class="d-none d-md-table-cell">Type</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game['@_id']">
          <th scope="row" v-html="game.name['@_value']"></th>
          <td>{{ game.yearpublished?.['@_value'] }}</td>
          <td class="d-none d-md-table-cell">
            {{ game['@_type'] === 'boardgame' ? 'Board&nbsp;Game' : 'Expansion' }}
          </td>
          <td>
            <button
              :disabled="gameExists(game['@_id'])"
              class="btn btn-primary btn-sm"
              data-toggle="modal"
              data-target="#addGameModal"
              @click="$emit('openAddGameModal', game['@_id'])"
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { type GameSearchResponse } from '@/services/boardGamesApi'
import { useUserStore } from '@/stores/user'

defineProps<{
  games: GameSearchResponse[]
}>()

const userStore = useUserStore()
const gameExists = (gameId: number): boolean => {
  let gameExists = false
  userStore.user?.games?.find((game) => {
    if (game.gameId === gameId?.toString()) {
      return (gameExists = true)
    }
  })
  return gameExists
}
</script>

<style scoped></style>
