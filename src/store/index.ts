import { createStore } from 'vuex'
import { getCurrentApi } from '@/service/user'

export type RootState = {
  user?: any
  menu: string
  personMenu: string
  tempToken: string
  tempPhone: string
}

export default createStore<RootState>({
  state: {
    user: {
      id: '',
      username: '',
      phone: '',
      pictureUrl: '',
      ipAddress: '',
      userRating: ''
    },
    menu: 'home',
    personMenu: 'person',
    tempToken: '',
    tempPhone: ''
  },
  mutations: {
    SET_USER(state, payload) {
      const tempState: any = state
      tempState.user = payload
    },
    SET_MENU(state, payload) {
      const tempState: any = state
      tempState.menu = payload
    },
    SET_PERSON_MENU(state, payload) {
      const tempState: any = state
      tempState.personMenu = payload
    },
    SET_TOKEN(state, payload) {
      const tempState: any = state
      tempState.tempToken = payload
    },
    SET_TEMP_PHONE(state, payload) {
      const tempState: any = state
      tempState.tempPhone = payload
    }
  },
  actions: {
    /**
     * 获取当前用户信息
     * 如果拿不到就清空当前的用户信息
     * 拿到了就设置当前的用户信息
     */
    async fetchCurrentUser({ commit }) {
      try {
        const res = await getCurrentApi()
        const tempData: any = res.data
        localStorage.setItem('userId', tempData.id)
        commit('SET_USER', tempData)
      } catch (e) {
        commit('SET_USER', undefined)
      }
    }
  },
  getters: {
    currentUser(state) {
      return state.user
    },
    currentId(state) {
      return state.user?.id
    },
    currentUsername(state) {
      return state.user?.username
    },
    currentPictureUrl(state) {
      return state.user?.pictureUrl
    },
    currentPhone(state) {
      return state.user?.phone
    },
    currentMenu(state) {
      return state.menu
    },
    currentPersonMenu(state) {
      return state.personMenu
    },
    currentToken(state) {
      return state.tempToken
    },
    currentTempPhone(state) {
      return state.tempPhone
    },
    currentIpAddress(state) {
      return state.user?.ipAddress
    }
  }
})
