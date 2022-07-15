import request from '@service/_requests'

export const loginApi = (data: API.LoginRequest) => {
  return request('/user/login', {
    method: 'POST',
    data
  })
}

export const registerApi = (data: API.RegisterRequest) => {
  return request('/user/register', {
    method: 'POST',
    data
  })
}

export const updateUserInfoApi = (data: API.UserInfoRequest) => {
  return request('/user/updateUserInfo', {
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

export const getUserCountApi = () => {
  return request('/user/getUserCount', {
    method: 'GET'
  })
}

export const getCategoryAllApi = () => {
  return request('/category/getAll', {
    method: 'GET'
  })
}
