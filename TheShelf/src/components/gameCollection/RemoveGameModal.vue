<template>
  <div
    v-if="game"
    class="modal fade"
    id="removeGameModal"
    tabindex="-1"
    aria-labelledby="removeGameModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-primary" id="removeGameModalLabel">Confirm Removal</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click.prevent="$emit('cancelDelete')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="text-lg">Are you sure you want to remove {{ name }} from your collection?</p>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-dismiss="modal"
            @click.prevent="$emit('cancelDelete')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-dismiss="modal"
            @click.prevent="$emit('deleteGame', game)"
          >
            Remove Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { GameType } from '@/services/fireGameData'

const name = ref('')

const props = defineProps<{
  game: GameType
}>()

onMounted(() => {
  return (name.value = props.game.name ? props.game.name : '')
})
</script>

<style scoped></style>
