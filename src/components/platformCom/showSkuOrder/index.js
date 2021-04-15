import showSkuOrder from './main'

showSkuOrder.install = function(Vue) {
  Vue.component(showSkuOrder.name, showSkuOrder)
}

export default showSkuOrder
