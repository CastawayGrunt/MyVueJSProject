<template>
  <div
    class="container d-flex flex-column justify-content-center align-items-center h-100 text-white"
  >
    <img width="400" src="../assets/img/undraw_not_found.svg" alt="404" />
    <h1>404 Page Not Found</h1>
    <p>Looks like the page you're trying to find doesn't exist</p>

    <RouterLink to="/">
      <button type="button" class="btn btn-light text-primary">Go Home</button>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'

export default {
  name: 'PageNotFoundView',
  data() {
    return {}
  },
  components: {
    RouterLink
  }
}
</script>

<style scoped></style>
