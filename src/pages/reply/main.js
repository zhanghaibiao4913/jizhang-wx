import Vue from 'vue'
import App from './reply'

const app = new Vue(App)
app.$mount();

export default {
  config: {
    "navigationBarTitleText": "系统消息",
  }
}
