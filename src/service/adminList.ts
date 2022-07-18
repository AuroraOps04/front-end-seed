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

// 根据id删除管理员，降级为普通用户
export const removeAdminByIdApi = (areaId: number): Promise<API.Response> => {
  return request(`/area/deleteById/${areaId}`, {
    method: 'DELETE'
  })
}

// 批量删除管理员，降级为普通用户
export const removeAdminBatchByIdsApi = (params: number[]): Promise<API.Response> => {
  return request('/area/removeAreaBatchByIds', {
    method: 'DELETE',
    params: {
      ids: params
    }
  })
}

// 增加管理员
export const addAdminApi = (areaName: string): Promise<API.Response> => {
  return request(`/area/addAreaByName/${areaName}`, {
    method: 'GET'
  })
}

// 修改管理员信息
export const editAreaByNameApi = (params: AdminParams): Promise<API.Response> => {
  return request(`/area/editAreaByName`, {
    method: 'POST',
    params
  })
}
