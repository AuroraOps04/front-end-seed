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
    sortType: number
    accountIsView: number
    isExport: number
  } & Model

  type User = {
    username: string
    userRating: string
    category: string
    area: string
    gender: string
    phone: string
    mail: string
  }
  type Area = {
    areaCode: string
    areaDescription: string
    areaId: number
    areaName: string
  } & Model

  type Category = {
    categoryCode: string
    categoryDescription: string
    categoryId: number
    categoryName: string
  } & Model

  type AccountQuery = {
    accountId: number
    startTime: string
    endTime: string
  } & Model

  type UserQuery = {
    username: string
    userRating: string
    category: string
    area: string
  } & Model

  type CharsQuery = {
    accountId: number
    dateList: number
  } & Model

  type AccountData = {
    accountId: number
    accountName: string
    accountPictureUrl: string
    areaName: string
    categoryName: string
    introduction: string
    platformName: string
    recordComment: number
    recordArticle: number
    recordFan: number
    recordForward: number
    recordLike: number
    categoryId: number
    areaId: number
  } & Model

  type AccountFormData = {
    areaId: number
    categoryId: number
    accountCode: string
    platformId: number
  }

  type collectionParams = {
    area: number | null
    category: number | null
    accountName: string
    userId: number
  }

  type Platform = {
    platformId: number
    platformName: string
    platformCode: string
    platformDescription: string
  } & Model

  type DictParams = Partial<Dict>
  type AccountParams = Partial<Account>
  type AccountQueryParams = Partial<AccountQuery>
  type UserParams = Partial<User>
  type UserQueryParams = Partial<UserQuery>

  type CharsParams = Partial<CharsQuery>
  type LoginRequest = {
    phone: string
    password: string
    smsCode: string
  }
  type RegisterRequest = {
    username: string
    gender: string
    mail: string
    phone: string
    focusCategory: any
  }
  type UserInfoRequest = {
    id: number
    username: string
    gender: string
    mail: string
    phone: string
    address: any
    focusCategory: any
  }
}
