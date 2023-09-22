<template>
  <!-- Page Wrapper -->
  <div id="wrapper" class="d-flex flex-column align-items-center h-100">
    <AppHomeNav />
    <div class="container row my-atuo h-100">
      <div
        id="description"
        class="text-white p-4 col-12 col-md-6 d-flex justify-content-end justify-content-md-center align-items-start flex-column"
      >
        <h1 class="text-uppercase">The Shelf</h1>
        <p class="text-wrap">
          This is the place to keep track of your game collection. Track the games you own, your
          personal ratings, plays and more!
        </p>
      </div>
      <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
        <img width="300" src="@/assets/img/undraw_playing_cards.svg" alt="Playing cards image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHomeNav from '../components/layout/AppHomeNav.vue'
</script>

<style scoped>
#description {
  width: 100%;
  @media screen and (min-width: 768px) {
    width: 100%;
  }
}
</style>
