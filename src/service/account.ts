import request from './_requests'
import AccountParams = API.AccountParams;
import PageParams = API.PageParams;
export const listAccountByPageApi = (params: AccountParams & PageParams): Promise<API.Response> => {
  return request("/account/findAccountSelectPage", {
    method: "GET",
    params
  });
}

