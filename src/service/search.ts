import request from '@service/_requests'

export const getPostBySearch = (data: API.SearchPostRequest) => {
  return request('/record/getPostBySearch', {
    method: 'POST',
    data
  })
}
