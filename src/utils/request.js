import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import md5 from 'js-md5'
import { getToken } from '@/utils/auth'
import qs from 'qs'
import serverConfig from './serverConfig'
import { appKey } from './serverConfig'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL: '/api/v1', // api的base_url
  timeout: 15000 // 请求超时时间
})

function getSign(data, path, method) {
  const signStr = 'local_time=' + data['local_time'] + '&method=' + method.toLowerCase() + '&nonce_str=' + data['nonce_str'] + '&path=' + path + '&' + appKey
  // console.log('signStr', signStr)
  return md5(signStr).toUpperCase()
}

function GetUrlRelativePath(baseUrl, pUrl) {
  if (pUrl.indexOf('/') === 0) {
    pUrl = pUrl.substr(1)
  }
  const url = baseUrl + pUrl
  let relUrl = url.replace(serverConfig.api_url, '')
  if (relUrl.indexOf('?') !== -1) {
    relUrl = relUrl.split('?')[0]
  }
  return relUrl
}

service.defaults.baseURL = serverConfig.api_url + '/app/v1/merchant/'
// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Access-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  if (config.method === 'post' || config.method === 'put') {
    config.data = qs.stringify({
      ...config.data
    })
  }
  const data = {
    'local_time': parseInt(Date.parse(new Date()) / 1000),
    'nonce_str': Math.random().toString(36).substr(2)
  }
  config.headers['X-Access-Nonce'] = data.nonce_str
  config.headers['X-Access-LocalTime'] = data.local_time
  config.headers['X-Access-Sign'] = getSign(data, GetUrlRelativePath(config.baseURL, config.url), config.method)
  // if (config.method === 'post') {
  //   config.data = config.data ? config.data : {}
  //   delete config.data.sign
  //   config.data['nonce_str'] = Math.random().toString(36).substr(2)
  //   config.data['local_time'] = parseInt(Date.parse(new Date()) / 1000)
  //   config.data['sign'] = getSign(config.data, GetUrlRelativePath(config.baseURL, config.url), config.method)
  //   config.data = qs.stringify({
  //     ...config.data
  //   })
  // } else if (config.method === 'get' || config.method === 'delete') {
  //   config.params = config.params ? config.params : {}
  //   delete config.params.sign
  //   config.params['nonce_str'] = Math.random().toString(36).substr(2)
  //   config.params['local_time'] = parseInt(Date.parse(new Date()) / 1000)
  //   config.params['sign'] = getSign(config.params, GetUrlRelativePath(config.baseURL, config.url), config.method)
  // }
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // if (config.method === 'post') {
  //   config.data = qs.stringify({
  //     ...config.data
  //   })
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */

    const res = response.data
    if (res.meta === undefined) {
      return Promise.reject(res)
    } else if (res.meta !== 0) {
      Message({
        message: res.error,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.meta === 50008 || res.meta === 50012 || res.meta === 10000) {
        MessageBox.confirm('你已被登出，请重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            // this.$router.push({ path: '/login' })
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
