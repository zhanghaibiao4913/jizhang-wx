
const requestPromise = (fn) => { // promise处理
	return function (obj = {}) {
		return new Promise((resolve, reject) => {
			obj.success = (res) => {
				resolve(res.data);
			}
			obj.fail = (res) => {
				reject(res);
			}
			fn(obj);
		});
	}
};

const getRequest = requestPromise(wx.request);

const request = (method, url, data = {}) => { // method为请求方法，url为接口路径，data为传参
	let contentRype = method == 'get' ? 'application/json': 'application/x-www-form-urlencoded';
  return getRequest({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': contentRype
    }
  });
};

export default  {
	request
}