<template>
  <div class="my-page">
    <div class="user-info-wrapper">
      <div class="avatar"><img :src="avatarUrl" alt="用户头像"></div>
      <div class="user-info">
        <div class="nickName">昵称：{{nickName}}</div>
        <div class="user-id">ID：{{getID}}</div>
      </div>
    </div>
    <div class="list-wrapper">
      <div class="item" v-for="(item, index) in domList" :key="index" @click="domClick(item)">
        <span>{{item.name}}</span>
        <span class="icon"></span>
      </div>
    </div>
    <div class="message-wrapper" v-if="openMessage">
      <div class="mask">
        <div class="content">
          <div class="message-input">
            <span>留言反馈</span>
            <textarea placeholder="30个字以内" maxlength="30" v-model="message"/>
          </div>
          <div class="btns">
            <div class="btn cancel" @click="closeMessage">取消</div>
            <div class="btn confirm" @click="sendMessage">提交</div>
          </div>
        </div>
      </div>
    </div>
    <div class="about-me" v-if="openAbout">
      <div class="mask" @click="openAbout = false">
        <div class="about-content" @click.stop="">
          <span class="author">created by zhb</span>
          <span class="email">email: zhb_hym@qq.com</span>
        </div>
      </div>
    </div>
    <Login title="请先登录" :closeable="false" @userInfo="getUserInfo"></Login>
  </div>
</template>

<script>
import util from '../../utils/util.js';
import Login from "../../components/login/login";

export default {
  components: { Login },
  data () {
    return {
      avatarUrl: '../../../static/images/default_avatar.png',
      nickName: '',
      uid: '',
      domList: [
        {id: 1, name: '留言反馈'},
        {id: 2, name: '系统消息'},
        {id: 3, name: '关于作者'}
      ],
      openMessage: false, // 留言弹窗
      message: '',
      openAbout: false,
    }
  },

  methods: {
    domClick(data) {
      console.log(data.name);
      if (data.id == 1) {
        this.openMessage = true;
      } else if (data.id == 2){
        let url = '../reply/main';
        wx.navigateTo({ url });
      } else if (data.id == 3) {
        this.openAbout = true;
      }
    },
    closeMessage() {
      this.openMessage = false;
      this.message = '';
    },
    async sendMessage() {
      if (this.message != '') {
        this.$wxApi.showLoading('提交中...');
        let res = await this.$api.message(this.uid, this.message);
        this.$wxApi.hideLoading();
        if (res.code == 1) {
          this.closeMessage();
          this.$wxApi.showToast('提交成功');
        } else {
          this.$wxApi.showToast('提交失败，请重试');
        }
      } else {
        this.$wxApi.showToast('请输入内容');
      }
    },
    getUserInfo(data) {
      console.log('my userInfo', data);
      this.avatarUrl = data.avatarUrl;
      this.nickName = data.nickName;
    }
  },
  computed: {
    getID() {
      return util.getRandomLetter(9) + this.uid;
    }
  },
  onLoad () {
    console.log('my onLoad');
    this.uid = this.$wxApi.getItem('uid');
  }
}
</script>

<style lang="scss" scoped>
@import "./my.scss";
</style>
