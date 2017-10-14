import Vue from 'vue';
import axios from 'axios'
import store from '../vuex/store'
import router from '../router'


axios.interceptors.request.use(
    config => {
        //console.log(config);
        //let user_token = store.state.userInfo.access_token;UserToken
        //var user_token = sessionStorage.getItem("user_token");
        var user_token ='Bearer C9D5786E-3039-4732-AD0E-7CEE4B2D195F'
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