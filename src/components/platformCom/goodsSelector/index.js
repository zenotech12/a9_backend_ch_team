import goodsSelector from './main'

goodsSelector.install = function(Vue) {
  Vue.component(goodsSelector.name, goodsSelector)
}

export default goodsSelector
