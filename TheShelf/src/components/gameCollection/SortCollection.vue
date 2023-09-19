<template>
  <div>
    <!-- <span class="mr-2">sort by:</span> -->
    <div class="btn-group">
      <button
        @click.prevent="$emit('sortName')"
        :disabled="disableButton === 'name'"
        class="btn btn-outline-primary mt-2 mt-md-0"
      >
        Name
      </button>
      <button
        @click.prevent="$emit('sortRating')"
        :disabled="disableButton === 'rating'"
        class="btn btn-outline-primary mt-2 mt-md-0"
      >
        Rating
      </button>
      <button
        @click.prevent="$emit('sortYear')"
        :disabled="disableButton === 'year'"
        class="btn btn-outline-primary mt-2 mt-md-0"
      >
        Year
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  disableButton: string
}>()
</script>

<style scoped></style>
