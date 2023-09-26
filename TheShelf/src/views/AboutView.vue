<template>
  <div id="wrapper" class="d-flex flex-column align-items-center">
    <AppHomeNav />
    <div class="container my-auto">
      <div class="card p-4">
        <h1 class="">About The Shelf</h1>
        <div class="d-flex flex-column flex-md-row align-items-center">
          <img
            class="rounded-circle"
            src="@/assets/img/Brendon_Headshot_1.jpg"
            height="200"
            width="200"
          />
          <p class="pt-4 pt-md-0 pl-md-4">
            The Shelf is a personal project created by
            <span class="font-weight-bold">Brendon Woodall</span>. Brendon is a software developer
            with a passion for board games. He created The Shelf while taking a Vue.js course with
            <a href="https://www.comit.org/">ComIT</a>.

            <br />
            <br />
            View the source code for The Shelf on
            <a href="https://github.com/CastawayGrunt/MyVueJSProject">Github</a>.
          </p>
        </div>
        <h2 class="mt-4">What is The Shelf?</h2>

        <p class="">
          The Shelf is a web application that allows users to track their board game collection and
          record how often they play each game. The Shelf is built using the following technologies:
        </p>
        <div class="row">
          <a class="col-4 mb-2 text-center text-decoration-none" href="https://vuejs.org/"
            >Vue.js</a
          >
          <a class="col-4 mb-2 text-center text-decoration-none" href="https://router.vuejs.org/"
            >Vue Router</a
          >
          <a class="col-4 mb-2 text-center text-decoration-none" href="https://pinia.vuejs.org/"
            >Pinia</a
          >
          <a class="col-4 mb-2 text-center text-decoration-none" href="https://vueuse.org/"
            >VueUse</a
          >
          <a class="col-4 mb-2 text-center text-decoration-none" href="https://vuefire.vuejs.org/"
            >VueFire</a
          >

          <a
            class="col-4 mb-2 text-center text-decoration-none"
            href="https://www.typescriptlang.org/"
            >Typescript</a
          >

          <a class="col-4 mb-2 text-center text-decoration-none" href="https://getbootstrap.com/"
            >Bootstrap</a
          >
          <a class="col-4 mb-2 text-center text-decoration-none" href="https://firebase.google.com/"
            >Firebase</a
          >
          <a class="col-4 mb-2 text-center text-decoration-none" href="https://nodejs.org/en"
            >Node.js</a
          >

          <a
            class="col-6 col-md-4 text-center text-decoration-none"
            href="https://github.com/NaturalIntelligence/fast-xml-parser#readme"
            >fast-xml-parser</a
          >

          <a
            class="col-6 col-md-4 text-center text-decoration-none"
            href="https://boardgamegeek.com/wiki/page/BGG_XML_API2#toc3"
            >BGG XML API2</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHomeNav from '@/components/layout/AppHomeNav.vue'
</script>

<style scoped></style>
