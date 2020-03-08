<template>
  <div class="device-selector">
    <div v-if="mode === ''" class="text-center text-h5 text-teal-10">
      Is this a new or existing device?

      <div class="q-mt-md text-center">
        <q-btn outline label="existing" color="teal" icon="las la-ellipsis-v"  @click="mode='existing'" />
        <q-btn label="new" icon="las la-plus-square" color="teal" @click="mode='new'" class="text-white q-ml-sm" />
      </div>
    </div>

    <div v-if="mode === 'existing'">
      <q-btn flat label="back" icon="las la-chevron-left" @click="mode=''" />

      <div class="text-right" v-if="!loading.devices">
        {{ (devices.length > 0) ? '' : 'No devices exist to your account' }}
      </div>
      <div v-else class="text-right">
        <q-spinner-radio />
      </div>

      <div class="device-list q-mt-md">
        <div v-for="device in devices" :key="device.id" class="device q-px-md q-mt-lg" @click="selectDevice(device)">
          <div class="device-info">
            <div class="q-p-md">
              <span class="text-h4 text-teal-10">
                <q-icon name="las la-satellite-dish" />
                {{ device.name }}
              </span>
              <div class="text-center">Created at: <span class="text-grey-7">{{ new Date(device.created_at).toLocaleString() }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mode === 'new'">
      <q-btn flat label="back" icon="las la-chevron-left" @click="mode=''" />
    </div>
  </div>
</template>

<script>
import api from '../api/v1'

export default {
  name: 'DevicePicker',

  data: function () {
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
      this.devices = []
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
      this.msg = '1234'
      localStorage.setItem('selectedDevice', JSON.stringify(device))
      this.$root.$emit('selectedDevice')
    }
  }
}
</script>

<style lang="sass">
.device-list
  min-width: 300px

.device
  padding: 16px
  border-radius: 16px
  border-bottom: 1px solid $grey-3
  &:hover
    background-color: $grey-2
    cursor: pointer
</style>
