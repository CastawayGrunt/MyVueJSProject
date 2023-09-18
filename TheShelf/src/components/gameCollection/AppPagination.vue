<template>
  <ul class="pagination justify-content-center mt-4">
    <li class="page-item" :class="{ disabled: firstPage }">
      <a class="page-link" href="#" tabindex="-1" @click.prevent="$emit('onPrevClicked')"
        >Previous</a
      >
    </li>
    <li v-for="n in pages" :key="n" class="page-item" :class="{ active: n == currentPage }">
      <a v-if="n.toString() == '...'" class="page-link">{{ n }}</a>
      <a v-else class="page-link" href="#" @click.prevent="$emit('onPageClicked', n)">{{ n }}</a>
    </li>
    <li class="page-item" :class="{ disabled: lastPage }">
      <a class="page-link" href="#" @click.prevent="$emit('onNextClicked')">Next</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const props = defineProps<{
  firstPage: boolean
  lastPage: boolean
  pageCount: number
  currentPage: number
}>()

const pages = computed(() => {
  if (props.pageCount < 8) {
    return Array.from({ length: props.pageCount }, (_, index) => index + 1)
  }

  const paginationLength = ref(5)

  if (width.value <= 425) {
    paginationLength.value = 2
  }
  if (width.value <= 768) {
    paginationLength.value = 4
  }

  const front = Array.from({ length: paginationLength.value }, (_, index) => index + 1)
  const back = Array.from(
    { length: paginationLength.value },
    (_, index) => props.pageCount - index
  ).reverse()
  return front.concat(['...']).concat(back)
})
</script>

<style scoped></style>
