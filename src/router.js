import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login/Login'

//实现路由的懒加载
/* import Home from './views/Home/Home.vue'
import User from './views/User/User.vue'
import Roles from './views/Roles/Roles.vue'
import Rights from './views/Rights/Rights.vue'
import Goods from './views/Goods/Goods.vue'
import AddGoods from './views/Goods/AddGoods.vue'
import Categories from './views/Goods/Categories.vue' */
const Home = () => import('./views/Home/Home.vue')
const User = () => import('./views/User/User.vue')
const Roles = () => import('./views/Roles/Roles.vue')
const Rights = () => import('./views/Rights/Rights.vue')
const Goods = () => import('./views/Goods/Goods.vue')
const AddGoods = () => import('./views/Goods/AddGoods.vue')
const Categories = () => import('./views/Goods/Categories.vue')

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
          path: '/users',
          component: User
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/addGoods',
          component: AddGoods
        },
        {
          path: '/categories',
          component: Categories
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
