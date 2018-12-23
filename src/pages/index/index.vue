<template>
  <div class="index-page">
    <div class="jizhang-wrapper">
      <Jizhang :account="accountData" ref="childObj"></Jizhang>
    </div>
    <div class="bottom-wrapper">
      <div class="save-btn" @click="save()">保存</div>
      <button class="share-btn" type="primary" open-type="share">分享给朋友</button>
    </div>
  </div>
</template>

<script>
import util from '../../utils/util.js'
import Jizhang from "../../components/jizhang/jizhang"

export default {
  components: { Jizhang },
  data () {
    return {
      accountData: {}
    }
  },
  methods: {
    // 保存
    async save() {
      console.log('save');
      let child = this.$refs.childObj;
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
      }
    }
  },
  created() {
    console.log('index created');
    if (this.$wxApi.getItem('uid') == null) {
      this.$wxApi.getJsCode().then(jsCode => {
        this.$api.wxLogin(jsCode).then(res => {
          console.log(res)
          if (res.code == 1) {
            this.$wxApi.setItem('uid', res.d.uid);
          } else {
            console.log('登录失败');
          }
        });
      });
    }
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
