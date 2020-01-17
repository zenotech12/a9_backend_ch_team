import { initNimSDK } from '@/utils/im_import'

const im = {
  state: {
    nim: null
  },

  mutations: {
    SET_TOKEN: (state, nim) => {
      state.nim = nim
    }
  },

  actions: {
    initNimSDK
  }
}

export default im
