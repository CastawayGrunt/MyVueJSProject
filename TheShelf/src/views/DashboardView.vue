<template>
  <AppHeader header="Dashboard" />

  <!-- Content Row -->
  <div class="row">
    <!-- Games Owned Card -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-primary shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                Games Owned
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                {{ gamesSummary.gamesOwned() }}
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-chess-pawn fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Last Played Card Example -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-success shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                Last Played Game
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                {{ gamesSummary.lastPlayed() }}
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-dungeon fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Most Played Card Example -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-info shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                Most Played Game
              </div>
              <div class="row no-gutters align-items-center">
                <div class="col-auto">
                  <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                    {{ gamesSummary.mostPlayedGame().mostPlayedGameName }}
                    {{
                      gamesSummary.mostPlayedGame().mostPlayedGamePlays === 0
                        ? ''
                        : ` - ${gamesSummary.mostPlayedGame().mostPlayedGamePlays}`
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-auto d-flex justify-content-center">
              <div class="text-lg text-gray-700 d-flex justify-content-center">
                <i class="text-center fas fa-trophy fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Requests Card Example -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-warning shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                Games Played
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                {{ gamesSummary.gamesPlayed() }}
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-dice-six fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-6 mb-4">
      <RouterLink
        class="bg-primary p-4 h-100 d-flex flex-column align-items-center justify-content-center rounded nav-link"
        to="collection/games"
      >
        <i class="fas fa-layer-group fa-2x text-white mb-2"></i>
        <div class="text-center font-weight-bold text-white">View Collection</div>
      </RouterLink>
    </div>
    <div class="col-xl-3 col-6 mb-4">
      <RouterLink
        class="bg-info p-4 h-100 d-flex flex-column align-items-center justify-content-center rounded nav-link"
        to="collection/add-game"
      >
        <i class="fas fa-plus fa-2x text-white mb-2"></i>
        <div class="text-center font-weight-bold text-white">Add Game</div>
      </RouterLink>
    </div>
  </div>

  <!-- End of Main Content -->
</template>

<script lang="ts" setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const user = useUserStore().user
const games = useUserStore().gamesData

const gamesSummary = computed(() => {
  const gamesOwned = () => {
    if (user?.games && user?.games.length > 0) {
      return user?.games.length
    } else {
      return 0
    }
  }
  const gamesPlayed = () => {
    if (user?.plays.length) {
      return user?.plays.length
    } else {
      return 0
    }
  }

  const mostPlayedGame = () => {
    let mostPlayedGameName = 'No games played yet'
    let mostPlayedGamePlays = 0

    if (user?.mostPlayed) {
      mostPlayedGameName = user?.mostPlayed

      const mostPlayedGameId = games?.find((game) => game.name === mostPlayedGameName)?.bggId
      mostPlayedGamePlays = user?.plays.filter((play) => play.gameId === mostPlayedGameId).length
      return { mostPlayedGameName, mostPlayedGamePlays }
    }
    return { mostPlayedGameName, mostPlayedGamePlays }
  }

  const lastPlayed = () => {
    if (user?.lastPlayed) {
      return user?.lastPlayed
    } else {
      return 'No games played yet'
    }
  }
  return {
    gamesOwned,
    gamesPlayed,
    lastPlayed,
    mostPlayedGame
  }
})
</script>

<style scoped></style>
