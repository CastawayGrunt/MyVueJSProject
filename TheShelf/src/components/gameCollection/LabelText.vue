<template>
  <p class="mb-2">
    <span class="label font-weight-bold">{{ label }}:</span> {{ text }}
  </p>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
  text: string | number
}>()
</script>

<style scoped></style>
