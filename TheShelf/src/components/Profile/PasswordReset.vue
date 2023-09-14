<template>
  <div class="card">
    <div class="card-header">Change Password</div>
    <div class="card-body">
      <p>
        Click the button below to have an email sent to your inbox to reset the password for your
        account.
      </p>
      <div class="row ml-1">
        <button
          :disabled="sendingEmail"
          class="btn btn-primary btn-lg"
          type="button"
          @click.prevent="changePassword"
        >
          Request Password Reset Email
        </button>
        <div
          v-if="emailConfirmed === 'success'"
          class="alert alert-success alert-dismissible fade show mb-0 ml-4"
          role="alert"
        >
          Email Sent
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="closeAlert()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          v-else-if="emailConfirmed === 'failed'"
          class="alert alert-danger alert-dismissible fade show mt-3 mt-md-0 mb-0 ml-md-4"
          role="alert"
        >
          Email failed, try again later.
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="closeAlert()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const sendingEmail = ref(false)
const emailConfirmed = ref('')

const changePassword = async () => {
  const userStore = useUserStore()
  if (!userStore.user) {
    return
  }
  sendingEmail.value = true

  const sent = await userStore.requestChangePasswordEmail(userStore.user?.email)
  sendingEmail.value = false
  emailConfirmed.value = sent ? 'success' : 'failed'

  setTimeout(() => {
    closeAlert()
  }, 3000)
}

const closeAlert = () => {
  emailConfirmed.value = ''
}
</script>

<style scoped></style>
