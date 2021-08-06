<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
        <navbar></navbar>
        <tags-view></tags-view>
        <app-main></app-main>
      </div>
    </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from '@/views/layout/components'
import { mapGetters } from 'vuex'
import serverConfig from '@/utils/serverConfig'
export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data() {
    return {
      newOrder: '',
      noCheckOrder: '',
      socket: '',
      socketPingTimeObj: null,
      notification: null
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    ...mapGetters([
      'imInfo', 'shopInfo', 'token'
    ])
  },
  beforeDestroy() {
    this.socket.close()
  },
  methods: {
    socketInit() {
      if (typeof (WebSocket) === 'undefined') {
        console.log('notSupport')
      } else {
        // 实例化socket
        this.socket = new WebSocket(serverConfig.ws_url)
        // 监听socket连接
        this.socket.onopen = this.socketOpen
        // 监听socket错误信息
        this.socket.onerror = this.socketError
        // 监听socket消息
        this.socket.onmessage = this.socketMessage
        this.socket.onclose = this.socketClose
      }
    },
    socketOpen() {
      // 链接成功 注册信息
      this.socket.send(JSON.stringify({ type: 1, body: { token: this.token }}))
      // this.socketPing()
    },
    socketError() {
      console.log()
    },
    socketMessage(msg) {
      console.log('receive', msg)
      if (msg.data === 'ping') {
        this.socket.send('pong')
        return
      }
      const data = JSON.parse(msg.data)
      if ((data.type === 2 || data.type === 3 || data.type === 4) && data.code === 200) {
        var _this = this
        if (window.Notification.permission === 'granted') {
          // 创建通知
          _this.notification = new Notification(data.body.title, {
            // dir: 'ltr', // 通知的文字方向
            // icon : 'icon',
            tag: data.body.id + '_' + data.body.type, // 值为字符串，指定通知的唯一标识
            body: data.body.msg
          })
          // 通知被显示
          _this.notification.onshow = function() {
            // alert('通知被显示')
          }
          // 通知被关闭
          _this.notification.onclose = function() {
            // _this.data.count--;
            // alert('通知被关闭')
          }
          // 通知被点击
          _this.notification.onclick = function() {
            // alert('通知被点击')
            if (this.permissionCheck('view', '3_1') || this.permissionCheck('view', '3_2') || this.permissionCheck('view', '3_4')) {
              let pushUrl = {}
              if (this.permissionCheck('view', '3_1')) {
                if (data.type === 2) { // 订单支付成功
                  pushUrl = { name: 'orderList' }
                }
                if (data.type === 3) { // 订单取消
                  pushUrl = { name: 'orderList', params: { order_status: 7 }}
                }
              }
              if (this.permissionCheck('view', '3_2')) {
                if (data.type === 5) { // 退货
                  pushUrl = { name: 'orderReturn' }
                }
              }
              if (this.permissionCheck('view', '3_4')) {
                if (data.type === 4) { // 换货
                  pushUrl = { name: 'orderExchange' }
                }
              }
              _this.$router.push(pushUrl)
            }
          }
          // onerror 事件
          _this.notification.onerror = function(e) {
            // e代表被捕捉到的错误对象
            // alert('error')
          }
        } else if (window.Notification.permission === 'default') {
          window.Notification.requestPermission()
        }
      }
    },
    socketClose() {
      this.socket.close()
      console.log('socket closeed')
    }
  },
  created() {
    const currentLang = this.$store.state.app.lang
    console.log('currentLang', currentLang)
    let lang = navigator.language || navigator.userLanguage
    lang = lang.substr(0, 2).toLowerCase()
    // console.log('lang', lang)
    if (lang !== 'zh' || currentLang !== 'zh') {
      var oHead = document.getElementsByTagName('HEAD').item(0)
      var oScript = document.createElement('script')
      oScript.type = 'text/javascript'
      oScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCNmBY7o9y-mK6omSYieGg12TE25xjqsms&libraries=places'
      oHead.appendChild(oScript)
    }
    if (window.Notification.permission === 'default') {
      window.Notification.requestPermission()
    }
  },
  mounted() {
    if (this.shopInfo) {
      this.socketInit()
    }
    // window.nim = SDK.NIM.getInstance({
    //   debug: true,
    //   appKey: 'a7ecc1335f3f176e630364443d100be6',
    //   account: this.imInfo.accid,
    //   token: this.imInfo.im_token,
    //   transports: ['websocket'],
    //   db: false,
    //   // logFunc: new SDK.NIM.LoggerPlugin({
    //   //   url: '/webdemo/h5/getlogger',
    //   //   level: 'info'
    //   // }),
    //   syncSessionUnread: true,
    //   syncRobots: true,
    //   autoMarkRead: true, // 默认为true
    //   onconnect: function onConnect(event) {
    //     console.log('connect', event)
    //   },
    //   onerror: function onError(event) {
    //     // alert(JSON.stringify(event))
    //     // debugger
    //     alert('网络连接状态异常')
    //   },
    //   onwillreconnect: function onWillReconnect() {
    //     console.log(event)
    //   },
    //   ondisconnect: function onDisconnect(error) {
    //     // console.log(error)
    //     console.log(error)
    //     switch (error.code) {
    //       // 账号或者密码错误, 请跳转到登录页面并提示错误
    //       case 302:
    //         console.log('帐号或密码错误', 'login')
    //         break
    //       // 被踢, 请提示错误后跳转到登录页面
    //       case 'kicked':
    //         break
    //       default:
    //         break
    //     }
    //   }
    // })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
#app .sidebar-container {
  width: 210px !important;
  background-color: #9ac338;
}
#app .main-container {
  margin-left: 210px;
}
</style>
