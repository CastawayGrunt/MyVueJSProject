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
                {{ gamesSummary.gamesOwned }}
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
                    {{ gamesSummary.mostPlayedGame().mostPlayedGamePlays }}
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
                {{ gamesSummary.gamesPlayed }}
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

const gamesSummary = computed(() => {
  const gamesOwned = user?.games.length

  const gamesPlayed = user?.games.filter((game) => game.plays.length > 0).length

  const mostPlayedGame = () => {
    const mostPlayedGame = user?.games
      .sort((a, b) => b.plays.length - a.plays.length)
      .slice(0, 1)[0]

    let mostPlayedGameName = ''
    if (mostPlayedGame?.plays.length === 0) {
      mostPlayedGameName = 'No games played yet'
    }
    let mostPlayedGamePlays = mostPlayedGame?.plays.length
    if (!mostPlayedGamePlays) {
      mostPlayedGamePlays = undefined
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
