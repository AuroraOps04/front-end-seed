import { getCurrentApi } from '@/service/user'
import { createStore } from 'vuex'

export type RootState = {
    user?: any
}

export default createStore<RootState>({
    state: {
        user: {
            name: '456'
        }
    },
 mutations: {
    ['SET_USER'](state, payload){
        state.user = payload
    }
 },
 actions: {
    /**
 * 获取当前用户信息
 * 如果拿不到就清空当前的用户信息
 * 拿到了就设置当前的用户信息
 */
    async fetchCurrentUser({commit}){
        try{
            const res = await getCurrentApi()
           commit("SET_USER", res.data)
          }catch(e){
            commit("SET_USER", undefined)
          }
    }
 },
 getters: {
    currentUser(state){
        return state.user
    }
 }
})
