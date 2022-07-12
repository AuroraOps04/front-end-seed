import request from '@service/_requests'

export const insertTrafficCount = () => {
  return request('/traffic/insert', {
    method: 'POST'
  })
}

export const getTrafficCountApi = () => {
  return request('/traffic/getCount', {
    method: 'GET'
  })
}

export const getMonthTrafficAPI = () => {
  return request('/traffic/getMonthTraffic', {
    method: 'GET'
  })
}
