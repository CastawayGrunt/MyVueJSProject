<template>
  <div>
    <div class="col mb-2">
      <div class="card h-100">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h4 class="m-0 font-weight-bold text-primary" v-html="game?.name"></h4>
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
              <button class="dropdown-item" @click.prevent="$emit('logPlay')">Log Play</button>
              <!-- <div class="dropdown-divider"></div>
              <button
                class="dropdown-item text-danger"
                data-toggle="modal"
                data-target="#removeGameModal"
                @click.prevent="showRemoveGameModal()"
              >
                Remove Game
              </button> -->
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="d-flex flex-column flex-md-row">
            <div class="col-md-4 p-2 d-flex align-items-center">
              <img :src="game?.image" class="card-img img-fluid" />
            </div>
            <div class="p-3 d-flex flex-column">
              <LabelText label="Players" :text="`${game?.minPlayers} - ${game?.maxPlayers}`" />
              <LabelText
                label="Play Time"
                :text="`${game?.minPlaytime} - ${game?.maxPlaytime} min`"
              />
              <LabelText label="Age" :text="`${game?.minAge}+`" />
              <LabelText label="Year Published" :text="`${game?.yearPublished}`" />
              <LabelText label="Avg. User Rating" :text="`${ratingAverage(game?.rating)}/5 `" />
            </div>
          </div>
          <div>
            <span style="max-height: 75px" v-html="` ${game?.description}`" />
          </div>
          <hr class="bg-primary mx-2" />
          <div class="d-flex flex-column p-3">
            <LabelText label="Your Rating" :text="`${currentRating}/5 `" />
            <form :onsubmit="submitRating()">
              <div class="rating">
                <input type="radio" name="rating" value="5" id="5" /><label for="5">☆</label>
                <input type="radio" name="rating" value="4" id="4" /><label for="4">☆</label>
                <input type="radio" name="rating" value="3" id="3" /><label for="3">☆</label>
                <input type="radio" name="rating" value="2" id="2" /><label for="2">☆</label>
                <input type="radio" name="rating" value="1" id="1" /><label for="1">☆</label>
              </div>
            </form>
            <LabelText label="Comment" :text="`${userGameInfo.comment}`" />
            <LabelText label="Plays" :text="`${userGameInfo.plays}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LabelText from '@/components/gameCollection/LabelText.vue'
import { type GameType } from '@/services/fireGameData'
import { ratingAverage } from '@/helpers/ratingsHelpers'
import { ref, onMounted } from 'vue'
import type { GameCollection } from '@/services/fireUserData'

const props = defineProps<{
  game: GameType
  userGameInfo: GameCollection
}>()

const newRating = ref(0)
const currentRating = ref(0)

const submitRating = () => {
  newRating.value = currentRating.value
  console.log(currentRating.value)
}

onMounted(() => {
  if (props.userGameInfo.rating === undefined) {
    currentRating.value = 0
    return
  } else {
    currentRating.value = props.userGameInfo.rating
  }
})

// const removeGameModalVisible = ref(false)

// const showRemoveGameModal = () => {
//   removeGameModalVisible.value = true
// }
// const hideRemoveGameModal = () => {
//   removeGameModalVisible.value = false
// }
</script>

<style scoped>
.rating {
  display: flex;
  flex-direction: row-reverse;
  justify-content: start;
}

.rating > input {
  display: none;
}

.rating > label {
  position: relative;
  width: 1em;
  font-size: 30px;
  font-weight: 300;
  color: #4e73df;
  cursor: pointer;
}

.rating > label::before {
  content: '\2605';
  position: absolute;
  opacity: 0;
}

.rating > label:hover:before,
.rating > label:hover ~ label:before {
  opacity: 1 !important;
}

.rating > input:checked ~ label:before {
  opacity: 1;
}

.rating:hover > input:checked ~ label:before {
  opacity: 0.4;
}
</style>
