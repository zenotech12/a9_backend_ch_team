// export const serverBaseUrl = 'http://120.77.219.198:8907'
const serverConfig = {
  // api_url: 'http://120.77.219.198:8912',
  // qr_prefix: 'http://120.77.219.198:8912/admin/v1/qr/'
  // api_url: 'http://192.168.31.194:8915',
  api_url: 'https://a9partner.idesum.com/data',
  qr_prefix: 'http://192.168.31.194:8915/admin/v1'
}
if (process.env.NODE_ENV === 'production') {
  serverConfig.api_url = '/data'
}
export const fileUploadUrl = serverConfig.api_url + '/file/upload'
export const imgGetUrl = serverConfig.api_url + '/file/get'
export const fileUrl = serverConfig.api_url + '/file/'
export const fileUrlApk = serverConfig.api_url + '/admin/v1/big-file/upload'
export const appUrl = 'https://m.a9kh.com'
export default serverConfig
export const appKey = 'jnvcnkmk3323219jfd#ljkfkdsmer*#ty31erf'
