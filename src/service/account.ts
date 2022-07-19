import request from './_requests'
import AccountParams = API.AccountParams
import PageParams = API.PageParams
import AccountQueryParams = API.AccountQueryParams

export const listAccountByPageApi = (params: AccountParams & PageParams): Promise<API.Response> => {
  return request('/account/findAccountSelectPage', {
    method: 'GET',
    params
  })
}

export const findAllCategoryApi = (): Promise<API.Response> => {
  return request('/category/findCategory', {
    method: 'GET'
  })
}

export const findAllPlatFormApi = (): Promise<API.Response> => {
  return request('/platform/findAllPlatForm', {
    method: 'GET'
  })
}

export const findAreaApi = (): Promise<API.Response> => {
  return request('/area/findArea', {
    method: 'GET'
  })
}

export const findAccountByAccountApi = (params: AccountQueryParams): Promise<API.Response> => {
  return request('/account/findAccountByAccount', {
    method: 'GET',
    params
  })
}

export const findRecordTotalApi = (AccountId: number): Promise<API.Response> => {
  return request(`/account/findRecordTotal/${AccountId}`, {
    method: 'GET'
  })
}

export const findRecordCharsDataApi = (params: AccountQueryParams): Promise<API.Response> => {
  return request('/account/findRecordCharsData', {
    method: 'GET',
    params
  })
}

export const removeAccountBatchByIdsApi = (params: number[]): Promise<API.Response> => {
  return request('/account/removeAccountBatchByIds', {
    method: 'DELETE',
    params: {
      ids: params
    }
  })
}

export const removeAccountByIdApi = (accountId: number): Promise<API.Response> => {
  return request(`/account/removeAccountById/${accountId}`, {
    method: 'DELETE'
  })
}

export const addAccountApi = (AccountFormData: API.AccountFormData): Promise<API.Response> => {
  return request(`/record/addAccountAndRecord`, {
    method: 'GET',
    params: AccountFormData
  })
}

export const getAccountCountApi = () => {
  return request('/account/getAccountCount', {
    method: 'GET'
  })
}

export const getMonthAccountAPI = () => {
  return request('/account/getMonthAccount', {
    method: 'GET'
  })
}

export const updateAccountIsViewApi = (params: number[], _state: number): Promise<API.Response> => {
  return request('/account/batchModificationOfKeyLists', {
    method: 'POST',
    params: {
      ids: params,
      state: _state
    }
  })
}

export const editRowAccountApi = (AccountData: API.AccountData): Promise<API.Response> => {
  return request(`/account/editRowAccount`, {
    method: 'POST',
    params: AccountData
  })
}

export const AccountCollectionApi = (accountId: number, userId: number): Promise<API.Response> => {
  return request(`/userCollect/accountCollection/${accountId}/${userId}`, {
    method: 'POST'
  })
}

export const accountCollectionStatueApi = (
  accountId: number,
  userId: number
): Promise<API.Response> => {
  return request(`/userCollect/accountCollectionStatue/${accountId}/${userId}`, {
    method: 'GET'
  })
}

export const accountCollectionListApi = (param: API.collectionParams): Promise<API.Response> => {
  return request('/userCollect/accountCollectionListByUserId', {
    method: 'GET',
    params: param
  })
}

export const cancelCollectionsApi = (params: number[], userId: number): Promise<API.Response> => {
  return request('/userCollect/cancelCollections', {
    method: 'DELETE',
    params: {
      ids: params,
      userId
    }
  })
}

export const getPostTopApi = (e: number) => {
  return request(`/record/getPostTop/${e}`, {
    method: 'GET'
  })
}

export const getCommentTopApi = (e: string) => {
  return request(`/record/getCommentTop/${e}`, {
    method: 'GET'
  })
}

export const cancelCustomCollectionApi = (
  userId: number,
  accountId: number
): Promise<API.Response> => {
  return request(`/userCollect/cancelCustomCollection/${userId}/${accountId}`, {
    method: 'DELETE'
  })
}
