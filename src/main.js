import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//引入assets下面的index.css文件
import './assets/css/index.css'
Vue.use(ElementUI)

import axios from 'axios'
//把axios加到了Vue的原型上
Vue.prototype.$http = axios
//通过axios.defaults.baseURL 设置一个默认URL，以后就不要写基地址了！！！
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//设置axios 的请求拦截器 ，解决以后每次都要写hedaers
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = localStorage.getItem('token')
  // console.log(config)
  return config
})
//设置axious的响应拦截器
axios.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  /* 当令牌过期的是时候，直接跳到login页面 */
  console.log(response)
  if (response.data.meta.status === 401) {
    router.push('/login')
  }
  return response
})

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // ...
  // console.log(to, from, next)
  // next()
  if (to.path === '/login') {
    next()
    return
  }
  if (localStorage.getItem('token')) {
    next()
  } else {
    router.push('/login')
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
