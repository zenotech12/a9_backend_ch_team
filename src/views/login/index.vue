<template>
  <div class="login-container">
    <div class="layout">
      <div class="login-header">
      </div>
      <div class="login-content">
        <div class="login-content-box">
        </div>
        <el-form autoComplete="on" style="background: #fff;z-index: 999" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
                 class="card-box login-form">
          <div class="login-form-comName">
            {{$t('login.title')}}
          </div>
          <template v-if="loginWay === 0">
            <el-form-item prop="login_name">
              <span class="svg-container svg-container_login">
                <div class="usernameBg"></div>
              </span>
              <el-input name="login_name" class="inputText" type="text" v-model="loginForm.login_name" clearable  :placeholder="$t('login.pleaseEnterAccount')" />
            </el-form-item>
            <el-form-item prop="pass_word">
              <span class="svg-container">
                <div class="passwordBg"></div>
              </span>
              <el-input type="password" @keyup.enter.native="handleLogin" v-model="loginForm.pass_word"
                        :placeholder="$t('login.pleaseEnterPassword')"></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item prop="login_name">
              <span class="svg-container svg-container_login">
                <div class="usernameBg"></div>
              </span>
              <el-select v-model="loginForm.nation_code" style="width: 30%">
                <el-option
                  v-for="(v, k) in nationsCodes"
                  :key="v"
                  :label="k"
                  :value="v">
                </el-option>
              </el-select>
              <el-input name="login_name" style="width: 55%" class="inputText1" type="text" v-model="loginForm.login_name" clearable  :placeholder="$t('login.pleaseEnterAccount')" />
            </el-form-item>
            <el-form-item prop="code">
              <span class="svg-container">
                <div class="passwordBg"></div>
              </span>
              <el-input @keyup.enter.native="handleLogin" v-model="loginForm.code"
                        :placeholder="$t('login.pleaseEnterCode')"></el-input>
              <el-button size="mini" class="show-pwd1" v-if="show" :disabled="disabled" @click="getVerificationCode">{{$t('login.sendCode')}}</el-button>
              <span class="show-pwd" v-if="!show">{{$t('login.areadySend')}}({{count}}s)</span>
            </el-form-item>
          </template>
          <div class="opt-row"><a href="http://a9.idesum.com/forget.html?refer=https://a9partner.idesum.com/">{{$t('login.forget')}}</a>
            <a class="wayChange" @click="changeLoginWay">{{loginWay === 0 ? $t('login.loginWay1') :$t('login.loginWay2')}}</a>
          </div>
          <el-form-item class="form-btn">
            <el-button type="primary" class="form-btn-login" :loading="loading" @click.native.prevent="handleLogin">
              {{$t('login.login')}}
            </el-button>
            <div class="rTip">{{$t('login.registerTip1')}}<a>{{$t('login.registerTip')}}
              <div class="qrtip">
                <img src="../../assets/images/downloadQr.png" alt="">
                <!--<img src="https://a9app.idesum.com/data/app/v1/qrcode/conv?str=https://https://a9sys.idesum.com/apk/anine-seller-release1.1.1-202003311125.apk"/>-->
              </div>
            </a></div>
          </el-form-item>
        </el-form>
        <div style="clear: both">

        </div>
      </div>
    </div>
     <div class="footer-container">
      <div class="login-footer">
        <div class="footer-menu">
          <a target="_blank" href="https://www.a9kh.com/document/about.html">{{$t('login.footmenu1')}}</a>
          <span>|</span>
          <a >{{$t('login.footmenu3')}}</a>
          <span>|</span>
          <a target="_blank" href="https://www.a9kh.com/document/cooperation.html">{{$t('login.footmenu4')}}</a>
          <span>|</span>
          <a target="_blank" href="https://www.a9kh.com/document/question.html">{{$t('login.footmenu5')}}</a>
          <span>|</span>
          <a target="_blank" href="https://www.a9kh.com/document/contact.html">{{$t('login.footmenu6')}}</a>
        </div>
        <div class="copyright">{{$t('login.copyright')}}</div>
      </div>
     </div>
  </div>
</template>

