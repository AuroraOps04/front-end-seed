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

  type AreaQuery = {
    areaName: string
  } & Model

  type CategoryQuery = {
    categoryName: string
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
  } & Model

  type DictParams = Partial<Dict>
  type AccountParams = Partial<Account>
  type AccountQueryParams = Partial<AccountQuery>
  type UserParams = Partial<User>
  type AreaParams = Partial<Area>
  type CategoryParams = Partial<Category>
  type UserQueryParams = Partial<UserQuery>
  type AreaQueryParams = Partial<AreaQuery>
  type CategoryQueryParams = Partial<CategoryQuery>

  type CharsParams = Partial<CharsQuery>
  type LoginRequest = {
    phone: string
    smsCode: string
  }
}
