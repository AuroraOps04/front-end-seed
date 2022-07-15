import request from './_requests'
import CustomListFormData = API.CustomListFormData
import CustomListAddOrUpdate = API.CustomListAddOrUpdate

export const selectAllCustomListApi = (params: CustomListFormData): Promise<API.Response> => {
  return request('/customList/selectThisUserCustomList', {
    method: 'GET',
    params
  })
}

export const deleteCustomsApi = (param: number[]): Promise<API.Response> => {
  return request('/customList/deleteCustoms', {
    method: 'GET',
    params: {
      customIds: param
    }
  })
}

export const insertOrUpdateCustomsApi = (params: CustomListAddOrUpdate): Promise<API.Response> => {
  return request('/customList/insertOrUpdateCustoms', {
    method: 'POST',
    params
  })
}
