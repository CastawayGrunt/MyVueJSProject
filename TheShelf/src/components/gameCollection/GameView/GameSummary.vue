<template>
  <div>
    <div class="col mb-2">
      <div class="card h-100">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h4 class="m-0 font-weight-bold text-primary" v-html="game.name"></h4>
          <div class="dropdown no-arrow">
            <a
              class="dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
            </a>
            <div
              class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
              aria-labelledby="dropdownMenuLink"
            >
              <div class="dropdown-header">Options:</div>
              <button class="dropdown-item" @click.prevent="viewGameClicked()">View Game</button>
              <button class="dropdown-item" @click.prevent="$emit('logPlay')">Log Play</button>
              <div class="dropdown-divider"></div>
              <button
                class="dropdown-item text-danger"
                data-toggle="modal"
                data-target="#removeGameModal"
                @click.prevent="showRemoveGameModal()"
              >
                Remove Game
              </button>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column flex-md-row">
          <div class="col-md-4 p-2 d-flex align-items-center">
            <img :src="game.image" class="card-img img-fluid" />
          </div>
          <div class="p-3 d-flex flex-column">
            <div>
              <span style="max-height: 75px" v-html="` ${game.description.substring(0, 115)}...`" />
              <!-- TODO: fix this modal -->
              <!-- <button
                class="btn btn-link btn-sm text-right"
                data-toggle="modal"
                data-target="#gameDescriptionModal"
                @click.prevent="showGameDescriptionModal()"
              >
                read more
              </button> -->
            </div>
            <LabelText label="Players" :text="`${game.minPlayers} - ${game.maxPlayers}`" />
            <LabelText label="Play Time" :text="`${game.minPlaytime} - ${game.maxPlaytime} min`" />
            <LabelText label="Age" :text="`${game.minAge}+`" />
            <LabelText label="Year Published" :text="`${game.yearPublished}`" />
            <LabelText label="Avg. User Rating" :text="`${ratingAverage(game.rating)}/5 `" />
          </div>
        </div>
      </div>
    </div>
    <RemoveGameModal
      v-if="removeGameModalVisible"
      :game="game"
      @deleteGame="$emit('onDeleteGame', game)"
      @cancelDelete="hideRemoveGameModal()"
    />
    <DescriptionModal
      v-if="gameDescriptionModalVisible"
      :game="game"
      @closeModal="hideGameDescriptionModal()"
    />
  </div>
</template>

<script lang="ts" setup>
import LabelText from '@/components/gameCollection/LabelText.vue'
import RemoveGameModal from '@/components/gameCollection/GameView/RemoveGameModal.vue'
import DescriptionModal from '@/components/gameCollection/GameView/DescriptionModal.vue'
import { type GameType } from '@/services/fireGameData'
import { ratingAverage } from '@/helpers/ratingsHelpers'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  game: GameType
}>()

const removeGameModalVisible = ref(false)
const gameDescriptionModalVisible = ref(false)
const router = useRouter()

const showRemoveGameModal = () => {
  removeGameModalVisible.value = true
}
const hideRemoveGameModal = () => {
  removeGameModalVisible.value = false
}

// const showGameDescriptionModal = () => {
//   gameDescriptionModalVisible.value = true
// }
const hideGameDescriptionModal = () => {
  gameDescriptionModalVisible.value = false
}

const viewGameClicked = () => {
  router.push({ name: 'editGame', params: { id: props.game.bggId } })
}
</script>

<style scoped></style>
