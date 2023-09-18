<template>
  <div
    v-if="game"
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
          <div v-if="game.image" class="d-flex justify-content-center py-3">
            <img :src="game.image" alt="game image" height="300" />
          </div>
          <h1 v-html="name" class="font-weight-bold text-primary" />
          <div
            class="overflow-auto border border-primary p-2 mb-3 rounded"
            style="max-height: 100px"
          >
            <p v-html="game.description" />
          </div>
          <div class="row row-cols-2 ml-2">
            <LabelText
              label="Players"
              :text="`${game.minplayers?.['@_value']} - ${game.maxplayers?.['@_value']}`"
            />
            <LabelText
              label="Play Time"
              :text="`${game.minplaytime?.['@_value']} - ${game.maxplaytime?.['@_value']} min`"
            />
            <LabelText label="Age" :text="`${game.minage?.['@_value']}+`" />
            <LabelText label="Year Published" :text="`${game.yearpublished?.['@_value']}`" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
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
import LabelText from '@/components/gameCollection/LabelText.vue'
import { onUpdated, ref } from 'vue'

const name = ref('')

const props = defineProps<{
  game: GameIdResponse
}>()

onUpdated(() => {
  const foundName = findGameName(props.game)
  return (name.value = foundName)
})
</script>

<style scoped></style>
