<template>
  <div class="card p-3">
    <table
      v-if="pageResult.pages > 0"
      class="table table-hover table-sm table-responsive-md user-select-none"
    >
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Location</th>
          <th scope="col">Players</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="play in results" :key="play.dataAdded?.toString()">
          <th scope="row" v-html="play.datePlayed"></th>
          <td>{{ play.location }}</td>
          <td>
            <table v-if="play.players.length > 0">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Score</th>
                  <th scope="col">Winnner</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="players in play.players" :key="players.name">
                  <th scope="row">{{ players.name }}</th>
                  <td>{{ players.score }}</td>
                  <td class="text-center">{{ players.winner ? '&#10003;' : '' }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <button
              class="btn btn-outline-danger btn-sm"
              data-toggle="modal"
              data-target="#removePlayModal"
              @click="$emit('openRemoveGamePlayModal', play, updatePage)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <AppPagination
      v-if="pageResult.pages > 1"
      :pageCount="pageResult.pages"
      :current-page="pageResult.currentPage"
      :first-page="pageResult.firstPage"
      :last-page="pageResult.lastPage"
      @onNextClicked="onNext"
      @onPrevClicked="onPrev"
      @onPageClicked="onPage"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Plays } from '@/services/fireUserData'
import AppPagination from '../AppPagination.vue'
import { onMounted, watch, ref } from 'vue'

const props = defineProps<{
  userPlays: Plays[]
}>()

const pageResult = ref({
  pages: ref(0),
  currentPage: ref(1),
  firstPage: ref(true),
  lastPage: ref(false)
})

console.log('PlaysTable', props.userPlays)

const results = ref([] as Plays[])

const PAGE_SIZE = 5

const onNext = () => {
  pageResult.value.currentPage++
  if (pageResult.value.currentPage === pageResult.value.pages) {
    pageResult.value.lastPage = true
  }
  if (pageResult.value.currentPage > 1) {
    pageResult.value.firstPage = false
  }
  updatePage()
}

const onPrev = () => {
  pageResult.value.currentPage--
  if (pageResult.value.currentPage === 1) {
    pageResult.value.firstPage = true
  }
  if (pageResult.value.currentPage < pageResult.value.pages) {
    pageResult.value.lastPage = false
  }
  updatePage()
}

const onPage = (page: number) => {
  pageResult.value.currentPage = page
  if (pageResult.value.currentPage === pageResult.value.pages) {
    pageResult.value.lastPage = true
  }
  if (pageResult.value.currentPage === 1) {
    pageResult.value.firstPage = true
  }
  updatePage()
}

const updatePage = () => {
  pageResult.value.firstPage = pageResult.value.currentPage == 1
  pageResult.value.lastPage = pageResult.value.currentPage == pageResult.value.pages

  const searchResults = getPage(props.userPlays, pageResult.value.currentPage)
  console.log('PlaysTable updatepage function', searchResults)
  if (searchResults === undefined || searchResults.page.length === 0) {
    return
  }

  return (results.value = searchResults.page)
}

const getPage = (source: Plays[], page = 1) => {
  const sorted = source.sort((a, b) => {
    if (a.datePlayed === undefined || b.datePlayed === undefined) {
      return 0
    }
    return a.datePlayed > b.datePlayed ? -1 : 1
  })
  const skipped = skip(sorted, (page - 1) * PAGE_SIZE)
  const result = take(skipped, PAGE_SIZE)
  return {
    page: result,
    pageCount: Math.ceil(source.length / PAGE_SIZE)
  }
}

const skip = (source: Plays[], n: number) => {
  return source.filter((v, i) => {
    if (i < n) {
      return false
    } else {
      return true
    }
  })
}

const take = (source: Plays[], n: number) => {
  return source.filter((v, i) => {
    if (i < n) {
      return true
    } else {
      return false
    }
  })
}

onMounted(() => {
  pageResult.value.pages = Math.ceil(props.userPlays.length / PAGE_SIZE)
  updatePage()
})

watch(
  () => props.userPlays,
  () => {
    console.log('PlaysTable watch', props.userPlays)
    pageResult.value.pages = Math.ceil(props.userPlays.length / PAGE_SIZE)
    updatePage()
  }
)
</script>

<style scoped></style>
