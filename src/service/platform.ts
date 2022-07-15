import request from '@service/_requests'

export const getAllPlatformApi = () => {
  return request('/platform/findAllPlatForm', {
    method: 'GET'
  })
}
