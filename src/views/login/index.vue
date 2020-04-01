<template>
  <div class="login-container">
      <div class="login-header">
                <div style="width: 1000px;margin: 0 auto;padding: 10px;position: relative">
                  <span class="login_title1">商户平台</span>
                </div>
      </div>
      <div class="login-content">
          <div class="login-content-box" style="width: 1000px;margin: 0 auto;padding: 10px;position: relative">
              <div style="z-index: 999;color: #fff;font-size: 24px;display: inline-block;position: absolute;top: 100px;line-height: 1.4;left: 0;">
                    <p class="login-content-title">{{$t('login.slogan')}}</p>
                    <!--<p style="color:#FFFFFF;font-size: 20px;margin-top: 0;">Pioneer of Intelligent Pallet Material Linkage</p>-->
              </div>
          </div>
          <el-form autoComplete="on" style="background: #fff;z-index: 999" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
                   class="card-box login-form">
              <div class="login-form-loginName">{{$t('login.login')}}</div>
              <div class="login-form-comName">
                {{$t('login.title')}}
              </div>
            <!--<el-form-item prop="username">-->
              <!--<span class="svg-container svg-container_login">-->
                <!--<div class="usernameBg"></div>-->
              <!--</span>-->
              <!--<el-input name="username" type="text" v-model="loginForm.username"  :placeholder="$t('login.pleaseEnterAccount')" />-->
            <!--</el-form-item>-->
            <!--<el-form-item prop="password">-->
              <!--<span class="svg-container">-->
                <!--<div class="passwordBg"></div>-->
              <!--</span>-->
              <!--<el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"-->
                        <!--:placeholder="$t('login.pleaseEnterPassword')"></el-input>-->
              <!--<span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>-->
            <!--</el-form-item>-->
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

            <el-form-item class="form-btn">
              <el-button type="primary" class="form-btn-login" :loading="loading" @click.native.prevent="handleLogin">
                {{$t('login.login')}}
              </el-button>
              <div class="opt-row"><a href="http://a9.idesum.com/forget.html?refer=https://a9partner.idesum.com/">{{$t('login.forget')}}</a>
                <a class="wayChange" @click="changeLoginWay">{{loginWay === 0 ? $t('login.loginWay1') :$t('login.loginWay2')}}</a>
              </div>
              <div class="rTip"><a target="_blank" href="https://a9sys.idesum.com/apk/anine-seller-release1.1.1-202003311125.apk">{{$t('login.registerTip')}}</a></div>
            </el-form-item>
          </el-form>

      </div>
      <div class="login-footer">
          <div style="width: 1000px;margin: 0 auto;padding: 10px 0 0 0 ;position: relative;overflow: hidden">
            <div class="login-footer-title">{{$t('login.title')}} {{$t('login.copyright')}} | 粤ICP备18114860号</div>
          </div>
      </div>

  </div>
</template>

<script>
import { mobileCode } from '@/api/login'
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
      nationsCodes: { '+86': '86', '+855': '855'},
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#9ac338;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .login-footer{
      min-height: 200px;
  }
  .svg{
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
  }
  .rTip{
    color: #999999;
    margin-top: 10px;
  }
  .opt-row{
    display: flex;
    justify-content: space-between;
    .wayChange{
      color: #999999;
    }
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
    height: 189px;
    /*首页公司系统名称*/
    .login_title1{
      display: inline-block;
      color: #fff;
      font-size: 24px;
      font-family:PingFangSC-Medium;
      /*font-weight:500;*/
      margin-top: 148px;
    }
    .login_title2{
      display: inline-block;
      color: #000000;
      font-size: 24px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      margin-top: 122px;
    }
}
.login-content{
    position: relative;
    height: 580px;
    /*background-color: #182538;*/
    background-size: 100% auto;
    .login-content-box {
      height: 300px;
      /*background-image: url(../../assets/images/dl/login_bac.png)*/
    }
    .login-content-title{
      font-size: 30px;
      margin-top: 30px;
      margin-bottom: 0;
      font-family:PingFangSC-Semibold;
    }
  .login-content-form{
    background: #fff;
    position: relative;
    top: -50px;
    left: 0;
  }
}
  .login-container {
    background-color: #9ac338;
    overflow: hidden;
    position: fixed;
    height: 100%;
    width:100%;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      -webkit-text-fill-color: $bg !important;
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
      position: absolute;
      top: 82px;
      right:24%;
      width: 360px;
      height: 388px;
      padding: 35px 30px 15px 30px;
      border-top: 6px solid #F99426;
      .login-form-loginName {
        text-align: center;
        font-size:18px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:#24303E;
        line-height:25px;
      }
      .login-form-comName {
        text-align: center;
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:#9ac338;
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
      .form-btn-login {
        height: 32px;
        padding: 0;
        line-height: 32px;
        width:100%;
        border-radius: 2px;
        background-color: #F99426;
        border-color: #F99426;
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
    .login-footer-title {
      width:100%;
      height:17px;
      font-size:12px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(190,193,198,1);
      line-height:17px;
      margin: 30px auto;
      text-align: center;
    }
  }
  .test {
    position: absolute;
    top: 0;
  }
</style>
