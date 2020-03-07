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
  }
}
