// import { asyncRouterMap, constantRouterMap } from '@/router'
// import { asyncRouterMap, defaultRouter } from '@/router'
import { asyncRouterMap } from '@/router'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }
function hasPermission(route, roles) {
  if (route.meta) {
    if (Array.isArray(route.meta.role)) {
      return route.meta.role.some(rules => roles.includes(rules))
    } else if (route.meta.role) {
      return roles.includes(route.meta.role)
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(route, roles)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    // routers: constantRouterMap,
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, data)
        // const temp = defaultRouter.concat(accessedRouters)
        const temp = accessedRouters
        commit('SET_ROUTERS', temp)
        resolve(temp)
      })
    },
    setRouter({ commit }, data) {
      return new Promise(resolve => {
        const router = data
        commit('SET_ROUTERS', router)
        resolve()
      })
    }
  }
}

export default permission
