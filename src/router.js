import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login'
import Home from './views/Home/Home.vue'
import User from './views/User/User.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/user',
          component: User
        }
      ]
    },
    //当访问'/'的时候，我们重定向到home页面，如果用户访问带有token，就直接到home页面，如果没有带token就又回到了login页面，因为前置守卫的问题
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
