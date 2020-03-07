<template>
  <q-layout view="lHh Lpr lFf" v-if="isAuthenticated">
    <q-header elevated>
      <q-toolbar class="bg-light-green-6">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Trackpal
        </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
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
            <q-icon name="arrow_back" />
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
          title: 'Register',
          caption: 'Create an account',
          icon: 'account_circle',
          link: '/'
        },
        {
          title: 'Trackpal',
          caption: 'Trackpal platform',
          icon: 'apps',
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
