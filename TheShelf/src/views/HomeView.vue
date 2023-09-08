<script setup lang="ts">
import AppHomeNav from '../components/layout/AppHomeNav.vue'
</script>

<template>
  <!-- Page Wrapper -->
  <div id="wrapper" class="d-flex flex-column h-100">
    <AppHomeNav />
    <div
      class="align-items-center justify-content-center flex-column flex-md-row d-flex h-100 gap-5"
    >
      <div class="text-white p-4 w-25">
        <h1 class="text-uppercase">The Shelf</h1>
        <p class="text-wrap">
          This is the place to keep track of your game collection. Track the games you own, your
          personal ratings, plays and more!
        </p>
      </div>
      <div class="">
        <img height="300" src="@/assets/img/undraw_playing_cards.svg" alt="Playing cards image" />
      </div>
    </div>
  </div>
</template>
