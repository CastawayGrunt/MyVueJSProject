<template>
  <div class="container h-100">
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
          <div class="col-lg-7">
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
              </div>
              <form class="user">
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input
                      type="text"
                      class="form-control form-control-user"
                      id="exampleFirstName"
                      placeholder="First Name"
                      v-model="firstName"
                    />
                  </div>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      class="form-control form-control-user"
                      id="exampleLastName"
                      placeholder="Last Name"
                      v-model="lastName"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <input
                    type="email"
                    class="form-control form-control-user"
                    id="exampleInputEmail"
                    placeholder="Email Address"
                    v-model="email"
                  />
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input
                      type="password"
                      class="form-control form-control-user"
                      id="exampleInputPassword"
                      placeholder="Password"
                      v-model="password"
                    />
                  </div>
                  <div class="col-sm-6">
                    <input
                      type="password"
                      class="form-control form-control-user"
                      id="exampleRepeatPassword"
                      placeholder="Repeat Password"
                    />
                  </div>
                </div>
                <button
                  class="btn btn-primary btn-user btn-block"
                  @click.prevent="registerUserClicked()"
                  type="submit"
                >
                  Register Account
                </button>
                <hr />
              </form>
              <div class="text-center">
                <RouterLink to="/forgot-password" class="small">Forgot Password?</RouterLink>
              </div>
              <div class="text-center">
                <RouterLink class="small" to="/login">Already have an account? Login!</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  },
  components: {
    RouterLink
  },
  methods: {
    async registerUserClicked() {
      const user = {
        id: '',
        email: this.email,
        displayName: `${this.firstName} ${this.lastName}`
      }
      const credentials = {
        email: this.email,
        password: this.password
      }
      await this.userStore.register({ ...credentials }, user)
      this.$router.push({ name: 'dashboard' })
    }
  },
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  }
}
</script>

<style scoped></style>
