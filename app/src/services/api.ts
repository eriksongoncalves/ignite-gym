import axios, { AxiosInstance } from 'axios'

import { AppError } from '@utils/AppError'
import { storageUserData, storageUserSave } from '@storage/storageUser'

type RegisterInterceptTokenManagerProps = {
  signOut: () => void
  refreshTokenUpdated: (newToken: string) => void
}

type ApiInstanceProps = AxiosInstance & {
  // eslint-disable-next-line no-empty-pattern
  registerInterceptTokenManager: ({}: RegisterInterceptTokenManagerProps) => () => void
}

type PromiseType = {
  resolve: (value?: unknown) => void
  reject: (reason: unknown) => void
}

type ProccessQueueParams = {
  error: Error | null
  token: string | null
}

const api = axios.create({
  baseURL: 'http://192.168.0.16:3333'
}) as ApiInstanceProps

let isRefreshing = false
let failedQueue: Array<PromiseType> = []

const proccessQueue = ({ error, token = null }: ProccessQueueParams): void => {
  failedQueue.forEach(request => {
    if (error) {
      request.reject(error)
    } else {
      request.resolve(token)
    }
  })

  failedQueue = []
}

api.registerInterceptTokenManager = ({ signOut, refreshTokenUpdated }) => {
  const interceptTokenManager = api.interceptors.response.use(
    response => response,
    async requestError => {
      if (requestError.response?.status === 401) {
        if (
          requestError.response.data?.message === 'token.expired' ||
          requestError.response.data?.message === 'token.invalid'
        ) {
          const storageData = await storageUserData()

          if (!storageData) {
            signOut()
            return Promise.reject(requestError)
          }

          const originalRequest = requestError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                return axios(originalRequest)
              })
              .catch(error => {
                throw error
              })
          }

          isRefreshing = true

          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/sessions/refresh-token', {
                token: storageData.token
              })

              await storageUserSave({
                ...storageData,
                token: data.token
              })

              api.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${data.token}`

              originalRequest.headers['Authorization'] = `Bearer ${data.token}`

              refreshTokenUpdated(data.token)
              proccessQueue({ error: null, token: data.token })

              // eslint-disable-next-line no-console
              console.log('TOKEN ATUALIZADO')
              resolve(originalRequest)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              proccessQueue({ error, token: null })
              signOut()
              reject(error)
            } finally {
              isRefreshing = false
            }
          })
        }

        signOut()
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message))
      }

      return Promise.reject(requestError)
    }
  )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
