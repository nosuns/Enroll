function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTimeDateOnly(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function parseDay(day) {
    var dayStr;
    switch(day) {
      case 0:
        dayStr = '(星期日)';
        break;
      case 1:
        dayStr = '(星期一)';
        break;
      case 2:
        dayStr = '(星期二)';
        break;
      case 3:
        dayStr = '(星期三)';
        break;
      case 4:
        dayStr = '(星期四)';
        break;
      case 5:
        dayStr = '(星期五)';
        break;
      case 6:
        dayStr = '(星期六)';
        break;
    }

    return dayStr;
  }



module.exports = {
  formatTime: formatTime,
  formatTimeDateOnly: formatTimeDateOnly,
  parseDay: parseDay,
}
