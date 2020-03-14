<template>
  <q-page-container>
    <q-page class="flex justify-center q-mt-xl">
      <div class="form-container">
        <div class="login-form q-pa-lg rounded-borders" style="min-width: 400px">
          <q-img src="~assets/trackpal-logo.svg" />
          <p class="text-h5 text-right clr-tp-pale">
            device platform
          </p>

          <div>
            <form>
              <q-input color="teal" autocomplete outlined v-model="loginForm.email" name="email" label="Email" @keyup.enter="login()" />

              <q-input color="teal" autocomplete name="password" class="q-mt-sm" outlined v-model="loginForm.password" :type="pwdHidden ? 'password' : 'text'" @keyup.enter="login()" label="Password">
                <template v-slot:append>
                  <q-icon
                    :name="pwdHidden ? 'las la-eye' : 'las la-eye-slash'"
                    class="cursor-pointer"
                    @click="pwdHidden = !pwdHidden"
                  />
                </template>
              </q-input>
            </form>
          </div>

          <div class="submit-btn text-right q-mt-md">
            <q-btn class="bg-white clr-tp-pale" label="Register" />
            <q-btn class="bg-tp-pale text-white q-ml-sm" label="Login" icon="las la-user" @click="login" v-show="!loading" />
            <q-btn v-show="loading" disabled><q-spinner-radio /></q-btn>
          </div>

        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import api from '../api/v1'

export default {
  name: 'Authentication',

  data () {
    return {
      pwdHidden: true,
      loading: false,
      loginForm: {
        email: '',
        password: ''
      }
    }
  },

  methods: {
    login () {
      this.loading = true
      api.login(this.loginForm.email, this.loginForm.password)
        .then((jwtToken) => {
          localStorage.setItem('jwtToken', jwtToken)
          this.$root.$emit('loggedIn')
        })
        .catch((err) => {
          let msg = ''

          if (err.status === 400 && err.error === 'NOT_ACTIVATED') {
            msg = 'Your account is not activated'
          } else if (err.status === 400) {
            msg = 'Invalid request'
          } else if (err.status === 404) {
            msg = 'Invalid credentials'
          } else {
            msg = 'Something bad happened'
          }

          this.$q.notify({
            message: 'Login failed',
            caption: msg,
            color: 'negative',
            position: 'top',
            timeout: 2500
          })
        })
        .then(() => {
          setTimeout(() => { this.loading = false }, 500)
        })
    }
  }
}
</script>

<style lang="sass" scoped>
body
  overflow: hidden
</style>
