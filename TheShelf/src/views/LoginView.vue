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
                  src="@/assets/img/undraw_secure_login_pdn4.svg"
                  class="img-fluid px-3 px-sm-4 mt-3 mb-4"
                  alt="login"
                />
              </div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">
                      Welcome Back to <span class="d-block">The Shelf!</span>
                    </h1>
                  </div>
                  <form @submit="onSubmit">
                    <div class="field">
                      <span class="p-float-label">
                        <InputText
                          id="email"
                          v-bind="email"
                          type="text"
                          :class="{ 'p-invalid': errors.email }"
                          class="w-100"
                          aria-describedby="text-error"
                        />
                        <label for="email">Email</label>
                      </span>
                      <small v-if="errors.email" class="p-error" id="text-error">{{
                        errors.email || '&nbsp;'
                      }}</small>
                    </div>
                    <div class="field w-100">
                      <span class="p-float-label mt-4 w-100">
                        <Password
                          id="password"
                          v-bind="password"
                          type="text"
                          :class="{ 'p-invalid': errors.password }"
                          class="w-100"
                          toggleMask
                          aria-describedby="text-error"
                          style="width: 100%"
                        />
                        <label for="password">Password</label>
                      </span>
                      <small v-if="errors.password" class="p-error" id="text-error">{{
                        errors.password || '&nbsp;'
                      }}</small>
                    </div>
                    <button class="btn btn-primary btn-user btn-block mt-3" type="submit">
                      Login
                    </button>
                  </form>
                  <hr />
                  <div class="text-center">
                    <RouterLink to="/forgotpassword" class="small">Forgot Password?</RouterLink>
                  </div>
                  <div class="text-center">
                    <RouterLink to="/register" class="small">Create an Account!</RouterLink>
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
import { useUserStore } from '@/stores/user'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const userStore = useUserStore()
const $router = useRouter()

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6)
})

const { defineComponentBinds, handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema
})

// const email = ref('brendon.woodall@gmail.com')
// const password = ref('123456')
const email = defineComponentBinds('email')
const password = defineComponentBinds('password')

const onSubmit = handleSubmit(async (values) => {
  const credentials = {
    email: `${values.email}`,
    password: `${values.password}`
  }
  const success = await userStore.login(credentials)
  if (success) {
    resetForm()
    $router.push('/dashboard')
  }
})
</script>

<style scoped>
.p-error {
  display: block;
}
</style>
