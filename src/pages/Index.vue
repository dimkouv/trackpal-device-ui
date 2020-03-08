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

      <div class="device-form q-mt-lg text-center">
        <div class="q-mt-lg">
          <strong>
            <q-icon name="las la-satellite" />
            {{ positionMsg }}
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
                {{ new Date(position.timestamp).toLocaleString() }}
              </span><br>
            </div>
          </div>
        </div>
      </div>

      <div class="device-form justify-center q-mt-lg text-center">
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

      <div class="device-form justify-center q-mt-lg text-center">
        <div class="q-mt-lg">
          <q-btn size="sm" outline @click="switchDevice()" label="Switch device" icon="las la-satellite-dish" class="q-mr-md" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import DevicePicker from 'components/DevicePicker'

export default {
  components: {
    DevicePicker
  },

  name: 'PageIndex',

  data () {
    return {
      position: null,
      positionMsg: 'Determining location...',
      selectedDevice: null
    }
  },

  methods: {
    showPosition (position) {
      this.position = {
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        timestamp: position.timestamp
      }

      this.positionMsg = 'Location details'
    },
    errorPosition (err) {
      this.positionMsg = `${err.message} (code=${err.code})`
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
    this.checkSelectedDevice()
    this.$root.$on('selectedDevice', this.checkSelectedDevice)

    setTimeout(() => {
      this.getCurrentPosition()
    }, 5000)
  }
}
</script>

<style lang="sass">
.device-form
  border-top: 1px solid $grey-3
</style>
