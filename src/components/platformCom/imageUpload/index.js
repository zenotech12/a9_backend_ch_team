import imageUpload from './main'

imageUpload.install = function(Vue) {
  Vue.component(imageUpload.name, imageUpload)
}

export default imageUpload
