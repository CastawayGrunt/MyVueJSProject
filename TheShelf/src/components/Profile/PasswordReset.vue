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
          class="btn btn-primary"
          type="button"
          @click.prevent="changePassword"
        >
          Request Password Reset Email
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const sendingEmail = ref(false)
const toast = useToast()

const changePassword = async () => {
  const userStore = useUserStore()
  if (!userStore.user) {
    return
  }
  sendingEmail.value = true

  const sent = await userStore.requestChangePasswordEmail(userStore.user?.email)
  sendingEmail.value = false
  if (sent) {
    toast.add({
      severity: 'success',
      summary: 'Email Sent',
      detail: 'Check your inbox for a password reset email.',
      life: 5000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Email Failed',
      detail: 'Email failed to send, try again later.',
      life: 5000
    })
  }
}
</script>

<style scoped></style>
