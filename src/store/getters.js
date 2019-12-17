
const getters = {
  sidebar: state => state.app.sidebar,
  lang: state => state.app.lang,
  token: state => state.user.token,
  name: state => state.user.name,
  username: state => state.user.username,
  password: state => state.user.password,
  roles: state => state.user.roles,
  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  authority: state => state.user.authority,
  visitedViews: state => state.tagsView.visitedViews
}
export default getters
