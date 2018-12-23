<template>
  <div class="index-page">
    <div class="jizhang-wrapper">
      <Jizhang :account="accountData" ref="JizhangComponent"></Jizhang>
    </div>
    <div class="bottom-wrapper">
      <div class="save-btn" @click="save()">保存</div>
      <button class="share-btn" type="primary" open-type="share">分享给朋友</button>
    </div>
    <Login title="授权登录" :closeable="true"></Login>
  </div>
</template>

<script>
import util from '../../utils/util.js'
import Jizhang from "../../components/jizhang/jizhang"
import Login from "../../components/login/login"

export default {
  components: { Jizhang, Login },
  data () {
    return {
      accountData: {}
    }
  },
  methods: {
    // 保存
    async save() {
      console.log('save');
      let child = this.$refs.JizhangComponent;
      if (child.rmb > 0) {
        let rmb = child.rmb;
        let cid = child.cid;
        let saveTime = `${child.currentDate} ${util.getTimes()}`;
        let remark = child.remark;
        let budgetId = child.budgetId;
        let uid = this.$wxApi.getItem('uid');
        this.$wxApi.showLoading('保存中...');
        let res = await this.$api.addAccount(rmb, cid, saveTime, remark, budgetId, uid)
        this.$wxApi.hideLoading();
        if (res.code == 1) {
          this.$wxApi.showToast('保存成功');
          child.clear();
        } else {
          this.$wxApi.showToast('保存失败，请重试');
        }
      } else {
        this.$wxApi.showToast('请输入金额')
      }
    },
  },
  created() {
    console.log('index created');
  },
  onLoad() {
    console.log('index onLoad');
  },
  onShareAppMessage() {
    return {
      title: '送你一个宝账',
      imageUrl: '../../static/images/logo.jpg'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
