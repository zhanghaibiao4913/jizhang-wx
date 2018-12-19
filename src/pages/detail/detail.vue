<template>
  <div class="detail-page">
    <div class="header-bar">
      <div class="date-picker-wrapper">
        <picker
            mode="date"
            value="currentMonth"
            fields="month"
            @change="pickDate">
          <span>{{currentMonth + '月'}}</span>
          <span class="icon"></span>
        </picker>
      </div>
      <div class="category-btns">
        <div class="btn" @click="handleBudgetType(1)" :class="{ active: budgetId == 1}">支出</div>
        <div class="btn" @click="handleBudgetType(2)" :class="{ active: budgetId == 2}">收入</div>
      </div>
    </div>
    <div class="list-wrapper">
      <div class="item-day" v-for="(item, i) in dayList" :key="i">
        <div class="day-bar">
          <div>{{item.saveTime}}</div>
          <div>{{budgetId == 1? '-':'+'}}{{item.dayTotalRmb}}</div>
        </div>
        <div class="item-list">
          <div class="item" v-for="(account, j) in item.list" :key="j" @longpress="longpressEvent(account)">
            <span class="category">{{account.cname}}</span>
            <span class="remark">{{account.remark}}</span>
            <span class="rmb">{{budgetId == 1? '-':'+'}}{{account.rmb}}</span>
          </div>
        </div>
      </div>
      <div class="null-tips" v-if="dayList.length == 0">记录为空</div>
    </div>
    <div class="footer-bar">
      <span>{{budgetId == 1? '支出':'收入'}}总额：</span>
      <span :class="budgetId == 1?'red':'green'">{{monthTotalRmb}}</span>
    </div>
  </div>
</template>

<script>
import util from '../../utils/util.js';
export default {
  data () {
    return {
      budgetId: 1,
      currentMonth: this.initCurrentMonth(),
      dayList: [],
    }
  },
  created() {
    // console.log('detail created')
  },
  onLoad() {
    console.log('detail onLoad')
    this.loadData();
  },

  methods: {
    loadData() {
      this.$wxApi.showLoading('加载中...');
      this.$api.getAccountList(this.currentMonth, this.budgetId)
      .then(res => {
        // console.log(res)
        if (res.code == 1) {
          let data = res.d;
          let transData = this.transDate(data);
          // console.log(transData);
          let mapData = this.mapData(transData);
          // console.log(mapData);
          this.dayList = mapData;
          this.$wxApi.hideLoading();
        } else {
          this.$wxApi.hideLoading();
        }
      }).catch(err => {
        this.$wxApi.hideLoading();
      });
    },
    handleBudgetType(type) {
      this.budgetId = type;
      this.loadData();
    },
    initCurrentMonth() {
      let days = util.getDays();
      return days.substring(0, days.lastIndexOf('-'));
    },
    pickDate(e) {
      console.log(e.mp.detail.value);
      this.currentMonth = e.mp.detail.value;
      this.loadData();
    },
    // 将时间转为月-日
    transDate(data) {
      for(let i = 0; i < data.length; i++) {
        data[i].saveTime = util.getDateFromSaveTime(data[i].saveTime, 2);
      }
      return data;
    },
    // 将同一天的数据分组
    mapData(arr) {
      let newArr = [];
      arr.forEach((item, i) => {
        let index = -1;
        let alreadyExists = newArr.some((newItem, j) => {
          if (item.saveTime == newItem.saveTime) {
            index = j;
            return true;
          }
        });
        if (!alreadyExists) {
          newArr.push({
            saveTime: item.saveTime,
            list: [item],
            dayTotalRmb: item.rmb
          });
        } else {
          newArr[index].list.push(item);
          newArr[index].dayTotalRmb = this.getDayTotalRmb(newArr[index].list)
        }
      });
      return newArr;
    },
    getDayTotalRmb(list) {
      let val = 0;
      list.forEach(item => {
        val += item.rmb;
      });
      return val;
    },
    longpressEvent(item) {
      console.log(item);
      this.$wxApi.showActionSheet(['删除']).then(res => {
        console.log(res);
        if (res.name == '删除') {
          this.$api.deleteAccount(item.accountId).then(res => {
            if (res.code == 1) {
              this.$wxApi.showToast('删除成功');
              this.loadData();
            } else {
              this.$wxApi.showToast('删除失败，请重试');
            }
          });
        }
      }).catch(err=>{
        console.log('取消');
      });
    }
  },
  computed: {
    monthTotalRmb() {
      let val = 0;
      this.dayList.forEach(item => {
        val += item.dayTotalRmb;
      });
      return val;
    }
  }

}
</script>

<style lang="scss" scoped>
@import "./detail.scss";
</style>
