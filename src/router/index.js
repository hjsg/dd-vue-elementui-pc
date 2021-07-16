import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../view/home'),
        meta: {title: '首页'}
    }
]

const router = new VueRouter({
    routes
})
export default router
