<template>
  <div class="card mb-3">
    <div class="card-header">Change Profile Picture</div>
    <div class="card-body">
      <div class="d-flex flex-column md:flex-row align-items-center">
        <div>
          <img
            style="height: 200px"
            class="img-profile rounded-circle image-fluid"
            :src="profileURL"
            alt="Profile Image"
          />
        </div>
        <div
          class="d-flex flex-column align-items-center md:align-items-start justify-content-center mt-2 md:mt-0 md:ml-4"
        >
          <p class="text-center md:text-left">
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
import { useToast } from 'primevue/usetoast'

const { open, onChange } = useFileDialog()
const defaultPhoto = ref(true)
const updatingImage = ref(false)

const toast = useToast()
const userStore = useUserStore()
const profileURL = ref('')

const uploadClicked = () => {
  open({ accept: 'image/*', multiple: false })
}

onUpdated(() => {
  if (userStore.user) {
    profileURL.value = userStore.user.photoURL
  }
  if (userStore.user?.photoURL !== placeholderImg) {
    defaultPhoto.value = false
  } else {
    defaultPhoto.value = true
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
    toast.add({
      severity: 'success',
      summary: 'Profile Picture Updated',
      detail: 'Your profile picture has been updated.',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Profile Picture Update Failed',
      detail: 'Your profile picture failed to update, try again later.',
      life: 3000
    })
  }

  updatingImage.value = false
}

const removeClicked = async () => {
  const pictureRemoved = await userStore.removeProfilePicture()

  if (pictureRemoved && userStore.user) {
    profileURL.value = userStore.user.photoURL
    toast.add({
      severity: 'success',
      summary: 'Profile Picture Removed',
      detail: 'Your profile picture has been removed.',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Profile Picture Removal Failed',
      detail: 'Your profile picture failed to remove, try again later.',
      life: 3000
    })
  }
}
</script>

<style scoped></style>
