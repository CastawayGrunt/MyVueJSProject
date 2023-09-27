<template>
  <div class="card mb-3">
    <div class="card-header">Change Profile Picture</div>
    <div class="card-body">
      <div class="d-flex flex-column flex-md-row align-items-center">
        <div>
          <img
            style="height: 200px"
            class="img-profile rounded-circle image-fluid"
            :src="profileURL"
            alt="Profile Image"
          />
        </div>
        <div
          class="d-flex flex-column align-items-center align-items-md-start justify-content-center mt-2 mt-md-0 ml-md-4"
        >
          <p class="text-center text-md-left">
            Use the options below to customize your profile image.
          </p>
          <div class="d-flex flex-column justify-content-center">
            <button
              :disabled="updatingImage"
              class="btn btn-primary mb-2"
              type="button"
              @click.prevent="uploadClicked()"
            >
              <i class="fa fa-upload pr-2"></i>Update Profile Picture
            </button>
            <button
              :disabled="defaultPhoto"
              class="btn btn-danger"
              type="button"
              @click.prevent="removeClicked()"
            >
              <i class="fa fa-trash pr-2"></i>Remove Profile Picture
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { placeholderImg } from '@/helpers/placeHolders'
import { useUserStore } from '@/stores/user'
import { useFileDialog } from '@vueuse/core'
import { ref, onMounted, onUpdated } from 'vue'

const { open, onChange } = useFileDialog()
const defaultPhoto = ref(true)
const updatingImage = ref(false)

const userStore = useUserStore()
const profileURL = ref('')

const uploadClicked = () => {
  open({ accept: 'image/*', multiple: false })
}

onUpdated(() => {
  if (userStore.user) {
    profileURL.value = userStore.user.photoURL
  }
})

onMounted(() => {
  if (userStore.user?.photoURL !== placeholderImg) {
    defaultPhoto.value = false
  }
  if (userStore.user) {
    profileURL.value = userStore.user.photoURL
  }
  onChange((files) => {
    if (files && files.length > 0) {
      uploadImage(files[0])
    }
  })
})

const uploadImage = async (file: File) => {
  updatingImage.value = true
  const removedOldPic = await userStore.removeProfilePicture()
  if (removedOldPic) {
    await userStore.uploadProfilePicture(file)
  }
  updatingImage.value = false
}

const removeClicked = async () => {
  const url = await userStore.removeProfilePicture()

  if (url && userStore.user) {
    profileURL.value = userStore.user.photoURL
  }
}
</script>

<style scoped></style>
