import Vue from 'vue'
import Cookies from 'js-cookie'
import i18n from '@/utils/i18n'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    lang: i18n.locale,
    searchParam: {}
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    CHANGE_LANG(state, data) {
      if (data) {
        Cookies.set('lang', data)
        i18n.locale = data
        state.lang = data
      }
    },
    SETSEARCHPARAM(state, data) {
      Vue.set(state.searchParam, data.key, data.value)
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    SetSearchParam: ({ commit }, data) => {
      commit('SETSEARCHPARAM', data)
    }
  }
}

export default app
