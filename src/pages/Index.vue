<template>
  <q-page class="flex justify-center q-mt-lg" style>
    <device-picker v-if="!hasSelectedDevice()" />

    <div class="device-form" v-if="selectedDevice !== null">
      <div class="device-info">
        <div>
          <span class="text-h4">{{ selectedDevice.name }}
            <q-btn size="sm" outline @click="switchDevice()" label="Switch" class="q-mr-md" />
          </span>
          <div>Created at: <span class="text-grey-7">{{ new Date(selectedDevice.created_at).toLocaleString() }}</span></div>
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
      selectedDevice: null
    }
  },

  methods: {
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
  }
}
</script>
