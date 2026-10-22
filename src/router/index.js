import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "@/HelloWorld.vue";
import VueRouter from "vue-router";
import IndexView from "@/views/IndexView.vue";
import ShopCart from "@/views/cart/ShopCart.vue";
import PersonCenter from "@/views/mine/PersonCenter.vue";
import OrderInfo from "@/views/order/OrderInfo.vue";
import QuickLogin from "@/views/login/QuickLogin.vue";
import Login from "@/views/login/Login.vue";
import AfternoonTea from "@/views/cake/AfternoonTea.vue";
import NiceBirthday from "@/views/cake/NiceBirthday.vue";
import ProductDetail from "@/views/cake/ProductDetail.vue";
import ConfirmOrder from "@/views/order/ConfirmOrder.vue";
import CakeOrderDetail from "@/views/order/CakeOrderDetail.vue";
import CakeCityList from "@/views/city/CakeCityList.vue";
import CakeExitAdress from "@/views/mine/CakeExitAdress.vue";
import CakeAddressList from "@/views/mine/CakeAddressList.vue";
import Setting from "@/views/mine/Setting.vue";
import SortPage from "@/views/sort/SortPage.vue";
import ProductList from "@/views/shop/ProductList.vue";
import GoodBooks from "@/views/cake/GoodBooks.vue";
Vue.use(Router)


const routes = [
    {
        path: '',
        redirect: "/index"
    },
    {
        path: '/helloWord',
        component: HelloWorld,
        meta: {
            title: 'helloWord'
        }
    }, {
        path: '/index',
        component: IndexView,
        meta: {
            title: '图书',
            // keepAlive:true
        }
    }, {
        path: '/sortPage',
        component: SortPage,
        meta: {
            title: '分类',
            keepAlive:true
        }
    }, {
        path: '/shopCart',
        component: ShopCart,
        meta: {
            title: '购物车'
        }
    }, {
        path: '/mine',
        component: PersonCenter,
        meta: {
            title: '我的',
            keepAlive:true
        }
    }, {
        path: '/order',
        component: OrderInfo,
        meta: {
            title: '我的订单',
            keepAlive:true
        }
    },
    {
        path: '/quickLogin',
        component: QuickLogin,
        meta: {
            title: '快捷登录'
        }
    },{
        path: '/login',
        component: Login,
        meta: {
            title: '登录'
        }
    },{
        path: '/hitList',
        component: AfternoonTea,
        meta: {
            title: '热销榜单',
            keepAlive:true
        }
    },{
        path: '/newBook',
        component: NiceBirthday,
        meta: {
            title: '新书上市',
            keepAlive:true
        }
    },{
        path: '/goodBooks',
        component: GoodBooks,
        meta: {
            title: '图书精选',
            keepAlive:true
        }
    },{
        path: '/productDetail',
        component: ProductDetail,
        meta: {
            title: '商品详情'
        }
    },{
        path: '/confirmOrder',
        component: ConfirmOrder,
        meta: {
            title: '确认订单'
        }
    },{
        path: '/cakeOrderDetail',
        component: CakeOrderDetail,
        meta: {
            title: '订单详情'
        }
    },{
        path: '/cakeCityList',
        component: CakeCityList,
        meta: {
            title: '城市'
        }
    },{
        path: '/cakeAddressList',
        component: CakeAddressList,
        meta: {
            title: '地址管理'
        }
    },{
        path: '/cakeExitAdress',
        component: CakeExitAdress,
        meta: {
            title: '添加地址'
        }
    },{
        path: '/setting',
        component: Setting,
        meta: {
            title: '设置',
            keepAlive:true
        }
    },
    {
        path: '/productList',
        component: ProductList,
        meta: {
            title: '商品列表'
        }
    },
]

const router = new Router({
    routes,
    // mode: 'history'
})
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location, onResolve, onReject) {

    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)

    return originalPush.call(this, location).catch(err => err)

}
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
//
//     document.body.scrollTop = 0
//
// // firefox
//
//     document.documentElement.scrollTop = 0
//
// // safari
//
//     window.pageYOffset = 0
    next()
})

export default router