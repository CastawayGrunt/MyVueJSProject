<template>
  <div
    class="modal fade"
    id="addGameModal"
    tabindex="-1"
    aria-labelledby="addGameModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addGameModalLabel">Confirm Game Addition</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click.prevent="$emit('cancelAddGame')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <img class="img-fluid" :src="game.image" alt="game image" />
          <h1 v-html="name" />
          <div class="overflow-auto h-25">
            <p v-html="game.description" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            @click.prevent="$emit('cancelAddGame')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-dismiss="modal"
            @click.prevent="$emit('addGame', game)"
          >
            Add Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type GameIdResponse } from '@/services/boardGamesApi'
import { findGameName } from '@/helpers/stringHelpers'

const props = defineProps<{
  game: GameIdResponse
}>()

const name = findGameName(props.game)
</script>

<style scoped></style>
