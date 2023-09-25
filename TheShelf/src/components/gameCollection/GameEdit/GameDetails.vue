<template>
  <div>
    <div class="mb-2">
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
              <button
                class="dropdown-item"
                data-toggle="modal"
                data-target="#addGamePlayModal"
                @click.prevent="showLogPlay()"
              >
                Log Play
              </button>
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
              <GameRating :rating="game?.rating" />
            </div>
          </div>
          <div
            class="overflow-auto border border-primary p-2 px-3 rounded m-2"
            style="max-height: 105px"
          >
            <span v-html="` ${game?.description}`" />
          </div>
          <div class="d-flex flex-column p-3">
            <form>
              <div class="d-flex flex-column flex-md-row">
                <div class="label font-weight-bold d-flex align-items-center">
                  Your Rating:
                  <div class="rating">
                    <input
                      type="radio"
                      name="rating"
                      :value="5"
                      id="5"
                      v-model="userRating"
                    /><label for="5">&#9734;</label>
                    <input
                      type="radio"
                      name="userRating"
                      :value="4"
                      id="4"
                      v-model="userRating"
                    /><label for="4">&#9734;</label>
                    <input
                      type="radio"
                      name="userRating"
                      :value="3"
                      id="3"
                      v-model="userRating"
                    /><label for="3">&#9734;</label>
                    <input
                      type="radio"
                      name="userRating"
                      :value="2"
                      id="2"
                      v-model="userRating"
                    /><label for="2">&#9734;</label>
                    <input
                      type="radio"
                      name="userRating"
                      :value="1"
                      id="1"
                      v-model="userRating"
                    /><label for="1">&#9734;</label>
                  </div>
                </div>
                <button
                  v-if="ratingChanged"
                  class="btn btn-outline-primary mb-2 ml-md-2"
                  type="submit"
                  @click.prevent="submitRating(userRating)"
                >
                  Submit Rating
                </button>
              </div>
            </form>
            <LabelText label="Comment" :text="`${userGameInfo.comment}`" />
            <div class="d-flex align-items-center">
              <LabelText label="Plays" text="" />
              <button
                data-toggle="modal"
                data-target="#addGamePlayModal"
                class="btn btn-outline-primary btn-sm mb-2 ml-2"
                type="submit"
                @click.prevent="showLogPlay()"
              >
                Log Play
              </button>
            </div>
            <div v-if="userPlays.length > 0">
              <PlaysTable
                :userPlays="userPlays"
                @openRemoveGamePlayModal="openRemoveGamePlayModal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <PlaysFormModal
      v-if="logGameModalVisible"
      :game="userGameInfo"
      @cancelAddPlay="hideLogPlay()"
    />
    <RemovePlayModal
      v-if="activePlay"
      :play="activePlay"
      @cancelRemovePlay="resetActivePlay"
      @removePlay="removePlay"
    />
  </div>
</template>

<script lang="ts" setup>
import LabelText from '@/components/gameCollection/LabelText.vue'
import GameRating from '@/components/gameCollection/GameView/GameRating.vue'
import PlaysTable from './PlaysTable.vue'
import PlaysFormModal from './PlaysFormModal.vue'
import RemovePlayModal from './RemovePlayModal.vue'
import { type GameType } from '@/services/fireGameData'
import { ref, onMounted, watch } from 'vue'
import type { GameCollection, Plays } from '@/services/fireUserData'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const props = defineProps<{
  game: GameType
  userGameInfo: GameCollection
  userPlays: Plays[]
}>()

const userRating = ref(0)
const ratingChanged = ref(true)
const logGameModalVisible = ref(false)
const activePlay = ref(null as Plays | null)

watch(
  () => userRating.value,
  (userRating) => {
    if (userRating === props.userGameInfo.rating) {
      return (ratingChanged.value = false)
    }
    return (ratingChanged.value = true)
  }
)

watch(
  () => props.userGameInfo,
  (userGameInfo) => {
    if (userGameInfo !== null || userGameInfo !== undefined) {
      return (userRating.value = userGameInfo.rating)
    }
  }
)

const submitRating = async (newRating: number) => {
  const ratingSuccuess = await userStore.updateGameRating(props.game, newRating)
  if (ratingSuccuess === false) {
    return
  }
  userRating.value = newRating

  return (ratingChanged.value = false)
}

const openRemoveGamePlayModal = (play: Plays) => {
  activePlay.value = play
}

const removePlay = (play: Plays) => {
  userStore.deleteGamePlay(play)
  resetActivePlay()
}

const resetActivePlay = () => {
  activePlay.value = null
}

onMounted(() => {
  if (props.userGameInfo.rating === undefined) {
    userRating.value = 0
  } else {
    userRating.value = props.userGameInfo.rating
  }
})

// const removeGameModalVisible = ref(false)

// const showRemoveGameModal = () => {
//   removeGameModalVisible.value = true
// }
// const hideRemoveGameModal = () => {
//   removeGameModalVisible.value = false
// }
const showLogPlay = () => {
  logGameModalVisible.value = true
}

const hideLogPlay = () => {
  logGameModalVisible.value = false
}
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

/* scroll bar */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #4e73df;
  border-radius: 8px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #415fb9;
}
</style>
