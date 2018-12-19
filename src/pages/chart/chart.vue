<template>
  <div class="chart-page">
    <!-- <div class="header-bar">
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
    </div> -->
    <div class="chart-wrapper">
      <div class="charts">
        <div class="chart-wrapper">
          <mpvue-echarts :echarts="echarts" :onInit="initChart" canvasId="demo-canvas" />
        </div>
        <div class="chart-null" v-if="pieData.length == 0">记录为空</div>
      </div>
    </div>
    <div class="operation-box">
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
      <div class="budget-type-btn">
        <span :class="{ active: budgetId == 1}" @click="handleBudgetType(1)">支出</span>
        <span :class="{ active: budgetId == 2}" @click="handleBudgetType(2)">收入</span>
      </div>
    </div>
    <div class="footer-bar">
      <span>{{budgetName}}总额：</span>
      <span :class="budgetId == 1?'red':'green'">{{totalRmb}}</span>
    </div>
  </div>
</template>

<script>
import util from '../../utils/util.js';
import mpvueEcharts from "mpvue-echarts";
import * as echarts from "../../../static/echarts.min.js";
let Chart = null;

export default {
  components: { mpvueEcharts },
  data () {
    return {
      budgetId: 1,
      chartType: 1,
      currentMonth: this.initCurrentMonth(),
      echarts,
      initChart: this.initPieChart,
      pieData: []
    }
  },
  computed: {
    chartTitle() {
      return this.budgetId == 1 ? '支出占比' : '收入占比';
    },
    totalRmb() {
      let val = 0;
      this.pieData.forEach(item => {
        val += item.value;
      });
      return val;
    },
    budgetName() {
      return this.budgetId == 1 ? '支出' : '收入';
    }
  },

  methods: {
    // 切换支出/收入
    handleBudgetType(type) {
      this.budgetId = type;
      this.getDataList();
    },
    handleChartType(type) {
      this.chartType = type;
    },
    // 日期选择
    pickDate(e) {
      this.currentMonth = e.mp.detail.value;
      this.getDataList();
    },
    // 初始化当前月份
    initCurrentMonth() {
      let days = util.getDays();
      return days.substring(0, days.lastIndexOf('-'));
    },
    // 获取饼状图option
    getPieOption(pieData) {
      let option = {
        backgroundColor: '#2c343c',
        title: {
          text: this.chartTitle,
          left: 'center',
          top: 0,
          textStyle: {
            color: '#ccc'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}\n{c}"
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          // data: [
          //   {name: '饮食', value: 20},
          //   {name: '公交', value: 10}
          // ].sort(function (a, b) { return a.value - b.value; }),
          data: pieData.sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            position: 'outside',
            color: 'rgba(255, 255, 255, 1)',
            formatter: "{b}\n({d}%)"
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: '#0a6da1'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }]
      };
      return option;
    },
    // 初始化饼状图
    initPieChart(canvas, width, height) {
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(Chart);
      Chart.clear();
      return Chart;
    },
    // 获取数据
    getDataList() {
      this.$wxApi.showLoading('加载中...');
      this.$api.getAccountList(this.currentMonth, this.budgetId)
      .then(res => {
        // console.log(res)
        if (res.code == 1) {
          let data = res.d;
          this.pieData = this.getPieData(data);
          Chart.setOption(this.getPieOption(this.pieData));
          console.log('chart-----------------')
          this.$wxApi.hideLoading();
        } else {
          this.$wxApi.hideLoading();
        }
      }).catch(err => {
        this.$wxApi.hideLoading();
      });
    },
    // 将数据转换为扇形图所需要的数据[{name: '饮食', value: 100}]
    getPieData(arr) {
      let newArr = [];
      arr.forEach((item, i) => {
        let index = -1;
        let isExits = newArr.some((newItem, j) => {
          if (item.cname == newItem.name) {
            index = j;
            return true;
          }
        });
        if (!isExits) {
          newArr.push({
            value: item.rmb,
            name: item.cname
          });
        } else {
          newArr[index].value += item.rmb
        }
      });
      return newArr;
    }
  },

  created() {
  },
  mounted() {
    console.log('chart mounted')
    setTimeout(() => {
      this.getDataList();
    }, 500);
  }
}
</script>

<style lang="scss" scoped>
@import "./chart.scss";
</style>
