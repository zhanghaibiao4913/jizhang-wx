<template>
  <div class="reply-page">
    <div class="list-wrapper">
      <div class="item" v-for="(item, index) in replyList" :key="index">
        <div class="content">{{item.content}}</div>
        <div class="bottom">
          <span class="time">{{item.time}}</span>
          <span class="icon" v-if="item.global==1">系统</span>
          <span class="icon" v-if="item.global==0">回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../utils/util.js';

export default {
  data () {
    return {
      replyList: []
    }
  },
  methods: {
    formatTime(arr) {
      arr.forEach(item => {
        item.time = util.formatTimeString(item.time);
      });
      console.log(arr);
      return arr;
    },
    async init() {
      this.$wxApi.showLoading('加载中...');
      let res = await this.$api.getReplyList(this.$wxApi.getItem('uid'));
      this.$wxApi.hideLoading();
      if (res.code == 1) {
        let data = res.d;
        this.replyList = this.formatTime(data);
      } else {
        console.log(res.msg);
      }
    }
  },
  onLoad() {
    this.init();
  }
}
</script>

<style lang="scss" scoped>
@import "./reply.scss";
</style>
