import totalData from './main'

totalData.install = function(Vue) {
  Vue.component(totalData.name, totalData)
}

export default totalData
