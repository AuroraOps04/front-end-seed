import request from './_requests'
import AccountParams = API.AccountParams;
import PageParams = API.PageParams;
import AccountQueryParams = API.AccountQueryParams;
import CharsParams = API.CharsParams;

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

export const findRecordTotalApi = (AccountId:number): Promise<API.Response> => {
  return request(`/account/findRecordTotal/${AccountId}`, {
    method: "GET",
  });
}

export const findRecordCharsDataApi = (params:AccountQueryParams): Promise<API.Response> => {
  return request("/account/findRecordCharsData", {
    method: "GET",
    params
  });
}



