import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import VueCookies from 'vue-cookies'
import '@babel/polyfill'
import './assets/css/common.css'
import $http from './utils/http'

Vue.use(ElementUI)
Vue.use(VueCookies)

Vue.prototype.$http = $http
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    NProgress.start()
    document.title = to.meta.title
    next()
})

router.afterEach(() => {
    NProgress.done()
})

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