<script>
import { mobileCode } from '@/api/login'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   // var reg = /^((\d2,3)|(\d{3}\-))?13\d{9}$/
    //   if (value.length < 11) {
    //     callback(new Error(this.$t('login.accountCheck')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      nationsCodes: { '+86': '86', '+855': '855' },
      loginForm: {
        login_name: '',
        nation_code: '86',
        pass_word: '',
        code: '',
        merchant: true
      },
      loginRules: {
        login_name: [{ required: true, trigger: 'blur', message: this.$t('login.accountCheck') }]
      },
      loginWay: 0,
      loading: false,
      pwdType: 'password',
      disabled: true,
      timer: null,
      show: true,
      count: 0,
      mobile: ''

    }
  },
  watch: {
    'loginForm.login_name'(val) {
      this.disabled = false
    }
  },
  methods: {
    ...mapMutations({
      changeLang: 'CHANGE_LANG'
    }),
    changeNewLang(lan) {
      if (this.lang !== lan) {
        this.changeLang(lan)
      }
    },
    getVerificationCode() {
      const timeCount = 60
      if (!this.timer) {
        this.count = timeCount
        mobileCode({ 'login_name': this.loginForm.login_name, nation_code: this.loginForm.nation_code, 'type': 'loginandreg' }).then(res => {
          if (res.meta === 0) {
            this.show = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= timeCount) {
                this.count--
              } else {
                this.show = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        })
      }
    },
    changeLoginWay() {
      if (this.loginWay === 0) {
        this.loginWay = 1
      } else {
        this.loginWay = 0
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const lf = { merchant: true, login_name: this.loginForm.login_name }
          if (this.loginWay === 0) {
            if (this.loginForm.pass_word.length < 6) {
              this.$message.error(this.$t('login.passwordCheck'))
              this.loading = false
              return
            }
            lf['pass_word'] = this.loginForm.pass_word
          } else {
            lf['nation_code'] = this.loginForm.nation_code
            lf['code'] = this.loginForm.code
          }
          this.$store.dispatch('Login', lf).then(() => {
            this.loading = false
            this.$router.push({ path: '/dashboard' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    // this.changeNewLang('en')
    if (this.$route.query.p) {
      this.loginForm.login_name = this.$route.query.p
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#9ac338;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .footer-container{
    width: 100%;
    background-color:#9BC338 ;
    padding: 25px 0px;
    .login-footer{
      font-size: 12px;
      color: #ffffff;
        width: 1200px;
        margin: 0 auto;
      .footer-menu{
        span{
          padding: 0px 15px;
          display: inline-block;
        }
      }
      .copyright{
        margin-top: 18px;
      }
    }
  }
  .svg{
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
  }
  .rTip{
    color: #999999;
    margin-top: 15px;
    a{
      color: #333333;
      position: relative;
      div{
        position: absolute;
        top: 20px;
        left: -5px;
        background: url("../../assets/images/qr-bg.png");
        width: 105px;
        height: 116px;
        padding: 14px 3px 3px 3px;
        img{
          width: 99px;
          height: 99px;
        }
      }
    }
  }
  .opt-row{
    display: flex;
    justify-content: space-between;
    color: #999999;
    font-size: 12px;
  }
  .btn{
    height: 100%;
    width: 100%;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    border-left:1px solid rgba(231, 233, 237, 1)
  }
  .inputText {
    .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
.login-header{
    height: 84px;
    background: url("../../assets/images/plogo.png") no-repeat left center;
    margin-top: 38px;
}
.login-content{
    margin-top: 50px;
  overflow: hidden;
    position: relative;
    min-height: calc(100vh - 256px);
    /*background-color: #182538;*/
    .login-content-box {
      width: 488px;
      height: 484px;
      background: url(../../assets/images/login-bg.png) no-repeat;
      float: left;
      margin-left: 96px;
    }
}
  .login-container {
    background-color: #ffffff;
    overflow: hidden;
    position: fixed;
    width:100%;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      -webkit-text-fill-color: $bg !important;
    }
    .layout{
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;
    }
    input {
      background: #fff;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      /*padding: 12px 0px 12px 4px;*/
      padding: 0;
      color: $bg;
      height: 28px;
      line-height: 15px;
    }
    .el-input {
      display: inline-block;
      height: 32px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 10px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
      .usernameBg{
        width: 16px;
        height: 16px;
        cursor: pointer;
        background: url("../../assets/images/dl/icon_zh_s.png");
      }
      .usernameBg:hover{
        background: url("../../assets/images/dl/icon_zh_s.png");
      }
      .passwordBg{
        width: 16px;
        height: 16px;
        cursor: pointer;
        background: url("../../assets/images/dl/icon_mm_s.png");
      }
      .passwordBg:hover{
        background: url("../../assets/images/dl/icon_mm_s.png");
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    /*登录表单界面*/
    .login-form {
      float: right;
      margin-right: 0px;
      margin-top: 30px;
      width: 360px;
      height: 388px;
      padding: 35px 30px 15px 30px;
      .login-form-loginName {
        text-align: center;
        font-size:18px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:#24303E;
        line-height:25px;
      }
      .login-form-comName {
        text-align: left;
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:#333333;
        line-height:22px;
        margin: 22px 0 36px 0;
      }
    }
    .el-form-item {
      border: 1px solid RGBA(231, 233, 237, 1);
      /*  border: rgba(0, 0, 0, 0.1);*/
      border-radius: 2px;
      color: #454545;
      .el-form-item__content {
        line-height: 32px;
      }
    }
    .form-btn{
      height: 32px;
      border: none;
      margin-top: 27px;
      .form-btn-login {
        height: 32px;
        padding: 0;
        line-height: 32px;
        width:100%;
        border-radius: 2px;
        background-color: #9BC338;
        border-color: #9BC338;
      }
    }
    .passwordRow {
      font-size:12px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(119,126,135,1);
      line-height:17px;
      border: none;
    }
    .show-pwd1 {
      position: absolute;
      right: 0px;
      top: 2px;
      font-size: 14px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
      border: none;
      .el-button:hover {}
      background-color: #fff;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 2px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
  .test {
    position: absolute;
    top: 0;
  }
  @media only screen and (max-height: 850px) {
    .login-header{
      margin-top: 5px;
    }
    .login-content{
      margin-top: 10px;
      min-height: calc(100vh - 195px)
    }
    .login-container{
      overflow: auto;
      min-width: 1200px;
      min-height: 700px;
      position: relative;
    }
  }
</style>
