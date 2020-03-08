import conf from '../shared/conf'
import axios from 'axios'

export default {
  login: async function (username, password) {
    return new Promise((resolve, reject) => {
      axios.post(`${conf.apiHost}/auth/login`, {
        email: username,
        password: password
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject({
            status: err.response.status,
            message: err.response.data.error
          })
        })
    })
  },
  refreshToken: async function () {
    return new Promise((resolve, reject) => {
      axios.post(`${conf.apiHost}/auth/refresh`, '', {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject({
            status: err.response.status,
            message: err.response.data.error
          })
        })
    })
  },
  getDevices: async function () {
    return new Promise((resolve, reject) => {
      axios.get(`${conf.apiHost}/tracking/devices`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject({
            status: err.response.status,
            message: err.response.data.error
          })
        })
    })
  },
  sendTrackInput: async function (deviceID, payload) {
    payload.recorded_at = new Date(payload.recorded_at).toISOString()
    return new Promise((resolve, reject) => {
      axios.post(`${conf.apiHost}/tracking/devices/${deviceID}/records`, payload, {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject({
            status: err.response.status,
            message: err.response.data.error
          })
        })
    })
  },
  enableAlerting: async function (deviceID, payload) {
    payload.recorded_at = new Date(payload.recorded_at).toISOString()
    return new Promise((resolve, reject) => {
      axios.post(`${conf.apiHost}/tracking/devices/${deviceID}/alerting/enable`, payload, {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject({
            status: err.response.status,
            message: err.response.data.error
          })
        })
    })
  },
  disableAlerting: async function (deviceID) {
    return new Promise((resolve, reject) => {
      axios.post(`${conf.apiHost}/tracking/devices/${deviceID}/alerting/disable`, '', {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject({
            status: err.response.status,
            message: err.response.data.error
          })
        })
    })
  },
  createDevice: async function (deviceName) {
    return new Promise((resolve, reject) => {
      axios.post(`${conf.apiHost}/tracking/devices`, {
        name: deviceName
      }, {
        headers: {
          Authorization: localStorage.getItem('jwtToken')
        }
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject({
            status: err.response.status,
            message: err.response.data.error
          })
        })
    })
  }
}
