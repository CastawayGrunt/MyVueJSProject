<template>
  <p class="mb-2">
    <span class="label font-weight-bold">{{ label }}:</span> {{ text }}
  </p>
</template>

<script lang="ts">
export default {
  name: 'LabelText',
  props: {
    label: {
      type: String,
      required: true
    },
    text: {
      type: String,
      Number,
      required: true
    }
  }
}
</script>

<style scoped></style>
