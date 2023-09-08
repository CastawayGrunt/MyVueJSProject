<template>
  <div class="container">
    <!-- Outer Row -->
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-12 col-md-9">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row">
              <div class="col-lg-6 d-none d-lg-block bg-login my-auto">
                <img
                  src="@/assets/img/undraw_secure_login_pdn4.svg"
                  class="img-fluid px-3 px-sm-4 mt-3 mb-4"
                  alt="login"
                />
              </div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
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
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Password"
                        v-model="password"
                      />
                    </div>
                    <div class="form-group">
                      <div class="custom-control custom-checkbox small">
                        <input type="checkbox" class="custom-control-input" id="customCheck" />
                        <label class="custom-control-label" for="customCheck">Remember Me</label>
                      </div>
                    </div>
                    <button
                      class="btn btn-primary btn-user btn-block"
                      type="submit"
                      @click.prevent="onLoginClicked()"
                    >
                      Login
                    </button>
                  </form>
                  <hr />
                  <div class="text-center">
                    <a class="small" href="forgot-password.html">Forgot Password?</a>
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

<script lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'LoginView',
  data() {
    return {
      email: 'brendon.woodall+02@gmail.com',
      password: '123456'
    }
  },
  components: {
    RouterLink
  },
  methods: {
    async onLoginClicked() {
      const credentials = {
        email: `${this.email}`,
        password: `${this.password}`
      }
      const success = await this.userStore.login(credentials)
      if (success) {
        this.$router.push('/dashboard')
      }
    }
  },
  setup() {
    const userStore = useUserStore()
    return { userStore }
  }
}
</script>

<style scoped></style>
