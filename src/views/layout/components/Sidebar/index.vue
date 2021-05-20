<template>
  <scroll-bar :style="{backgroundColor: backObj[position] ? backObj[position] : '#9ac338'}">
    <div class="sliderBg">
      <div class="logoTitle" >
        <div class="logoImgBox">
          <img :src="imgPng" class="logoImg">
        </div>
        <span class="comName">{{$t('login.merchantSystem')}}</span>
        <span class="userZhiwei">{{shopInfo.user_info.title}}</span>
      </div>
      <div @click="jump()" :class="[toggle ?'guide' : 'mini-guide']" :style="{backgroundColor: backObjQian[position] ? backObjQian[position] : '#9ac338'}">
        <span>{{$t('global.home')}}</span>
      </div>
    </div>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" :background-color="backObj[position] ? backObj[position] : '#9ac338'" text-color="#fff" active-text-color="#000">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
    <div class="hamburger_btn">
      <!--<hamburger :class="[toggle ?'hamburger-container' : 'mini-hamburger-container']" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
    </div>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import store from '@/store'
import Cookies from 'js-cookie'
import Hamburger from '@/components/Hamburger'
export default {
  components: { SidebarItem, ScrollBar, Hamburger },
  data() {
    return {
      toggle: true,
      imgPng: require('../../../../assets/images/dl/logoMerchant.png'),
      opened: !+Cookies.get('sidebarStatus'),
      backObj: {
        controller: '#37474F',
        finance: '#EF6C00', // 橘色
        seller: '#9ac338', // 绿色
        purchaser: '#1976D2', // 蓝色
        warehouse: '#424242' // 炭黑色
      },
      backObjQian: {
        controller: '#263238',
        finance: '#E65100', // 橘色
        seller: '#798633', // 绿色
        purchaser: '#0D47A1', // 蓝色
        warehouse: '#212121' // 炭黑色
      },
      position: ''
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'shopInfo'
    ]),
    routes() {
      return store.getters.routers
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    side() {
      return store.getters.sidebar.opened
    }
  },
  watch: {
    side: function(val) {
      this.toggle = val
    }
  },
  mounted() {
    this.position = this.shopInfo.user_info.title.toLowerCase()
    console.log('td', this.position)
  },
  methods: {
    jump() {
      this.$router.push('/')
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    }
  }
}
</script>
<style lang="scss" scoped>
  .logoTitle {
    /*background-color: #9ac338;*/
    text-align: center;
    height: 150px;
    display: flex;
    flex-direction: column;
    .userZhiwei {
      font-size: 20px;
      font-weight: bold;
      margin-top: 14px;
      color: #fff;
    }
    .comName {
      font-size: 20px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(255,255,255,1);
      line-height:28px;
      height: 28px;
    }
    .logoImgBox {
      text-align: center;
      padding: 13px 0 5px 0;
      .logoImg{
        display: inline-block;
        height: 44px;
        margin-right: 7px;
        border-radius: 1px;
      }
    }

  }

  .hamburger_btn {
    position: fixed;
    bottom: 20px;
    left: 180px;
  }


  .guide {
    width:170px;
    height:28px;
    /*background-color: #798633;*/
    margin: 0 auto 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius:2px;
    font-size:14px;
    font-family:SFUIText-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
    cursor: pointer;
    animation:mymove 0.26s linear;
  }

  @keyframes mymove
  {
    from {width:100px;}
    to {width:190px;}
  }

  @-webkit-keyframes mymove /*Safari and Chrome*/
  {
    from {width:100px;}
    to {width:190px;}
  }

  .guide:hover {
    background:#6f7a89;
  }




  .mini-guide {

    width: 60px;
    height: 60px;
    margin: 0px 10px;
    border:1px solid rgba(255,255,255,0.1);
    font-size:12px;
    font-family:SFUIText-Medium;
    font-weight:500;
    color:rgba(255,255,255,1);
    text-align: center;
    cursor: pointer;
    span{
      display: block;
      margin: 12px 4px 4px 6px;
    }
  }

  .hamburger-container {
    line-height: 20px;
    height: 20px;
    width: 20px;
    /*float: left;*/
    padding: 2px 10px 0px 6px;
  }
  mini-hamburger-container {
    height: 16px;
    width: 16px;
    margin-left: 7px;
  }
</style>
