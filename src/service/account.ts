import request from './_requests'
import AccountParams = API.AccountParams;
import PageParams = API.PageParams;
import AccountQueryParams = API.AccountQueryParams;

export const listAccountByPageApi = (params: AccountParams & PageParams): Promise<API.Response> => {
  return request("/account/findAccountSelectPage", {
    method: "GET",
    params
  });
}

export const findAllCategoryApi = (params: null): Promise<API.Response> => {
  return request("/category/findCategory", {
    method: "GET"
  });
}

export const findAreaApi = (params: null): Promise<API.Response> => {
  return request("/area/findArea", {
    method: "GET"
  });
}

export const findAccountByAccountApi = (params:AccountQueryParams): Promise<API.Response> => {
  return request("/account/findAccountByAccount", {
    method: "GET",
    params
  });
}

export const findRecordTotalApi = (): Promise<API.Response> => {
  return request(`/account/findRecordTotal`, {
    method: "GET",
  });
}



