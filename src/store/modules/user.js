import { login } from '@/api/login'
import { version } from '@/utils/static'
import { getToken, setToken, removeToken, setIdentity, removeIdentity, getIdentity, removeAuthority, getAuthority, setVersion } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: getIdentity(),
    roles: [],
    authority: getAuthority(),
    searchCondition: {
      goods: { key: '', code: '', skip: 0, currentPage: 1 }
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_AUTH: (state, authority) => {
      state.authority = authority
    },
    SET_SEARCHCONDITION: (state, searchCondition1) => {
      // console.log('searchCondition1', searchCondition1)
      state.searchCondition.searchCondition1 = searchCondition1
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      userInfo.login_name = userInfo.login_name.trim()
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response
          setToken(data.token)
          setVersion(version())
          setIdentity(data.login_name)
          /* setAuthority(data.mgr_type)*/
          commit('SET_TOKEN', data.token)
          /* commit('SET_ROLES', [data.name])*/
          commit('SET_NAME', data.login_name)
          /* commit('SET_AUTH', data.mgr_type)*/
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        removeToken()
        removeIdentity()
        removeAuthority()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
        removeAuthority()
      })
    }
    // GetPartnerInfo({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     systemGet().then(response => {
    //       const data = response
    //       commit('SET_PARTNERINFO', data.item)
    //       resolve(data.item)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}

export default user
