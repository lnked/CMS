import axios from 'axios'

import { TOKEN } from '../token'
import { API_URL } from '../api'

const headers: any = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export const request: any = (options?: any = {}): any => {
  const noToken = Object.keys(options).length && options.hasOwnProperty('noToken') && options.noToken

  if (!noToken) {
    const authToken = TOKEN.get()

    if (authToken) {
      headers.Authorization = `Token ${authToken}`
    }
  }

  const config: any = {
    baseURL: API_URL,
    headers,
  }

  if (options) { }

  const instance = axios.create(config)

  return instance
}
