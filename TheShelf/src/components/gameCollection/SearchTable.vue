<template>
  <div class="card p-3">
    <table class="table table-striped table-hover table-sm table-responsive-lg">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Year Published</th>
          <th scope="col">Type</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game['@_id']">
          <th scope="row" v-html="game.name['@_value']"></th>
          <td>{{ game.yearpublished?.['@_value'] }}</td>
          <td>{{ game['@_type'] === 'boardgame' ? 'Board&nbsp;Game' : 'Expansion' }}</td>
          <td>
            <button
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
import { GameSearchResponse } from '@/services/boardGamesApi'

const props = defineProps<{
  games: GameSearchResponse[]
}>()

props
</script>

<style scoped></style>
