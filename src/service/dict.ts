
import request from './_requests'
import DictParams = API.DictParams
import PageParams = API.PageParams

export const listDictByPageApi = (params: DictParams & PageParams): Promise<API.Response> => {
  return request('/dict/page', {
    params
  })
}

