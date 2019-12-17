<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
    <breadcrumb></breadcrumb>
    <!--<div class="newTutorial" @click="changeNewLang()">-->
      <!--<img :src="nowImg" alt="" class="img">-->
      <!--<span class="newtitle">语言切换</span>-->
    <!--</div>-->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span><img :src="imgPng" class="logoImg"></span>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">{{$t('login.loginOut')}}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getIdentity } from '@/utils/auth'
export default {
  data() {
    return {
      name: '',
      imgPng: require('../../../assets/images/dl/userLogo.png'),
      zhLang: require('../../../assets/images/icon_zw.png'),
      ehLang: require('../../../assets/images/icon_yw.png'),
      nowImg: null
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo', 'lang'
    ])
  },
  mounted() {
    this.name = getIdentity()
    if (this.lang === 'zh') {
      this.nowImg = this.zhLang
    } else {
      this.nowImg = this.ehLang
    }
  },
  methods: {
    ...mapMutations({
      changeLang: 'CHANGE_LANG'
    }),
    changeNewLang() {
      if (this.lang === 'zh') {
        this.nowImg = this.ehLang
        this.changeLang('en')
      } else {
        this.nowImg = this.zhLang
        this.changeLang('zh')
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
        // this.$router.replace('/login')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  /*line-height: 50px;*/
  display: flex;
  align-items: center;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .big_screen {
    position: absolute;
    right: 85px;
  }
  .newTutorial {
    position: absolute;
    right: 90px;
    display: flex;
    align-items: center;
    justify-items: center;
    cursor: pointer;
    /*margin-right: 20px;*/
    .img {
      display: inline-block;
      cursor: pointer;
      /*margin-top: 5px;*/
    }
    .newtitle {
      color: #000;
      font-size: 12px;
      display: inline-block;
      padding-left: 5px;
    }
  }
  .big_screen1 {
    position: absolute;
    right: 90px;
  }
  .big_screen2 {
    position: absolute;
    right: 285px;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .logoImg{
        display: inline-block;
        height: 30px;
        margin-top: 6px;

      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
    .user-dropdown {
      z-index: 99999!important;
    }
  }
}
.el-menu.el-menu--horizontal {
  border: none;
}
</style>

