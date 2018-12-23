export default {
	getJsCode: () => {
		return new Promise((resolve, reject) => {
			wx.login({
				success: (res) => {
					console.log(res);
					resolve(res.code);
				},
				fail: (err) => {
					console.log(err);
					reject(err);
				}
			});
		});
	},
	getItem: (key) => {
		let value = wx.getStorageSync(key);
		if (value) {
			return typeof JSON.parse(value) == "object" ? JSON.parse(value): value;
		} else {
			return null;
		}
	},
	setItem: (key, value) => {
		let val = typeof value == 'object' ? JSON.stringify(value): value;
		wx.setStorageSync(key, val)
	},
	removeItem: (key) => {
		wx.removeStorageSync(key);
	},
	showLoading: (title) => {
		wx.showLoading({
			title: title,
			mask: true
		});
	},
	hideLoading: () =>{
		wx.hideLoading();
	},
	showToast: (title) => {
		wx.showToast({
			title: title,
			icon: 'none'
		});
	},
	hideToast: () => {
		wx.hideToast();
	},
	// 根据参数获取授权情况
	getSetting(scope) {
		return new Promise((resolve, reject) => {
			wx.getSetting({
				success: (res) => {
					if (res.authSetting[scope]) {
						resolve(true);
					} else {
						resolve(false);
					}
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	},
	showActionSheet: (arr) => {
		return new Promise((resolve, reject) => {
			wx.showActionSheet({
				itemList: arr,
				success(res) {
					console.log(res.tapIndex);
					resolve({name: arr[res.tapIndex]});
				},
				fail(res) {
					console.log(res.errMsg);
					reject(res.errMsg);
				}
			});
		});
	},
	showModal(content) {
		return new Promise((resolve, reject) => {
			wx.showModal({
				title: '提示',
				content: content,
				success(res) {
					if (res.confirm) {
						console.log('用户点击确定');
						resolve(true)
					} else if (res.cancel) {
						console.log('用户点击取消')
						resolve(false);
					}
				}
			});
		});
	}
}