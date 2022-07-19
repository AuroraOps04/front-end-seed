import request from '@service/_requests'
import PageParams = API.PageParams
import AreaQueryParams = API.AreaQueryParams
import CategoryQueryParams = API.CategoryQueryParams
import CategoryParams = API.CategoryParams
import AreaParams = API.AreaParams

// 地区管理接口
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

export const editAreaByNameApi = (params: AreaParams): Promise<API.Response> => {
  return request(`/area/editAreaByName`, {
    method: 'POST',
    params
  })
}

export const listAreaByPageApi = (params: AreaQueryParams & PageParams): Promise<API.Response> => {
  return request('/area/getAreaByParam', {
    method: 'GET',
    params
  })
}

// 分类管理接口

export const removeCategoryBatchByIdsApi = (params: number[]): Promise<API.Response> => {
  return request('/category/removeCategoryBatchByIds', {
    method: 'DELETE',
    params: {
      ids: params
    }
  })
}

export const removeCategoryByIdApi = (categoryId: number): Promise<API.Response> => {
  return request(`/category/deleteById/${categoryId}`, {
    method: 'DELETE'
  })
}

export const addCategoryApi = (categoryName: string): Promise<API.Response> => {
  return request(`/category/addCategoryByName/${categoryName}`, {
    method: 'GET'
  })
}

export const editCategoryByNameApi = (params: CategoryParams): Promise<API.Response> => {
  return request(`/category/editCategoryByName`, {
    method: 'POST',
    params
  })
}

export const listCategoryByPageApi = (
  params: CategoryQueryParams & PageParams
): Promise<API.Response> => {
  return request('/category/getCategoryByParam', {
    method: 'GET',
    params
  })
}
