<template>
  <!-- Content Wrapper -->
  <div id="wrapper">
    <AppSidebar />
    <div id="content-wrapper" class="d-flex flex-column">
      <AppTopbar />
      <div id="content">
        <div id="wrapper">
          <div class="container-fluid">
            <RouterView />
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  </div>
  <!-- End of Content Wrapper -->
</template>

<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped></style>
