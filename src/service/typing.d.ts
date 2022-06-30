/* eslint-disable no-unused-vars */
declare namespace API {
  type Response = {
    success: boolean
    errorCode: string
    // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
    showType: 0 | 1 | 2 | 4 | 9
    errorMessage: string
    data: object | undefined | null
    count: number
  }

  type PageParams = {
    page: number
    pageSize: number
  }

  type Model = {
    createdAt: string
    updatedAt: string
    deletedAt: string
    createdBy: number
  }

  type Dict = {
    label: string
    description: string
    sort: number
  } & Model

  type Account = {
    area: string
    category: string
    platform: string
    accountName: string
    startTime: string
    endTime: string
  } & Model

  type DictParams = Partial<Dict>
  type AccountParams = Partial<Account>

  type LoginRequest = {
    phone: string
    smsCode: string
  }
}
