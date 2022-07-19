import request from '@service/_requests'
import AdminQueryParams = API.AdminQueryParams
import PageParams = API.PageParams
import AdminParams = API.AdminParams

export const listAdminByPageApi = (
  params: AdminQueryParams & PageParams
): Promise<API.Response> => {
  return request('/user/getAdminByParam', {
    method: 'GET',
    params
  })
}

// 根据id删除管理员
export const removeAdminByIdApi = (userId: number): Promise<API.Response> => {
  return request(`/user/deleteById/${userId}`, {
    method: 'DELETE'
  })
}

// 批量删除管理员
export const removeAdminBatchByIdsApi = (params: number[]): Promise<API.Response> => {
  return request('/user/removeAdminBatchByIds', {
    method: 'DELETE',
    params: {
      ids: params
    }
  })
}

// 增加管理员
export const addAdminApi = (params: AdminParams): Promise<API.Response> => {
  return request(`/user/addAdmin`, {
    method: 'POST',
    params
  })
}

// 修改管理员信息
export const editAdminApi = (params: AdminParams): Promise<API.Response> => {
  return request(`/user/editAdmin`, {
    method: 'POST',
    params
  })
}
