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
          <form class="user">
            <div class="form-group">
              <input
                type="date"
                class="form-control form-control-user"
                id="datePlayed"
                placeholder="Date Played"
                v-model="play.datePlayed"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control form-control-user"
                id="location"
                placeholder="Location"
                v-model="play.location"
              />
            </div>
            <div v-for="player in play.players" :key="player.name">
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

              <!-- </div> -->
            </div>
            <button
              type="button"
              class="btn btn-primary btn-user btn-block"
              @click.prevent="addPlayer()"
            >
              Add Player
            </button>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            @click.prevent="$emit('cancelAddPlay', resetPlayRef())"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-dismiss="modal"
            @click.prevent="submitPlay(play)"
          >
            Save play
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { GameCollection, Plays } from '@/services/fireUserData'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const play = ref<Plays>({
  gameId: '',
  datePlayed: '',
  location: '',
  players: []
})

const props = defineProps<{
  game: GameCollection
}>()

const addPlayer = () => {
  play.value.players.push({
    name: '',
    score: NaN,
    winner: false
  })
}

const submitPlay = async (play: Plays) => {
  console.log('submitPlay', play)
  const gameid = props.game.gameId
  play.gameId = gameid

  const playAdded = await userStore.addGamePlay(props.game, play)
  if (playAdded) {
    resetPlayRef()
  }
}

const resetPlayRef = () => {
  play.value = {
    gameId: '',
    datePlayed: '',
    location: '',
    players: []
  }
}
</script>

<style lang="scss" scoped></style>
