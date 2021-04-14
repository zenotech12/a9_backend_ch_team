import showSkuTable from './main'

showSkuTable.install = function(Vue) {
  Vue.component(showSkuTable.name, showSkuTable)
}

export default showSkuTable
