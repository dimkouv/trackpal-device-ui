<template>
  <q-page class="flex justify-center q-mt-xl" style>
    <device-picker v-if="!hasSelectedDevice()" />

    <div v-if="selectedDevice !== null">
      <div class="device-info">
        <div class="q-p-md">
          <span class="text-h4 text-teal-10">
            <q-icon name="las la-satellite-dish" />
            {{ selectedDevice.name }}
          </span>
          <div class="text-center">Created at: <span class="text-grey-7">{{ new Date(selectedDevice.created_at).toLocaleString() }}</span></div>
        </div>
      </div>

      <!-- location details -->
      <div class="q-mt-xl">
        <div class="q-mt-lg">
          <strong>
            <div style="max-width: 256px">
              <q-icon name="las la-satellite" />
              {{ positionMsg }}
            </div>
          </strong>

          <div v-if="position !== null && position.hasOwnProperty('location')" class="q-mt-md">
            <div class="text-left">
              Latitude:
              <span class="text-grey-7">
                {{ position.location.lat.toFixed(4) }}
              </span><br>

              Longitude:
              <span class="text-grey-7">
                {{ position.location.lng.toFixed(4) }}
              </span><br>

              Timestamp:
              <span class="text-grey-7">
                {{ new Date(position.recorded_at).toLocaleString() }}
              </span><br>
            </div>
          </div>
        </div>
      </div>

      <!-- tracking -->
      <div class="device-form justify-center q-mt-lg">
        <div class="q-mt-lg">
          <strong>
            <q-icon name="las la-satellite-dish" />
            Tracking is {{ (trackingEnabled) ? 'enabled' : 'disabled' }}
          </strong>

          <div>
            <q-btn label="Enable tracking" color="teal" outline v-if="!trackingEnabled" class="q-mt-md" @click="enableTracking()" />
            <q-btn label="Disable tracking" color="teal" v-else class="q-mt-md" @click="disableTracking()" />
          </div>
        </div>
      </div>

      <!-- alerting -->
      <div class="device-form justify-center q-mt-lg">
        <div class="q-mt-lg">
          <strong>
            <q-icon name="las la-bell" />
            Alerting is {{ (selectedDevice.alertingEnabled) ? 'enabled' : 'disabled' }}
          </strong>

          <div>
            <q-btn label="Enable alerting" color="teal" outline v-if="!selectedDevice.alertingEnabled" class="q-mt-md" @click="enableAlerting()" />
            <q-btn label="Disable alerting" color="teal" v-else class="q-mt-md" @click="disableAlerting()" />
          </div>
        </div>
      </div>

      <!-- device switcher -->
      <div class="device-form justify-center q-mt-lg">
        <div class="q-mt-lg">
          <q-btn size="sm" outline @click="switchDevice()" label="Switch device" icon="las la-satellite-dish" class="q-mr-md" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import DevicePicker from 'components/DevicePicker'
import api from '../api/v1'

export default {
  components: {
    DevicePicker
  },

  name: 'PageIndex',

  data () {
    return {
      lastTrackedPosition: null,
      trackingEnabled: false,
      tracker: null,
      position: null,
      positionMsg: 'Determining location...',
      selectedDevice: null
    }
  },

  methods: {
    sendTrackInput () {
      if (this.position === null || this.position.location === null) {
        return
      }

      if (JSON.stringify(this.position.location) === this.lastTrackedPosition) {
        console.log('skipping since it is the same we sent previously')
        return
      }
      this.lastTrackedPosition = JSON.stringify(this.position.location)

      api.sendTrackInput(this.selectedDevice.id, this.position)
        .then((data) => {
          console.log('created')
        })
        .catch((err) => {
          this.$q.notify({
            message: `Failed to send coordinates: ${err.status} ${err.message}`,
            color: 'negative',
            position: 'top',
            timeout: 5000
          })
        })
    },

    enableTracking () {
      if (this.position === null || this.position.location === null) {
        this.$q.notify({
          message: 'The position should be determined first',
          color: 'warning',
          position: 'bottom',
          timeout: 5000
        })
        return
      }

      this.trackingEnabled = true
      if (this.tracker !== null) {
        clearInterval(this.tracker)
      }

      this.tracker = setInterval(this.sendTrackInput, 5000)
    },

    disableTracking () {
      this.trackingEnabled = false
      if (this.tracker !== null) {
        clearInterval(this.tracker)
      }
    },

    showPosition (position) {
      this.position = {
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        recorded_at: position.timestamp
      }

      this.positionMsg = 'Location details'
    },
    errorPosition (err) {
      console.log(`${err.message} (code=${err.code})`)
      this.positionMsg = 'Unable to determine location'
    },
    getCurrentPosition () {
      if (navigator.geolocation) {
        this.positionMsg = 'Trying to find location...'
        navigator.geolocation.getCurrentPosition(this.showPosition, this.errorPosition)
      } else {
        this.positionMsg = 'Geolocation is not available'
      }
    },

    enableAlerting () {
      if (this.position === null || this.position.location === null) {
        this.$q.notify({
          message: 'The position should be determined first',
          color: 'warning',
          position: 'bottom',
          timeout: 5000
        })
        return
      }

      api.enableAlerting(this.selectedDevice.id, this.position)
        .then((data) => {
          console.log('alerting enabled')
          this.$q.notify({
            message: 'Make sure to disable alerting when after deciding to move your device',
            color: 'info',
            position: 'top',
            timeout: 5000
          })
          this.selectedDevice.alertingEnabled = true
          localStorage.setItem('selectedDevice', JSON.stringify(this.selectedDevice))
        })
        .catch((err) => {
          console.log(`${err.status} ${err.message}`)
          this.$q.notify({
            message: 'Failed to enable alerting',
            color: 'negative',
            position: 'top',
            timeout: 5000
          })
        })
    },

    disableAlerting () {
      alert('tbd')
    },

    switchDevice () {
      this.disableTracking()
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
    this.checkSelectedDevice()
    this.$root.$on('selectedDevice', this.checkSelectedDevice)
    this.getCurrentPosition()

    setInterval(() => {
      this.getCurrentPosition()
    }, 10000)
  }
}
</script>

<style lang="sass">
.device-form
  border-top: 1px solid $grey-3
</style>
