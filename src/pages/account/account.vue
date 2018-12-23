<template>
  <div class="account-page">
    <div class="jizhang-wrapper">
      <Jizhang :account="accountData" ref="childObj"></Jizhang>
    </div>
    <div class="bottom-wrapper">
      <div class="btn update-btn" @click="save">修改保存</div>
      <div class="btn delete-btn" @click="deleteAccount">删除</div>
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
    // 修改
    async save() {
      console.log('save');
      let child = this.$refs.childObj;
      if (child.rmb > 0) {
        let rmb = child.rmb;
        let cid = child.cid;
        let saveTime = `${child.currentDate} ${util.getTimes()}`;
        let remark = child.remark;
        let budgetId = child.budgetId;
        let accountId = this.accountData.accountId;
        this.$wxApi.showLoading('修改中...');
        let res = await this.$api.updateAccount(rmb, cid, saveTime, remark, budgetId, accountId);
        this.$wxApi.hideLoading();
        if (res.code == 1) {
          this.$wxApi.showToast('修改成功');
          wx.navigateBack();
        } else {
          this.$wxApi.showToast('修改失败，请重试');
        }
      }
    },
    async deleteAccount() {
      let isDelete = await this.$wxApi.showModal('确定删除吗？');
      if (isDelete) {
        this.$wxApi.showLoading('删除中...');
        let res = await this.$api.deleteAccount(this.accountData.accountId);
        this.$wxApi.hideLoading();
        if (res.code == 1) {
          this.$wxApi.showToast('删除成功');
          wx.navigateBack();
        } else {
          this.$wxApi.showToast('删除失败，请重试');
        }
      }
    }
  },
  created() {
  },
  onLoad(options) {
    console.log('account onLoad');
    let data = JSON.parse(options.item);
    this.accountData = data;
    console.log(data);
  }
}
</script>

<style lang="scss" scoped>
@import "./account.scss";
</style>
