<template>
  <div class="login-page" v-if="show">
		<div class="mask">
			<div class="content">
				<div class="tips">{{title}}</div>
				<div class="btns-wrapper">
					<div class="btn cancel-btn" v-if="closeable == true" @click="close">取消</div>
					<button class="btn" type="primary" size="default" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo">登录</button>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
	props: ['title', 'closeable'],
  data() {
		return {
			show: false,
			userInfo: null,
			uid: -1
		}
	},
	watch: {
		// isGetUid(newVal, oldVal) {
		// 	console.log('initFlag', newVal);
		// }
	},
	methods:{ 
		close() {
			this.show = false;
		},
		sendUserInfo() {
			this.$emit('userInfo', this.userInfo);
		},
		async bindGetUserInfo(e) {
      console.log(e.mp.detail);
      let userInfo = e.mp.detail.userInfo || null;
      if (userInfo != null) {
        this.userInfo = userInfo;
				this.$wxApi.setItem('userInfo', userInfo);
				this.$wxApi.showLoading('加载中...');
				let res = await this.$api.updateUserInfo(this.uid, userInfo);
				this.$wxApi.hideLoading();
				if (res.code == 1) {
					this.sendUserInfo();
					this.close();
				} else {
					this.$wxApi.showToast('加载失败，请重试');
				}
      }
    },
		async initUserInfo() {
			console.log('uid:', this.uid);
      let res = await this.$wxApi.getSetting('scope.userInfo');
      this.show = !res;
      if (res) {
        console.log('已授权');
        if (this.$wxApi.getItem('userInfo') == null) {
          this.$wxApi.showLoading('信息加载中...');
          let res = await this.$api.getUserInfo(this.uid);
          this.$wxApi.hideLoading();
          if (res.code == 1) {
						console.log(res.d);
            this.userInfo = res.d;
						this.$wxApi.setItem('userInfo', this.userInfo);
						this.sendUserInfo();
          } else {
            console.log(res.msg);
          }
        } else {
          console.log(this.$wxApi.getItem('userInfo'));
					this.userInfo = this.$wxApi.getItem('userInfo');
					this.sendUserInfo();
        }
      } else {
				console.log('未授权');
			}
		},
		async wxLogin() {
      if (this.$wxApi.getItem('uid') == null) {
        let jsCode = await this.$wxApi.getJsCode();
        console.log(jsCode)
        if (jsCode) {
          let res = await this.$api.wxLogin(jsCode);
          if (res.code == 1) {
						this.uid = res.d.uid;
						this.$wxApi.setItem('uid', res.d.uid);
						this.initUserInfo();
          } else {
						console.log(res)
            console.log('登录失败');
          }
        }
      } else {
				this.uid = this.$wxApi.getItem('uid');
				this.initUserInfo();
			}
    }
	},
	onLoad() {
		console.log('login onLoad');
		this.wxLogin();
	}
}
</script>

<style lang="scss" scoped>
@import "./login.scss";
</style>
