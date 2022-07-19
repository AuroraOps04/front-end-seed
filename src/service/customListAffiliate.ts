import request from './_requests'

export const findAllCustomListAffiliateApi = (
  customParams: API.customListAffiliateParams
): Promise<API.Response> => {
  return request(`/customListAffiliate/findAllCustomListAffiliate`, {
    method: 'GET',
    params: customParams
  })
}

export const customListAffiliateByIdApi = (
  customListAffiliateId: number
): Promise<API.Response> => {
  return request(`/customListAffiliate/deleteCustomListAffiliateById/${customListAffiliateId}`, {
    method: 'DELETE'
  })
}

export const insertIntoCustomListApi = (
  params: number[],
  customListId: number | undefined
): Promise<API.Response> => {
  return request('/customListAffiliate/insertIntoCustomList', {
    method: 'POST',
    params: {
      ids: params,
      customListId
    }
  })
}

export const selectAllAccountIdByCustomListIdApi = (
  customListId: number | undefined
): Promise<API.Response> => {
  return request(`/customListAffiliate/selectAllAccountIdByCustomListId/${customListId}`, {
    method: 'GET'
  })
}
