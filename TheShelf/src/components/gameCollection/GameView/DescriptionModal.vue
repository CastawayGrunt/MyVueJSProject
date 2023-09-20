<template>
  <div
    v-if="game"
    class="modal fade"
    id="gameDescriptionModal"
    tabindex="-1"
    aria-labelledby="gameDescriptionModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5
            class="modal-title"
            id="gameDescriptionModalLabel"
            v-html="`${name} Description`"
          ></h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click.prevent="$emit('closeModal')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="overflow-auto p-2 mb-3 rounded">
            <p v-html="game.description" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-dismiss="modal"
            @click.prevent="$emit('closeModal')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameType } from '@/services/fireGameData'
import { onMounted, ref } from 'vue'

const name = ref('')

const props = defineProps<{
  game: GameType
}>()

onMounted(() => {
  return (name.value = props.game.name ? props.game.name : '')
})
</script>

<style scoped></style>
