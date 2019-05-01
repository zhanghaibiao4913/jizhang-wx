<template>
  <div class="jizhang-page">
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
        <div class="input-wrapper"><input type="digit" placeholder="输入金额" v-model="rmb"></div>
      </div>
      <div class="item-wrapper" @click="openCategorySelect">
        <div class="icon category"></div>
        <div class="title">分类：</div>
        <div class="current-category">{{cname}}</div>
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
        <div class="input-wrapper">
          <input type="text" maxlength="10" placeholder="10个字以内" v-model="remark">
        </div>
      </div>
    </div>
    <div class="category-page" v-if="showCategory">
			<div class="mask">
				<div class="content">
					<div class="list-wrapper">
						<div class="item" v-for="item in categoryData" :key="item.cid" 
							:class="{ active: selectCid == item.cid}"
							@click="selectCategoryEvent(item)">{{item.cname}}
						</div>
					</div>
					<div class="btns-wrapper">
						<div class="btn cancel-btn" @click="showCategory = false">取消</div>
						<div class="btn confirm-btn" @click="handleConfirm">确定</div>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import util from '../../utils/util.js';

export default {
	props: ['account'],
  data () {
    return {
      budgetId: this.account.budgetId || 1, // 默认支出
			cname: '',
			cid: -1,
      currentDate: this.account.saveTime || util.getDays(), // 当天日期
      remark: this.account.remark || '', // 备注
			rmb: this.account.rmb || '', // 金额
      showCategory: false, // 默认不显示分类选择页面
      categoryList: [], // 所有分类数据
			categoryData: [], // 收(支)分类数据
			selectCid: -1,
			selectCname: '',
    }
	},
	watch: {
		cid(newVal, oldVal) {
			this.selectCid = this.cid;
		},
		account(val) {
			console.log('watch:', val.remark);
			// this.account = val;
			this.updatePage(val);
		}
	},
  methods: {
    // 支出/收入切换
    tabBudget(id) {
      if (id == this.budgetId) return;
      this.budgetId = id;
			this.categoryData = this.getCategoryData();
			this.initDefaultCategory();
		},
		getCategoryData() {
			let arr = this.categoryList.filter(item => {
        return item.budgetId == this.budgetId;
			});
			return arr;
		},
    // 日期选择
    pickDate(e) {
      console.log('pickDate', e.mp.detail.value);
      this.currentDate = e.mp.detail.value;
    },
		setItem() {
			this.$wxApi.setItem(`currentCategory_${this.budgetId}`, {cname:this.cname, cid:this.cid});
		},
		getItem() {
			return this.$wxApi.getItem(`currentCategory_${this.budgetId}`);
		},
		async initCategoryList() {
			let data = await this.$api.getCategory();
			if (data.code == 1) {
				console.log('分类', data.d);
				this.categoryList = data.d;
				this.categoryData = this.getCategoryData();
				this.initDefaultCategory();
			}
		},
		initDefaultCategory() {
			if (!this.account.cname) {
				if (this.getItem() == null) {
						this.cname = this.categoryData[0].cname;
						this.cid = this.categoryData[0].cid;
				} else {
					this.cname = this.getItem().cname;
					this.cid = this.getItem().cid;
				}
			} else {
				this.cname = this.account.cname;
				this.cid = this.account.cid;
			}
		},
		openCategorySelect() {
			this.showCategory = true;
			this.selectCid = this.cid;
		},
		selectCategoryEvent(item) {
			console.log(item.cname);
			this.selectCid = item.cid;
			this.selectCname = item.cname;
		},
		// 确认分类选择
    handleConfirm() {
			this.cid = this.selectCid;
			this.cname = this.selectCname;
      this.setItem();
      this.showCategory = false;
		},
		clear() {
			this.rmb = '';
			this.remark = '';
		},
		updatePage(val) {
			this.budgetId = val.budgetId;
			this.cname = val.cname;
			this.cid = val.cid;
      this.currentDate = val.saveTime;
      this.remark = val.remark;
			this.rmb = val.rmb;
		}
  },
  onLoad() {
		console.log('jizhang:',this.account);
		this.initCategoryList();
	},
	onShow() {
	}
}
</script>

<style lang="scss" scoped>
@import "./jizhang.scss";
</style>
