import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import nProgress from 'nprogress'

const instance = Axios.create({
  baseURL: '/api'
})

instance.interceptors.request.use(
  (config) => {
    nProgress.start()
    return config
  },
  () => {}
)

instance.interceptors.response.use(
  (res: AxiosResponse<API.Response>) => {
    nProgress.done()
    const response = res.data

    return response.data
  },
  () => {
    nProgress.done()
  }
)

const request = (
  url: string,
  params: {
    method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
    params?: any
    config?: AxiosRequestConfig
    data?: any
  }
): Promise<API.Response> => {
  switch (params.method) {
    case undefined:
    case 'GET':
      return instance.get(url, {
        params: params.params,
        ...params.config
      })
    case 'POST':
      return instance.post(url, params.data, {
        params: params.params,
        ...params.config
      })
    case 'DELETE':
      return instance.delete(url, {
        params: params.params,
        ...params.config
      })
    case 'PUT':
      return instance.put(url, params.data, {
        params: params.params,
        ...params.config
      })
    default:
      return instance.get(url, {
        params: params.params,
        ...params.config
      })
  }
}

export default request
