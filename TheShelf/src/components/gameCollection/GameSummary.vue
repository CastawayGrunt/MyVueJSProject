<template>
  <div>
    <div class="col mb-2">
      <div class="card h-100">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h4 class="m-0 font-weight-bold text-primary">{{ game.name }}</h4>
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
              <button class="dropdown-item">Edit Game</button>
              <button class="dropdown-item">Log Play</button>
              <div class="dropdown-divider"></div>
              <button
                class="dropdown-item text-danger"
                data-toggle="modal"
                data-target="#removeGameModal"
                @click.prevent="toggleRemoveGameModal()"
              >
                Remove Game
              </button>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column flex-md-row">
          <div class="col-md-4 p-2 d-flex align-items-center">
            <img :src="game.image" class="card-img" />
          </div>
          <div class="p-3 d-flex flex-column">
            <div class="overflow-hidden" style="max-height: 50px">
              <p v-html="game.description" />
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
      v-if="showRemoveGameModal"
      :game="game"
      @deleteGame="$emit('onDeleteGame', game)"
      @cancelDelete="toggleRemoveGameModal()"
    />
  </div>
</template>

<script lang="ts" setup>
import LabelText from '@/components/gameCollection/LabelText.vue'
import RemoveGameModal from '@/components/gameCollection/RemoveGameModal.vue'
import { type GameType } from '@/services/fireGameData'
import { ref } from 'vue'

defineProps<{
  game: GameType
}>()

// type ratings = Pick<GameType, 'rating'>
type ratings = {
  '1star': number
  '2star': number
  '3star': number
  '4star': number
  '5star': number
}

const showRemoveGameModal = ref(false)

const toggleRemoveGameModal = () => {
  showRemoveGameModal.value = !showRemoveGameModal.value
}

// const myRating = ref(3)

const ratingAverage = (ratings: ratings) => {
  if (ratings === undefined) {
    return 0
  }
  const totalRatings =
    ratings['1star'] + ratings['2star'] + ratings['3star'] + ratings['4star'] + ratings['5star']

  if (totalRatings === 0) {
    return 0
  }

  const totalScore =
    ratings['1star'] +
    ratings['2star'] * 2 +
    ratings['3star'] * 3 +
    ratings['4star'] * 4 +
    ratings['5star'] * 5

  const average = totalScore / totalRatings
  return average.toFixed(1)
}
</script>

<style scoped></style>
