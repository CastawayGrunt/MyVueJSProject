<template>
  <div
    class="modal fade"
    id="addGamePlayModal"
    tabindex="-1"
    aria-labelledby="addGamePlayModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addGamePlayModalLabel">Add Play</h5>

          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click.prevent="$emit('cancelAddPlay')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <form>
            <div class="form-group">
              <input
                type="date"
                class="form-control form-control-user"
                id="datePlayed"
                placeholder="Date Played"
                v-model="newPlay.datePlayed"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control form-control-user"
                id="location"
                placeholder="Location"
                v-model="newPlay.location"
              />
            </div>
            <div v-for="player in newPlay.players" :key="player.name">
              <hr />
              <div class="form-group">
                <input
                  type="text"
                  class="form-control form-control-user"
                  :id="`name ${player.name}`"
                  placeholder="Player Name"
                  v-model="player.name"
                />
              </div>
              <div class="form-group">
                <input
                  type="number"
                  class="form-control form-control-user"
                  :id="`playerScore ${player.name}`"
                  placeholder="Score"
                  v-model="player.score"
                />
              </div>
              <div class="custom-control custom-checkbox small form-group">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  :id="`winner ${player.name}`"
                  v-model="player.winner"
                />
                <label class="custom-control-label" :for="`winner ${player.name}`">Winner</label>
              </div>
            </div>
            <div class="d-flex flex-column md:flex-row md:align-items-center">
              <button
                type="button"
                class="btn btn-primary btn-user mb-2 md:mb-0 flex-fill"
                @click.prevent="addPlayer()"
              >
                Add Player
              </button>
              <button
                v-if="newPlay.players.length > 0"
                type="button"
                class="btn btn-danger btn-user md:ml-2 flex-fill"
                @click.prevent="removePlayer()"
              >
                Remove Player
              </button>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-dismiss="modal"
            @click.prevent="$emit('cancelAddPlay', resetPlayRef())"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-dismiss="modal"
            @click.prevent="onPlaySubmit(newPlay)"
          >
            Save play
          </button>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { GameCollection, Plays } from '@/services/fireUserData'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

const userStore = useUserStore()
const newPlay = ref<Plays>({
  gameId: '',
  datePlayed: '',
  location: '',
  players: []
})
const toast = useToast()

const props = defineProps<{
  game: GameCollection
}>()

const addPlayer = () => {
  newPlay.value.players.push({
    name: '',
    score: NaN,
    winner: false
  })
}

const removePlayer = () => {
  newPlay.value.players.pop()
}

const onPlaySubmit = async (play: Plays) => {
  const gameid = props.game.gameId
  play.gameId = gameid

  const playAdded = await userStore.addGamePlay(props.game, play)
  if (playAdded) {
    toast.add({
      severity: 'success',
      summary: 'Play Added',
      detail: 'Play has been added to your collection',
      life: 3000
    })
    resetPlayRef()
  }
}

const resetPlayRef = () => {
  newPlay.value = {
    gameId: '',
    datePlayed: '',
    location: '',
    players: []
  }
}
</script>

<style lang="scss" scoped></style>
