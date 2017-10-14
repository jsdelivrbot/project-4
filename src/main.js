import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import 'babel-polyfill';
import { Vue2Dragula } from 'vue2-dragula'
import VueResource from 'vue-resource';
import axios from './http/http.js';
import iView from 'iview';
import Vuex from 'vuex';
import TXPlugin from './TXPlugin.js'
import store from '../src/vuex/store.js';
import 'iview/dist/styles/iview.css'; // 使用 CSS
import '../static/jqueryui/jquery-ui.js';
import '../static/jqueryui/jquery-ui.min.css';
Vue.use(VueResource);
Vue.use(iView);
Vue.use(Vuex);
Vue.use(TXPlugin);
Vue.http.headers.common['UserToken'] = '0C052C31-C051-4913-9FA6-C7643FA049FB';
Vue.use(Vue2Dragula, {
    logging: {
        directive: true,
        plugin: true,
        service: true,
        dragHandler: true
    }
})

Vue.prototype.axios = axios
Vue.http.interceptors.push((request, next) => {
    var token = sessionStorage.getItem('user_token');
    request.headers.set('Authorization', `Bearer ${token}`)
    next(response => {
        return response
    })
});


Vue.config.productionTip = false;
Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;

new Vue({
    el: '#app',
    router,
    render: h => h(App),
    store
})