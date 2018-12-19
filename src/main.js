import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false
App.mpType = 'app'

import api from './utils/api.js' // 引用接口处理文件api.js
import wxApi from './utils/wxApi.js';
Vue.prototype.$api = api;
Vue.prototype.$wxApi = wxApi;
// console.log(regeneratorRuntime)
const app = new Vue(App)
app.$mount();
