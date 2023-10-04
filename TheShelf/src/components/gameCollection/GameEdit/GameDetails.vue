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
              <button
                class="dropdown-item"
                data-toggle="modal"
                data-target="#addCommentModal"
                @click.prevent="showAddComment()"
              >
                {{ commentButtonText }}
              </button>
              <button
                class="dropdown-item"
                data-toggle="modal"
                data-target="#addGamePlayModal"
                @click.prevent="showLogPlay()"
              >
                Log Play
              </button>
              <div class="dropdown-divider"></div>
              <button
                class="dropdown-item text-danger"
                data-toggle="modal"
                data-target="#removeGameModal"
                @click.prevent="showRemoveGameModal(game)"
              >
                Remove Game
              </button>
            </div>
          </div>
        </div>

        <div class="p-2">
          <div class="d-flex flex-column md:flex-row">
            <div class="md:col-4 p-2 d-flex align-items-center md:max-h-16rem md:max-w-12rem">
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
              <div class="d-flex flex-column md:flex-row justify-content-between">
                <div class="label font-weight-bold d-flex align-items-center">
                  Your Rating:
                  <div class="ml-2">
                    <Rating v-model="userRating" :cancel="false" />
                  </div>
                </div>
                <button
                  v-if="ratingChanged"
                  class="btn btn-outline-primary btn-sm mt-2 md:mt-0 mb-2 md:ml-2"
                  type="submit"
                  @click.prevent="submitRating(userRating)"
                >
                  Submit Rating
                </button>
              </div>
            </form>
            <div class="d-flex align-items-center justify-content-between">
              <LabelText label="Comment" :text="`${userGameInfo.comment}`" />
              <button
                data-toggle="modal"
                data-target="#addCommentModal"
                class="btn btn-outline-primary btn-sm mb-2 ml-2 d-none d-sm-inline-block"
                type="submit"
                @click.prevent="showAddComment()"
              >
                {{ commentButtonText }}
              </button>
            </div>
            <div class="d-flex align-items-center justify-content-between">
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
    <PlaysFormModal v-if="logGameModalVisible" :game="userGameInfo" @hideForm="hideLogPlay" />
    <RemovePlayModal
      v-if="activePlay"
      :play="activePlay"
      @cancelRemovePlay="resetActivePlay"
      @removePlay="removePlay"
    />
    <RemoveGameModal
      v-if="removeGameModalVisible"
      :game="activeGame"
      @deleteGame="removeGame"
      @cancelDelete="hideRemoveGameModal()"
    />
    <CommentModal
      v-if="commentModalVisible"
      :game="userGameInfo"
      @cancelAddComment="hideAddComment"
    />
  </div>
</template>

<script lang="ts" setup>
import LabelText from '@/components/gameCollection/LabelText.vue'
import GameRating from '@/components/gameCollection/GameView/GameRating.vue'
import CommentModal from '@/components/gameCollection/GameEdit/CommentModal.vue'
import RemoveGameModal from '@/components/gameCollection/GameView/RemoveGameModal.vue'
import PlaysTable from './PlaysTable.vue'
import PlaysFormModal from './PlaysFormModal.vue'
import RemovePlayModal from './RemovePlayModal.vue'
import { type GameType } from '@/services/fireGameData'
import type { GameCollection, Plays } from '@/services/fireUserData'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'
import Rating from 'primevue/rating'

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

const props = defineProps<{
  game: GameType
  userGameInfo: GameCollection
  userPlays: Plays[]
}>()

const userRating = ref(0)
const ratingChanged = ref(false)
const logGameModalVisible = ref(false)
const commentModalVisible = ref(false)
const commentButtonText = ref('')
const activePlay = ref(null as Plays | null)

watch(
  () => props.userGameInfo.comment,
  (comment) => {
    setCommentButtonText(comment)
  }
)

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
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error updating rating, please try again later',
      life: 3000
    })
    return
  }
  userRating.value = newRating

  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Rating updated',
    life: 3000
  })
  return (ratingChanged.value = false)
}

const openRemoveGamePlayModal = (play: Plays) => {
  activePlay.value = play
}

const removePlay = async (play: Plays) => {
  const removed = await userStore.deleteGamePlay(play)
  if (removed) {
    toast.add({
      severity: 'success',
      summary: 'Play Removed',
      detail: 'Play has been removed from your collection',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error removing play, please try again later',
      life: 3000
    })
  }
  resetActivePlay()
}

const resetActivePlay = () => {
  activePlay.value = null
}

const setCommentButtonText = (comment: string) => {
  if (comment === undefined || comment === null || comment === '') {
    return (commentButtonText.value = 'Add Comment')
  }
  return (commentButtonText.value = 'Edit Comment')
}

onMounted(() => {
  userRating.value = props.userGameInfo.rating

  setCommentButtonText(props.userGameInfo.comment)
})

const removeGameModalVisible = ref(false)
const activeGame = ref({} as GameType)

const showRemoveGameModal = (data: GameType) => {
  removeGameModalVisible.value = true
  activeGame.value = data
}

const hideRemoveGameModal = () => {
  removeGameModalVisible.value = false
  activeGame.value = {} as GameType
}

const removeGame = async (game: GameType) => {
  const gameRemoved = await useUserStore().deleteUserGame(game)
  if (gameRemoved) {
    toast.add({
      severity: 'success',
      summary: 'Game Removed',
      detail: `${game.name} has been removed from your collection`,
      life: 3000
    })
    router.replace({ name: 'games' })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `There was an error removing ${game.name} from your collection`,
      life: 3000
    })
  }
}

const showLogPlay = () => {
  logGameModalVisible.value = true
}

const hideLogPlay = () => {
  logGameModalVisible.value = false
}
const showAddComment = () => {
  commentModalVisible.value = true
}

const hideAddComment = () => {
  commentModalVisible.value = false
}
</script>

<style scoped>
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
