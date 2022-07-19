import request from '@service/_requests'
import PageParams = API.PageParams
import UserParams = API.UserParams

// eslint-disable-next-line import/prefer-default-export
export const listUserByPageApi = (params: UserParams & PageParams): Promise<API.Response> => {
  return request('/user/getUserByParam', {
    method: 'GET',
    params
  })
}
