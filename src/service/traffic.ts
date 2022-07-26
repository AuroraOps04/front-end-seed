import request from '@service/_requests'

export const insertTrafficCountAPI = (visitorId: string): Promise<API.Response> => {
  return request(`/traffic/insert/${visitorId}`, {
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
