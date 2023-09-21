<template>
  <div>
    <div class="col mb-2">
      <div class="card h-100">
        <div class="card-header d-flex flex-row align-items-center justify-content-between">
          <RouterLink
            :to="{ name: 'editGame', params: { id: game.bggId } }"
            class="h4 m-0 font-weight-bold text-primary nav-link"
            ><span v-html="game.name"
          /></RouterLink>
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
              <!-- style from Kevin Powell youtube short -->
              <span
                style="
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 4;
                  overflow: hidden;
                "
                v-html="game.description"
              />
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
            <GameRating :rating="game?.rating" />
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
import GameRating from '@/components/gameCollection/GameView/GameRating.vue'
import RemoveGameModal from '@/components/gameCollection/GameView/RemoveGameModal.vue'
import DescriptionModal from '@/components/gameCollection/GameView/DescriptionModal.vue'
import { type GameType } from '@/services/fireGameData'
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
