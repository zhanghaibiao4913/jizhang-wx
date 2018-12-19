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
    <div class="login-btn" v-if="!isAuthUserInfo">
      <button type="primary" size="default" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo">登录</button>
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
  </div>
</template>

<script>
import util from '../../utils/util.js';

export default {
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
      isAuthUserInfo: true, // 默认已授权用户信息
      openMessage: false, // 留言弹窗
      message: '',
      openAbout: true,
    }
  },

  methods: {
    // 用户允许授权信息
    bindGetUserInfo(e) {
      console.log(e.mp.detail);
      let userInfo = e.mp.detail.userInfo || null;
      if (userInfo != null) {
        this.avatarUrl = userInfo.avatarUrl;
        this.nickName = userInfo.nickName;
        this.$wxApi.setItem('userInfo', userInfo);
        this.isAuthUserInfo = true;
        this.$api.updateUserInfo(this.uid, userInfo).then(res => {
          console.log(res);
        });
      }
    },
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
    sendMessage() {
      if (this.message != '') {
        this.$wxApi.showLoading('提交中...');
        this.$api.message(this.uid, this.message,).then(res => {
          this.$wxApi.hideLoading();
          if (res.code == 1) {
            this.closeMessage();
            this.$wxApi.showToast('提交成功');
          } else {
            this.$wxApi.showToast('提交失败，请重试');
          }
        });
      }
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
    this.$wxApi.getSetting('scope.userInfo').then(res => {
      console.log('是否授权用户信息:', res)
      this.isAuthUserInfo = res;
      if (res) {
        console.log('已授权')
        if (this.$wxApi.getItem('userInfo') == null) {
          this.$wxApi.showLoading('信息加载中...');
          this.$api.getUserInfo(this.uid).then(res => {
            if (res.code == 1) {
              let userInfo = res.d;
              this.avatarUrl = userInfo.avatarUrl;
              this.nickName = userInfo.nickName;
              this.$wxApi.setItem('userInfo', userInfo);
            } else {
              console.log(res.msg);
            }
            this.$wxApi.hideLoading();
          });
        } else {
          console.log(this.$wxApi.getItem('userInfo'));
          let userInfo = this.$wxApi.getItem('userInfo');
          this.avatarUrl = userInfo.avatarUrl;
          this.nickName = userInfo.nickName;
        }
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "./my.scss";
</style>
