<template>
  <div
    v-if="play"
    class="modal fade"
    id="removePlayModal"
    tabindex="-1"
    aria-labelledby="removePlayModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-primary" id="removePlayModalLabel">Confirm Removal</h5>
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
          <p class="text-lg">
            Are you sure you want to remove your play on
            <span class="font-weight-bold" v-html="datePlayed" /> at
            <span class="font-weight-bold" v-html="location" /> from your plays?
          </p>
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
            @click.prevent="$emit('removePlay', play)"
          >
            Remove Play
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plays } from '@/services/fireUserData'
import { onUpdated, onMounted, ref } from 'vue'

const datePlayed = ref('')
const location = ref('')

const props = defineProps<{
  play: Plays
}>()

const setModal = () => {
  datePlayed.value = props.play.datePlayed ? props.play.datePlayed : ''
  location.value = props.play.location ? props.play.location : ''
}

onUpdated(() => {
  return setModal()
})

onMounted(() => {
  return setModal()
})
</script>

<style scoped></style>
