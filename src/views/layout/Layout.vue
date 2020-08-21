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
export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    ...mapGetters([
      'imInfo'
    ])
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
  },
  mounted() {
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
