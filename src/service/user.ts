import request from '@service/_requests'

export const loginApi = (data: API.LoginRequest) => {
  return request('/user/login', {
    method: 'POST',
    data
  })
}

export const adminLoginApi = (data: API.LoginRequest) => {
  return request('/user/adminlogin', {
    method: 'POST',
    data
  })
}

export const getSmsApi = (phone: string) => {
  return request('/user/sms', {
    params: { phone }
  })
}

export const getCurrentApi = () => {
  return request('/user/current')
}
