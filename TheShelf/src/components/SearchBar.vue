<template>
  <!-- emiting events with parameters https://www.nightprogrammer.com/vue-js/emit-event-parameters-parent-component-vuejs/ -->
  <form
    class="d-sm-inline-block form-inline mr-md-auto my-md-0 mw-100 navbar-search"
    @submit.prevent="$emit('onSubmit', query)"
  >
    <div class="input-group">
      <input
        name="search-bar"
        type="text"
        class="form-control bg-white border-primary border-1 small"
        :placeholder="placeholder"
        aria-label="Search"
        aria-describedby="basic-addon2"
        v-model.trim="query"
      />
      <div class="input-group-append">
        <button class="btn btn-primary" type="submit">
          <i class="fas fa-search fa-sm"></i>
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const query = ref('')

defineProps<{
  placeholder: string
}>()
</script>

<style scoped></style>
