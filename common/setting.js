export const throttle = wait => fn => {
    var timer;
    return (...args) => {
      if (!timer) {
        timer = setTimeout(() => timer = null, wait);
        return fn(...args);
      }
    }
}

export const debounce = wait => fn => {
    var timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, wait)
    }
}

export const randomNum = function (minNum,maxNum) {
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
        break; 
    } 
}

export const getDate = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
}

export const getDateYYMMDD = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    var day = date.getDate() < 10 ? `0${date.getDate()+1}` : date.getDate();
   
    return `${year}-${month}-${day}`
}

// 根据当前日期返回最近一周的日期
export const getTheWeekDaysYYMMDD = (y, m, d) => {
    var currentDate = new Date(y, m, d)
    var timesStamp = currentDate.getTime();
    var currenDay = currentDate.getDay();
    var dates = [];
    for (var i = 0; i < 7; i++) {
        dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '-'));
    }
    return reverseDates(dates)
}

export const getTheMounthDaysYYMMDD = (y, m, d) => {
    var dates = [];
    var thisMounthDays = getDaysInOneMonth(y, m);
    for (var i = 0; i < thisMounthDays; i++) {
        dates.push(`${y}-${(m + '').length < 2 ? 0 + '' + m : m}-${i+1 < 10 ? 0 + ''+ (i + 1) : i + 1}`)
    }
    return dates
}

function getDaysInOneMonth(year, month){
    month = parseInt(month, 10);
    var d= new Date(year, month, 0);
    return d.getDate();
}

export const getLastDate = (y, m, d) => {
    var currentDate = new Date(y, m, d)
    var timesStamp = currentDate.getTime();
    var date = new Date(timesStamp - 24 * 60 * 60 * 1000 ).toLocaleDateString().replace(/\//g, '-');
    let year = date.split('-')[2];
    let mounth = date.split('-')[0];
    let day = date.split('-')[1];
    return `${year}-${mounth}-${day}`
}

export const getNextDate = (y, m, d) => {
    var currentDate = new Date(y, m, d)
    var timesStamp = currentDate.getTime();
    var date = new Date(timesStamp + 24 * 60 * 60 * 1000 ).toLocaleDateString().replace(/\//g, '-');
    let year = date.split('-')[2];
    let mounth = date.split('-')[0];
    let day = date.split('-')[1];
    return `${year}-${mounth}-${day}`
}

function reverseDates(dates) {
    return dates.map(i => {
        let year = i.split('-')[2];
        let mounth = i.split('-')[0];
        let day = i.split('-')[1];
        return `${year}-${mounth < 10 ? 0 + mounth : mounth}-${day <10 ? 0 + day : day}`
    })
}


export function Base64() {
 
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
 
    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
 
    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
        return utftext;
    }
 
    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

export const getDateByDate = (date) => {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
}