<template>
  <q-layout view="lHh Lpr lFf" v-if="isAuthenticated">
    <q-header class="shadow-1">
      <q-toolbar class="bg-white">
        <q-btn
          flat
          dense
          round
          icon="las la-bars"
          class="clr-tp-teal"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="q-mt-sm clr-tp-teal">device platform</q-toolbar-title>
        <div class="q-mr-lg q-mt-sm"><img src="statics/trackpal-logo.png" width="200px"></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list class="text-teal-9">
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-item clickable @click.native="logout()">
          <q-item-section avatar>
            <q-icon name="las la-sign-out-alt" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>
              Leave the app
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-layout view="lHh Lpr lFf" v-else>
    <authentication />
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
import Authentication from 'pages/Authentication'
import api from '../api/v1'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink,
    Authentication
  },

  data () {
    return {
      leftDrawerOpen: false,
      isAuthenticated: false,
      tokenRefresher: null,
      essentialLinks: [
        {
          title: 'Trackpal',
          caption: 'Tracking platform',
          icon: 'las la-globe-europe',
          link: '/'
        }
      ]
    }
  },

  methods: {
    checkAuthentication () {
      this.isAuthenticated = localStorage.getItem('jwtToken') !== null

      if (this.isAuthenticated) {
        if (this.tokenRefresher === null) {
          this.refreshToken()
          this.tokenRefresher = setInterval(() => { this.refreshToken() }, 1000 * 60 * 2)
        }
        this.$root.$on('loggedOut', () => { clearInterval(this.tokenRefresher) })
      }
    },
    logout () {
      localStorage.removeItem('jwtToken')
      this.$root.$emit('loggedOut')
      this.checkAuthentication()
    },
    refreshToken () {
      api.refreshToken()
        .then((jwtToken) => {
          localStorage.setItem('jwtToken', jwtToken)
        })
        .catch((err) => {
          let msg = ''

          if (err.status === 400 && err.error === 'TOKEN_EXPIRED') {
            msg = 'Your authentication token has expired, please login again'
          } else if (err.status === 400) {
            msg = 'Invalid request'
          } else if (err.status === 401) {
            msg = 'Your token has expired'
            this.logout()
          } else {
            msg = 'Something bad happened with authentication'
          }

          this.$q.notify({
            message: 'Authentication failure',
            caption: msg,
            color: 'negative',
            position: 'top',
            timeout: 5000
          })
        })
    }
  },

  mounted () {
    this.checkAuthentication()
    this.$root.$on('loggedIn', () => {
      this.checkAuthentication()
    })
  }
}
</script>

<style lang="sass">
.q-toolbar
  min-height: 64px
</style>
