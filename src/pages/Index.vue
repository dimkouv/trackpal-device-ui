<template>
  <q-page class="flex justify-center q-mt-lg" style>
    <device-picker v-if="!hasSelectedDevice()" />

    <div v-if="selectedDevice !== null">
      <div class="device-info">
        <div class="q-p-md">
          <span class="text-h4">{{ selectedDevice.name }}
            <q-btn size="sm" outline @click="switchDevice()" label="Switch" class="q-mr-md" />
          </span>
          <div>Created at: <span class="text-grey-7">{{ new Date(selectedDevice.created_at).toLocaleString() }}</span></div>
        </div>
      </div>

      <div class="device-form justify-center q-mt-lg text-center">
        <q-btn label="Enable alerting" color="teal" outline v-if="!selectedDevice.alertingEnabled" class="q-mt-md" @click="enableAlerting()" />
        <q-btn label="Disable alerting" color="teal" v-else class="q-mt-md" @click="disableAlerting()" />

        <div>
          GPS position: <strong>{{ positionMsg }}</strong>
        </div>

        <div>
          position debug: {{ JSON.stringify(position) }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import DevicePicker from 'components/DevicePicker'
import { Plugins } from '@capacitor/core'
const { Geolocation } = Plugins

export default {
  components: {
    DevicePicker
  },

  name: 'PageIndex',

  data () {
    return {
      position: null,
      positionMsg: 'determining...',
      selectedDevice: null
    }
  },

  methods: {
    getCurrentPosition () {
      Geolocation.getCurrentPosition()
        .then(position => {
          this.position = position
        })
        .catch((err) => {
          this.positionMsg = 'Error getting location: ' + JSON.stringify(err)
        })
    },

    enableAlerting () {
      this.selectedDevice.alertingEnabled = true
      alert('tbd')
    },

    disableAlerting () {
      alert('tbd')
    },

    switchDevice () {
      localStorage.removeItem('selectedDevice')
      this.checkSelectedDevice()
    },

    checkSelectedDevice () {
      this.selectedDevice = (localStorage.getItem('selectedDevice') !== null) ? JSON.parse(localStorage.getItem('selectedDevice')) : null
    },

    hasSelectedDevice () {
      return this.selectedDevice !== null
    }
  },

  mounted () {
    const self = this
    this.checkSelectedDevice()
    this.$root.$on('selectedDevice', this.checkSelectedDevice)

    setInterval(() => {
      self.getCurrentPosition()
    }, 2000)
  },

  beforeDestroy () {
    Geolocation.clearWatch(this.geoId)
  }
}
</script>

<style lang="sass">
.device-form
  border-top: 1px solid $grey-3
</style>
