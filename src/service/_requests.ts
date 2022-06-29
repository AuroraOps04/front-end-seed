
import Axios, {AxiosRequestConfig, AxiosResponse} from "axios"
// @ts-ignore
import nProgress from "nProgress"

const _instance = Axios.create({
  baseURL: '/api'
})

_instance.interceptors.request.use(config => {
  nProgress.start()
  return config
}, err => {
})

_instance.interceptors.response.use((res: AxiosResponse<API.Response>) => {
  nProgress.done()
  const response = res.data

  return res.data
}, err => {
  nProgress.done()
});

const request = (url: string, params: {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT',
  params?: any,
  config?: AxiosRequestConfig,
  data?: any,
}): Promise<API.Response> => {
  switch (params.method) {
    case undefined:
    case 'GET':
      return _instance.get(url, {
        params: params.params,
        ...params.config
      })
    case 'POST':

      return _instance.post(url, params.data, {
        params: params.params,
        ...params.config
      });
    case 'DELETE':
      return _instance.delete(url, {
        params,
        ...params.config
      });
    case 'PUT':
      return _instance.put(url, params.data, {
        params,
        ...params.config
      });
  }
}

export default request
