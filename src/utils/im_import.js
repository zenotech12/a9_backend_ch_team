const SDK = require('@/imsdk/NIM_Web_SDK_v6.1.0')
export function initNimSDK({ state, commit, dispatch }) {
  if (state.nim) {
    state.nim.disconnect()
  }
  // 初始化SDK
  console.log(SDK)
  window.nim = state.nim = SDK.NIM.getInstance({
    debug: true,
    appKey: 'a7ecc1335f3f176e630364443d100be6',
    account: state.imInfo.accid,
    token: state.imInfo.im_token,
    transports: ['websocket'],
    db: false,
    // logFunc: new SDK.NIM.LoggerPlugin({
    //   url: '/webdemo/h5/getlogger',
    //   level: 'info'
    // }),
    syncSessionUnread: true,
    syncRobots: true,
    autoMarkRead: true, // 默认为true
    onconnect: function onConnect(event) {
      console.log('connect', event)
    },
    onerror: function onError(event) {
      // alert(JSON.stringify(event))
      debugger
      alert('网络连接状态异常')
    },
    onwillreconnect: function onWillReconnect() {
      console.log(event)
    },
    ondisconnect: function onDisconnect(error) {
      // console.log(error)
      console.log(error)
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          console.log('帐号或密码错误', 'login')
          break
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          break
        default:
          break
      }
    }
  })
}
