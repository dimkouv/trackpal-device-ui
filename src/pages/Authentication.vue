<template>
  <q-page-container>
    <q-page class="flex flex-center" style="margin-top: -10%">
        <div class="login-form q-pa-lg rounded-borders">
          <p class="text-light-green-6 text-h3 text-left">
            Trackpal Device
          </p>

          <p class="text-right">
            Login to access your tracking device
          </p>

          <div>
              <q-input outlined v-model="loginForm.email" label="Email" @keyup.enter="login()" />
              <q-input outlined v-model="loginForm.password" type="password" class="q-mt-sm" @keyup.enter="login()" label="Password" />
          </div>

          <div class="submit-btn text-right q-mt-sm">
            <q-btn outline color="light-blue-7" label="Register" />
            <q-btn color="light-green-7 q-ml-sm" label="Login" @click="login" />
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
      loginForm: {
        email: '',
        password: ''
      }
    }
  },

  methods: {
    login () {
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
    }
  }
}
</script>

<style lang="sass">
</style>
