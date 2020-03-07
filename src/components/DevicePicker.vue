<template>
  <div class="device-selector">

    <div v-if="mode === ''">
      Is this a new or existing device?

      <div class="q-mt-md text-center">
        <q-btn label="existing" @click="mode='existing'" />
        <q-btn label="new" @click="mode='new'" class="bg-lime-1 q-ml-sm" />
      </div>
    </div>

    <div v-if="mode === 'existing'">
      <q-btn flat label="back" icon="keyboard_arrow_left" @click="mode=''" />

      <div class="text-right" v-if="!loading.devices">
        {{ (devices.length > 0) ? 'Select a device from the list' : 'No devices exist to your account' }}
      </div>

      <div class="device-list q-mt-md">
        <div v-for="device in devices" :key="device.id" class="q-px-lg" @click="selectDevice(device)">
          <div class="device q-py-md">
            <div class="text-h5">{{ device.name }}</div>
            <div>Created at: <span class="text-grey-7">{{ new Date(device.created_at).toLocaleString() }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mode === 'new'">
      <q-btn flat label="back" @click="mode=''" />
    </div>
  </div>
</template>

<script>
import api from '../api/v1'

export default {
  name: 'DevicePicker',

  data () {
    return {
      mode: '',
      loading: {
        devices: false
      },
      devices: []
    }
  },

  watch: {
    mode: function (val) {
      if (val === 'existing') {
        this.getDevices()
      }
    }
  },

  methods: {
    getDevices () {
      const self = this
      this.loading.devices = true
      api.getDevices()
        .then(devices => {
          this.devices = devices
          this.loading.devices = false
        })
        .catch(() => {
          this.$q.notify({
            message: 'Failed to fetch devices',
            color: 'negative',
            position: 'top',
            timeout: 5000
          })
          self.loading.devices = false
        })
    },

    selectDevice (device) {
      localStorage.setItem('selectedDevice', JSON.stringify(device))
      this.$root.$emit('selectedDevice')
    }
  }
}
</script>

<style lang="sass">
.device-list
  border: 1px solid $grey-5
  min-width: 300px

.device
  padding: 10px
  border-radius: 3px
  border-bottom: 1px solid $grey-3
  &:hover
    background-color: $grey-2
    cursor: pointer
</style>
