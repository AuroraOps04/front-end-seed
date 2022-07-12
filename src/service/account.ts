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

export const addAccountApi = (accountName: string): Promise<API.Response> => {
  return request(`/record/addAccountAndRecord/${accountName}`, {
    method: 'GET'
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
