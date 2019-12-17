import filterFile from './main'

filterFile.install = function(Vue) {
  Vue.component(filterFile.name, filterFile)
}

export default filterFile
