function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export default {
  formatTime: (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    let t1 = [year, month, day].map(formatNumber).join('/');
    let t2 = [hour, minute, second].map(formatNumber).join(':');

    return `${t1} ${t2}`;
  },

  // 获取年月日
  getDays: () => {
    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let days = [year, month, day].map(formatNumber).join('-');

    return days;
  },
  // 获取时分秒
  getTimes: () => {
    let date = new Date();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    let times = [hour, minute, second].map(formatNumber).join(':');
    return times;
  },
  // type:1取年月，type：0取月日
  getDateFromSaveTime: (saveTime, type) => {
    let days = saveTime.split('T')[0];
    let result = '';
    if (type == 1) {
      let endIndex = days.lastIndexOf('-');
      result = days.substring(0, endIndex);
    } else if (type == 2) {
      let startIndex = days.indexOf('-');
      result = days.substring(startIndex + 1);
    }
    return result;
  },
  // 随机生成字母
  getRandomLetter: (length) => {
    let result = [];
    for(let i = 0; i < length; i++){
      let ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
      //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
      result.push(String.fromCharCode(65+ranNum));
    }
    return  result.join('');
  },
  formatTimeString: (time) => {
    let str = time.replace(/\T/, ' ').replace(/\.000Z/, '');
    return str.substring(0, str.lastIndexOf(':'));
  }
}
