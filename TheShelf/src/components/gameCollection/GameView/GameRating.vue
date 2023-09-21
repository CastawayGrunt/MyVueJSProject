<template>
  <LabelText label="Avg. User Rating" :text="`${gameRating}/5 ${numberOfRatings}&nbsp;reviews`" />
</template>

<script setup lang="ts">
import LabelText from '@/components/gameCollection/LabelText.vue'
import { ratingAverage } from '@/helpers/ratingsHelpers'
import type { Ratings } from '@/services/fireGameData'
import { onMounted, ref, watch } from 'vue'

const gameRating = ref('0')
const numberOfRatings = ref(0)

const props = defineProps<{
  rating: Ratings | undefined
}>()

watch(
  () => props.rating,
  (rating) => {
    if (rating !== undefined) {
      findDbGameRating(rating)
    }
  }
)

onMounted(() => {
  if (props.rating === undefined) {
    gameRating.value = '0'
  } else {
    findDbGameRating(props.rating)
  }
})

const findDbGameRating = (rating: Ratings | undefined) => {
  if (rating !== undefined) {
    const dbGameRating = ratingAverage(rating)
    if (dbGameRating === 0) {
      gameRating.value = '0'
    } else {
      gameRating.value = dbGameRating.formattedAverageString.toString()
      numberOfRatings.value = dbGameRating.totalRatings
    }
  }
}
</script>

<style scoped></style>
