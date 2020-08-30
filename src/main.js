import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
    debug: false,
    connection: 'http://localhost:3000',
    options: {
        autoConnect:false
    }
}))

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
// render: function (createElement) {
//     return createElement(App);
// }

// Vue.js 里面的 createElement 函数，这个函数的作用就是生成一个 VNode节点，
// render 函数得到这个 VNode 节点之后，返回给 Vue.js 的 mount 函数，
// 渲染成真实 DOM 节点，并挂载到根节点上。

// new Vue = ({
//     el: "#App",
//     components: {
//         App
//     },
//     template: '<App/>',

// })
