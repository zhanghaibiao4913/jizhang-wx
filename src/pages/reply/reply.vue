<template>
  <div class="reply-page">
    <div class="list-wrapper">
      <div class="item" v-for="(item, index) in replyList" :key="index">
        <div class="content">{{item.content}}</div>
        <div class="bottom">
          <span class="time">{{item.time}}</span>
          <span class="icon" v-if="item.global==1">系统</span>
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
      console.log(arr)
      return arr;
    },
  },
  onLoad() {
    console.log('reply onLoad');
    this.$wxApi.showLoading('加载中...');
    this.$api.getReplyList(this.uid).then(res => {
      console.log(res);
      this.$wxApi.hideLoading();
      if (res.code == 1) {
        let data = res.d;
        this.replyList = this.formatTime(data);
      } else {
        console.log(res.msg);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "./reply.scss";
</style>
