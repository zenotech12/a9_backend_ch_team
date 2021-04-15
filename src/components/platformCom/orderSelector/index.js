import orderSelector from './main'

orderSelector.install = function(Vue) {
  Vue.component(orderSelector.name, orderSelector)
}

export default orderSelector
