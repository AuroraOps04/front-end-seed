import request from './_requests'
import AccountParams = API.AccountParams;
import PageParams = API.PageParams;

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

