<template>
  <div class="container h-100">
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-12 col-md-9">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row">
              <div class="col-lg-6 d-none d-lg-block my-auto">
                <img
                  src="@/assets/img/undraw_access_account.svg"
                  class="img-fluid px-3 px-sm-4 mt-3 mb-4"
                  alt="login"
                />
              </div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
                  </div>
                  <form @submit="onSubmit">
                    <div class="p-fluid formgrid grid">
                      <div class="field col-12 col-md-6">
                        <span class="p-float-label">
                          <InputText
                            id="firstName"
                            v-bind="firstName"
                            type="text"
                            :class="{ 'p-invalid': errors.firstName }"
                            aria-describedby="text-error"
                          />
                          <label for="firstName">First Name</label>
                        </span>
                        <small v-if="errors.firstName" class="p-error" id="text-error">{{
                          errors.firstName || '&nbsp;'
                        }}</small>
                      </div>
                      <div class="field col-12 col-md-6">
                        <span class="p-float-label">
                          <InputText
                            id="lastName"
                            v-bind="lastName"
                            type="text"
                            :class="{ 'p-invalid': errors.lastName }"
                            aria-describedby="text-error"
                          />
                          <label for="lastName">Last Name</label>
                        </span>
                        <small v-if="errors.lastName" class="p-error" id="text-error">{{
                          errors.lastName || '&nbsp;'
                        }}</small>
                      </div>

                      <div class="field col-12">
                        <span class="p-float-label mt-2">
                          <InputText
                            id="email"
                            v-bind="email"
                            type="text"
                            :class="{ 'p-invalid': errors.email }"
                            aria-describedby="text-error"
                          />
                          <label for="email">Email</label>
                        </span>
                        <small v-if="errors.email" class="p-error" id="text-error">{{
                          errors.email || '&nbsp;'
                        }}</small>
                      </div>
                      <div class="field col-12 col-md-6">
                        <span class="p-float-label mt-2">
                          <Password
                            id="password"
                            v-bind="password"
                            type="text"
                            :class="{ 'p-invalid': errors.password }"
                            toggleMask
                            aria-describedby="text-error"
                            input-id="password"
                          />
                          <label for="password">Password</label>
                        </span>
                        <small v-if="errors.password" class="p-error" id="text-error">{{
                          errors.password || '&nbsp;'
                        }}</small>
                      </div>
                      <div class="field col-12 col-md-6">
                        <span class="p-float-label mt-2">
                          <Password
                            id="passwordCheck"
                            v-bind="passwordCheck"
                            type="text"
                            :class="{ 'p-invalid': errors.passwordCheck }"
                            toggleMask
                            aria-describedby="text-error"
                            input-id="passwordCheck"
                          />
                          <label for="passwordCheck">Repeat Password</label>
                        </span>
                        <small v-if="errors.passwordCheck" class="p-error" id="text-error">{{
                          errors.passwordCheck || '&nbsp;'
                        }}</small>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-user btn-block" type="submit">
                      Register Account
                    </button>
                    <hr />
                  </form>
                  <div class="text-center">
                    <RouterLink to="/forgotpassword" class="small">Forgot Password?</RouterLink>
                  </div>
                  <div class="text-center">
                    <RouterLink class="small" to="/login"
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

import { useUserStore } from '@/stores/user'
import type { FireUser } from '@/services/fireUserData'
import { placeholderImg } from '@/helpers/placeHolders'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const userStore = useUserStore()
const $router = useRouter()

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required('A Password is Required').min(6),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref('password')], 'Does not match password')
    .required('A Password is Required')
})

const { defineComponentBinds, handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema
})

const firstName = defineComponentBinds('firstName')
const lastName = defineComponentBinds('lastName')
const email = defineComponentBinds('email')
const password = defineComponentBinds('password')
const passwordCheck = defineComponentBinds('passwordCheck')

const onSubmit = handleSubmit(async (values) => {
  const user: FireUser = {
    id: '',
    email: `${values.email}`,
    photoURL: placeholderImg,
    displayName: `${values.firstName} ${values.lastName}`,
    games: [],
    plays: [],
    lastPlayed: '',
    mostPlayed: ''
  }
  const credentials = {
    email: values.email,
    password: values.password
  }
  await userStore.register({ ...credentials }, user)
  resetForm()
  $router.push({ name: 'dashboard' })
})
</script>

<style scoped></style>
