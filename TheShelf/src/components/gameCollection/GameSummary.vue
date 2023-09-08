<template>
  <div class="card p-2 flex-column flex-md-row mb-2 col-xl-6 col-md-12">
    <div class="col-md-4 p-2 d-flex align-items-center">
      <img :src="game.image" class="card-img" />
    </div>
    <div class="ml-3 mt-3 card-body">
      <h2 class="font-weight-bold text-primary">{{ game.name }}</h2>
      <p>{{ game.description }}</p>
      <LabelText label="Players" :text="`${game.minPlayers} - ${game.maxPlayers}`" />
      <LabelText label="Play Time" :text="`${game.minPlaytime} - ${game.maxPlaytime} min`" />
      <LabelText label="Age" :text="`${game.minAge}+`" />
      <LabelText label="Year Published" :text="`${game.yearPublished}`" />
    </div>
  </div>
</template>

<script lang="ts">
import LabelText from '@/components/gameCollection/LabelText.vue'
import { defineComponent } from 'vue'
import { GameType } from '@/stores/game'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'GameSummary',
  components: {
    LabelText
  },
  props: {
    game: {
      type: Object as PropType<GameType>,
      required: true
    }
  },
  setup(props) {
    return { props }
  }
})
</script>

<style scoped></style>
