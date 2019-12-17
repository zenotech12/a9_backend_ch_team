import photosList from './main'

photosList.install = function(Vue) {
  Vue.component(photosList.name, photosList)
}

export default photosList
