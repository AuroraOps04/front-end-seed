import request from '@service/_requests'
import AreaQuery = API.AreaQuery
import PageParams = API.PageParams
import AreaQueryParams = API.AreaQueryParams

export const removeAreaBatchByIdsApi = (params: number[]): Promise<API.Response> => {
  return request('/area/removeAreaBatchByIds', {
    method: 'DELETE',
    params: {
      ids: params
    }
  })
}

export const removeAreaByIdApi = (areaId: number): Promise<API.Response> => {
  return request(`/area/deleteById/${areaId}`, {
    method: 'DELETE'
  })
}

export const addAreaApi = (areaName: string): Promise<API.Response> => {
  return request(`/area/addAreaByName/${areaName}`, {
    method: 'GET'
  })
}

export const editAreaByNameApi = (areaId: number, areaName: string): Promise<API.Response> => {
  return request(`/area/editAreaByName/${areaName}`, {
    method: 'POST'
  })
}

export const listAreaByPageApi = (params: AreaQueryParams & PageParams): Promise<API.Response> => {
  return request('/area/getAreaByParam', {
    method: 'GET',
    params
  })
}
