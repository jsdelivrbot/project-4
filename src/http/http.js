import Vue from 'vue';
import axios from 'axios'
import store from '../vuex/store'
import router from '../router'


axios.interceptors.request.use(
    config => {
        //console.log(config);
        //let user_token = store.state.userInfo.access_token;
        sessionStorage.setItem("user_token",'C9A72807-93F4-4213-9297-820A333192D6')
        var user_token = sessionStorage.getItem("user_token")
        if (user_token) {
            config.headers.UserToken = user_token;
            config.headers.Authorization = `Bearer ${user_token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

export default axios;