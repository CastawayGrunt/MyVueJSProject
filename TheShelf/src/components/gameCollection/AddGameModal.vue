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
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <img class="img-fluid" :src="game.image" alt="game image" />
          <h1 v-html="gameName()" />
          <p class="overflow-auto h-25" v-html="game.description" />
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
import { GameIdResponse } from '@/services/boardGamesApi'

const props = defineProps<{
  game: GameIdResponse
}>()

const gameName = () => {
  console.log('props.game', props.game)
  if (!props.game.name) {
    return ''
  }
  if (props.game.name.length > 1) {
    const name = props.game.name.filter((name) => name['@_type'] == 'primary')
    return name[0]['@_value']
  }
  if (props.game.name['@_type'] == 'primary') {
    return props.game.name['@_value']
  }
}
</script>

<style scoped></style>
