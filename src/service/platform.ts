import request from '@service/_requests'

// eslint-disable-next-line import/prefer-default-export
export const getAllPlatformApi = () => {
  return request('/platform/findAllPlatForm', {
    method: 'GET'
  })
}
