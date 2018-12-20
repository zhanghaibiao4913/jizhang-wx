<template>
  <div class="index-page">
    <div class="tab-wrapper">
      <div class="tab-content">
        <div class="tab-item" @click="tabBudget(1)" :class="{ active: budgetId == 1}">支出</div>
        <div class="tab-item" @click="tabBudget(2)" :class="{ active: budgetId == 2}">收入</div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="item-wrapper">
        <div class="icon money"></div>
        <div class="title">金额：</div>
        <div class="input-wrapper"><input type="number" placeholder="输入金额" v-model="rmb"></div>
      </div>
      <div class="item-wrapper" @click="openCategory">
        <div class="icon category"></div>
        <div class="title">分类：</div>
        <div class="current-category">{{currentCategory.cname}}</div>
        <div class="icon arrow"></div>
      </div>
      <div class="item-wrapper">
        <div class="icon date"></div>
        <div class="title">日期：</div>
        <div class="date-pick-wrapper">
          <picker
            mode="date"
            value="currentDate"
            @change="pickDate">
            <div class="date-value">{{currentDate}}</div>
          </picker>
        </div>
      </div>
      <div class="item-wrapper remarks">
        <div class="icon remarks"></div>
        <div class="title">备注：</div>
        <div class="remarks-text">
          <input type="text" maxlength="10" placeholder="10个字以内" v-model="remark">
        </div>
      </div>
      <div class="save-btn" @click="save()">保存</div>
      <button class="share-btn" type="primary" open-type="share">分享给朋友</button>
    </div>
    <Category :toggle="showCategory" :categoryData="getCurrentList"
     :activeItem="currentCategory"
     @cancel="closeCategory"
     @confirm="confirmCategory">
    </Category>
  </div>
</template>

<script>
// const regeneratorRuntime = require('../../utils/regenerator-runtime.js')
import util from '../../utils/util.js';
import Category from "../../components/category/category"

export default {
  components: {Category},
  data () {
    return {
      budgetId: 1, // 默认支出
      currentCategory: { // 当前分类
        cname: '',
        cid: -1
      },
      categoryList: [], // 所有分类数据
      currentDate: util.getDays(), // 当天日期
      showCategory: false, // 默认不显示分类选择页面
      remark: '', // 备注
      rmb: '', // 金额
    }
  },
  methods: {
    // 支出/收入切换
    tabBudget(id) {
      if (id == this.budgetId) return;
      this.budgetId = id;
      this.initCurrentCategory();
    },
    // 保存
    save() {
      console.log('save');
      if (this.rmb > 0) {
        let rmb = this.rmb;
        let cid = this.currentCategory.cid;
        let saveTime = `${this.currentDate} ${util.getTimes()}`;
        let remark = this.remark;
        let budgetId = this.budgetId;
        let uid = this.$wxApi.getItem('uid');
        this.$wxApi.showLoading('保存中...');
        this.$api.addAccount(rmb, cid, saveTime, remark, budgetId, uid).then(res => {
          if (res.code == 1) {
            this.$wxApi.showToast('保存成功');
            this.resetStatus();
          } else {
            this.$wxApi.showToast('保存失败，请重试');
          }
          this.$wxApi.hideLoading();
        }).catch(err => {
          this.$wxApi.showToast('保存失败，请重试');
          this.$wxApi.hideLoading();
        });
      }
    },
    // 保存后重置数据
    resetStatus() {
      this.rmb = '';
      this.remark = '';
    },
    // 设置当前分类
    initCurrentCategory() {
      if (this.$wxApi.getItem(`currentCategory_${this.budgetId}`) == null) {
        this.currentCategory = this.getCurrentList[0];
      } else {
        console.log(`currentCategory_${this.budgetId}`)
        this.currentCategory = this.$wxApi.getItem(`currentCategory_${this.budgetId}`);
      }
    },
    // 获取支出(收入)分类
    getCategoryByBudgeId: (budgetId) => {
      let arr = this.categoryList.filter(item => {
        return item.budgetId == budgetId;
      });
      return arr;
    },
    // 日期选择
    pickDate(e) {
      console.log('pickDate', e.mp.detail.value);
      this.currentDate = e.mp.detail.value;
    },
    // 打开分类选择页面
    openCategory() {
      this.showCategory = true;
    },
    // 关闭分类选择页面
    closeCategory() {
      this.showCategory = false;
    },
    // 确认分类选择
    confirmCategory(item) {
      console.log(item.cname);
      this.currentCategory = item;
      this.closeCategory();
      this.$wxApi.setItem(`currentCategory_${this.budgetId}`, item);
    }
  },
  computed:{
    getCurrentList: function() {
      let arr = this.categoryList.filter(item => {
        return item.budgetId == this.budgetId;
      });
      return arr;
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
            console.log('登录失败')
          }
        });
      });
    }
  },
  onLoad() {
    console.log('index onLoad');
    this.$api.getCategory().then(res => {
      console.log(res);
      if (res.code == 1) {
        this.categoryList = res.d;
        this.initCurrentCategory();
      }
    });
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
