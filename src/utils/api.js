const CONFIG = require('./config.js');
import REQ from './request.js';

const host = CONFIG.host;
export default  {
	wxLogin: params =>  REQ.request('post', host + '/wxLogin', {jsCode: params}),
	getCategory: () => REQ.request('get', host + '/getCategory'),
	addAccount: (rmb, cid, saveTime, remark, budgetId, uid) => {
		return REQ.request('post', host + '/addAccount', {
			rmb: rmb,
			cid: cid,
			saveTime: saveTime,
			remark: remark,
			budgetId: budgetId,
			uid: uid
		});
	},
	getAccountList: (time, budgetId) => {
		return REQ.request('post', host + '/getAccountList', {
			time: time,
			budgetId: budgetId
		});
	},
	updateUserInfo: (uid, userInfo) => {
		return REQ.request('post', host + '/updateUserInfo', {
			uid: uid,
			nickName: userInfo.nickName,
			avatarUrl: userInfo.avatarUrl,
			country: userInfo.country,
			province: userInfo.province,
			city: userInfo.city,
			gender: userInfo.gender
		});
	},
	getUserInfo: (uid) => {
		return REQ.request('get', host + '/getUserInfo', {
			uid: uid
		});
	},
	message: (uid, message) => {
		return REQ.request('post', host + '/message', {
			uid: uid,
			msg: message
		});
	},
	getReplyList: (uid) => {
		return REQ.request('get', host + '/getReplyList', {
			uid: uid
		});
	},
	deleteAccount: (accountId) => {
		return REQ.request('post', host + '/deleteAccount', {
			accountId: accountId
		});
	},
}