import { createStore } from 'vuex'
import { getCurrentApi } from '@/service/user'

export type RootState = {
  user?: any
  menu: string
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
    tempToken: '',
    tempPhone: ''
  },
  mutations: {
    SET_USER(state, payload) {
      // eslint-disable-next-line no-param-reassign
      state.user = payload
    },
    SET_MENU(state, payload) {
      // eslint-disable-next-line no-param-reassign
      state.menu = payload
    },
    SET_TOKEN(state, payload) {
      // eslint-disable-next-line no-param-reassign
      state.tempToken = payload
    },
    SET_TEMP_PHONE(state, payload) {
      // eslint-disable-next-line no-param-reassign
      state.tempPhone = payload
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
        localStorage.setItem('userId', res.data?.id)
        commit('SET_USER', res.data)
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
