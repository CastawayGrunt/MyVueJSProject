<template>
  <div class="container">
    <!-- Outer Row -->
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-12 col-md-9">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row">
              <div class="col-lg-6 d-none d-lg-block my-auto">
                <img
                  src="@/assets/img/undraw_forgot_password.svg"
                  class="img-fluid px-3 px-sm-4 mt-3 mb-4"
                  alt="login"
                />
              </div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
                    <p class="mb-4">
                      We get it, stuff happens. Just enter your email address below and we'll send
                      you a link to reset your password!
                    </p>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control form-control-user"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="Enter Email Address..."
                        v-model="email"
                      />
                    </div>
                    <button
                      @click.prevent="onPasswordResetClicked"
                      class="btn btn-primary btn-user btn-block"
                    >
                      Reset Password
                    </button>
                  </form>
                  <hr />
                  <div class="text-center">
                    <RouterLink to="/register" class="small">Create an Account!</RouterLink>
                  </div>
                  <div class="text-center">
                    <RouterLink to="/login" class="small"
                      >Already have an account? Login!</RouterLink
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const $router = useRouter()

const email = ref('')

const onPasswordResetClicked = async () => {
  if (!email.value) {
    return alert('Please enter your email address')
  }

  const success = await userStore.requestChangePasswordEmail(email.value)

  if (success) {
    $router.push('/login')
  }
}
</script>

<style scoped></style>
