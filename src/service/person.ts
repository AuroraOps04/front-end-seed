import request from '@service/_requests'

export const updatePhoneApi = (phone: string) => {
  return request("/user/updatePhone/" + phone)
}

export const updateUsernameApi = (username: string) => {
  return request("/user/updateUsername/" + username)
}


