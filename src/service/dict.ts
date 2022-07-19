import request from './_requests'
import DictParams = API.DictParams
import PageParams = API.PageParams

// eslint-disable-next-line import/prefer-default-export
export const listDictByPageApi = (params: DictParams & PageParams): Promise<API.Response> => {
  return request('/dict/page', {
    params
  })
}
