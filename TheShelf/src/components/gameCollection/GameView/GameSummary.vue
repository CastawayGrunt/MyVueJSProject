<template>
  <div>
    <DataView
      :value="gamesView"
      dataKey="gamesView.bggId"
      :layout="layout"
      paginator
      :rows="6"
      :rowsPerPageOptions="[6, 12, 24]"
      :sortOrder="sortOrder"
      :sortField="sortField"
    >
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <Dropdown
            v-model="sortKey"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort By"
            @change="onSortChange($event)"
          />
          <DataViewLayoutOptions v-model="layout" />
        </div>
      </template>
      <template #list="slotProps">
        <div class="col-12">
          <div class="h-100">
            <div class="card-header d-flex flex-row align-items-center justify-content-between">
              <RouterLink
                :to="{ name: 'viewGame', params: { id: slotProps.data.bggId } }"
                class="h4 m-0 font-weight-bold text-primary nav-link"
                ><span v-html="slotProps.data.name"
              /></RouterLink>
              <div class="dropdown no-arrow">
                <a
                  class="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div
                  class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div class="dropdown-header">Options:</div>
                  <button
                    class="dropdown-item"
                    @click.prevent="viewGameClicked(slotProps.data.bggId)"
                  >
                    View Game
                  </button>
                  <button class="dropdown-item" @click.prevent="$emit('logPlay')">Log Play</button>
                  <div class="dropdown-divider"></div>
                  <button
                    class="dropdown-item text-danger"
                    data-toggle="modal"
                    data-target="#removeGameModal"
                    @click.prevent="$emit('showRemoveGameModal', slotProps.data)"
                  >
                    Remove Game
                  </button>
                </div>
              </div>
            </div>

            <div class="d-flex flex-column md:flex-row pl-4">
              <LabelText
                class="col-4 col-md-4 col-lg-3 col-xl-2"
                label="Players"
                :text="`${slotProps.data.minPlayers} - ${slotProps.data.maxPlayers}`"
              />
              <LabelText
                class="col-8 col-md-4 col-lg-3 col-xl-2"
                label="Play Time"
                :text="`${slotProps.data.minPlaytime} - ${slotProps.data.maxPlaytime}min`"
              />
              <LabelText
                class="col-4 col-md-4 col-lg-3 col-xl-2"
                label="Age"
                :text="`${slotProps.data.minAge}+`"
              />
              <LabelText
                class="col-8 col-md-4 col-lg-3 col-xl-2"
                label="Year Published"
                :text="`${slotProps.data.yearPublished}`"
              />
              <GameRating
                class="col-12 col-md-8 col-lg-8 col-xl-4"
                :rating="slotProps.data?.rating"
              />
            </div>
          </div>
        </div>
      </template>
      <!-- grid layout -->
      <template #grid="slotProps">
        <div class="col-12 lg:col-6 xxl:col-4 p-2">
          <div class="card h-100">
            <div class="card-header d-flex flex-row align-items-center justify-content-between">
              <RouterLink
                :to="{ name: 'viewGame', params: { id: slotProps.data.bggId } }"
                class="h4 m-0 font-weight-bold text-primary nav-link"
                ><span v-html="slotProps.data.name"
              /></RouterLink>
              <div class="dropdown no-arrow">
                <a
                  class="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div
                  class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div class="dropdown-header">Options:</div>
                  <button
                    class="dropdown-item"
                    @click.prevent="viewGameClicked(slotProps.data.bggId)"
                  >
                    View Game
                  </button>
                  <button class="dropdown-item" @click.prevent="$emit('logPlay')">Log Play</button>
                  <div class="dropdown-divider"></div>
                  <button
                    class="dropdown-item text-danger"
                    data-toggle="modal"
                    data-target="#removeGameModal"
                    @click.prevent="$emit('showRemoveGameModal', slotProps.data)"
                  >
                    Remove Game
                  </button>
                </div>
              </div>
            </div>

            <div class="d-flex flex-column md:flex-row">
              <div class="md:col-4 p-2 d-flex align-items-center">
                <img :src="slotProps.data.image" class="card-img img-fluid" />
              </div>
              <div class="p-3 d-flex flex-column">
                <div>
                  <!-- style from Kevin Powell youtube short -->
                  <span
                    style="
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 4;
                      overflow: hidden;
                    "
                    v-html="slotProps.data.description"
                  />
                </div>
                <LabelText
                  label="Players"
                  :text="`${slotProps.data.minPlayers} - ${slotProps.data.maxPlayers}`"
                />
                <LabelText
                  label="Play Time"
                  :text="`${slotProps.data.minPlaytime} - ${slotProps.data.maxPlaytime} min`"
                />
                <LabelText label="Age" :text="`${slotProps.data.minAge}+`" />
                <LabelText label="Year Published" :text="`${slotProps.data.yearPublished}`" />
                <GameRating :rating="slotProps.data?.rating" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup lang="ts">
import DataView from 'primevue/dataview'
import Dropdown, { type DropdownChangeEvent } from 'primevue/dropdown'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import LabelText from '@/components/gameCollection/LabelText.vue'
import GameRating from '@/components/gameCollection/GameView/GameRating.vue'
import { type GameType } from '@/services/fireGameData'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { watchArray } from '@vueuse/core'

const props = defineProps<{
  games: GameType[]
}>()

const layout = ref<'grid' | 'list'>('grid')
const gamesView = ref<GameType[]>()
const router = useRouter()
const sortKey = ref()
const sortOrder = ref()
const sortField = ref()
const sortOptions = ref([
  { label: 'Name A to Z', value: 'name' },
  { label: 'Name Z to A', value: '!name' },
  { label: 'Year Old to New', value: 'yearPublished' },
  { label: 'Year New to Old', value: '!yearPublished' }
])

const viewGameClicked = (bggId: string) => {
  router.push({ name: 'viewGame', params: { id: bggId } })
}

const onSortChange = (event: DropdownChangeEvent) => {
  const value = event.value.value
  const sortValue = event.value

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1
    sortField.value = value.substring(1, value.length)
    sortKey.value = sortValue
  } else {
    sortOrder.value = 1
    sortField.value = value
    sortKey.value = sortValue
  }
}

watchArray(
  () => props.games,
  (newGames, oldGames) => {
    if (newGames !== oldGames) {
      gamesView.value = newGames
    }
  }
)

onMounted(() => {
  gamesView.value = props.games
})
</script>

<style scoped></style>
