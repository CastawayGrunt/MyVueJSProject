<template>
  <div class="card p-3">
    <table class="table table-hover table-sm table-responsive-md user-select-none">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Location</th>
          <th scope="col">Players</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="play in userPlays" :key="play.dataAdded?.toString()">
          <th scope="row" v-html="play.datePlayed"></th>
          <td>{{ play.location }}</td>

          <td>
            <table v-if="play.players.length > 0">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Score</th>
                  <th scope="col">Winnner</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="players in play.players" :key="players.name">
                  <th scope="row">{{ players.name }}</th>
                  <td>{{ players.score }}</td>
                  <td class="text-center">{{ players.winner ? '&#10003;' : '' }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <button
              class="btn btn-outline-danger btn-sm"
              data-toggle="modal"
              data-target="#removePlayModal"
              @click="$emit('openRemoveGamePlayModal', play)"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { Plays } from '@/services/fireUserData'

defineProps<{
  userPlays: Plays[]
}>()
</script>

<style scoped></style>
