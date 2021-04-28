import purchasesList from './main'

purchasesList.install = function(Vue) {
  Vue.component(purchasesList.name, purchasesList)
}

export default purchasesList
