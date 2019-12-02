export function clearObj(obj) {
  for (var item in obj) {
    obj[item] = null;
  }
  return obj;
};

export function hasNullProp(object) {
  if (JSON.stringify(object) == '{}') {
    return false;
  } else {
    for (var prop in object) {
      if (object[prop] === '') {
        return false;
      } else {
        return true;
      }
    }
  }
};

export function parseQueryString(str){
  let arr = [],
  length = 0,
  res = {};
  arr = str.split('&');
  length = arr.length;
  for(var i=0; i<length; i++){
      res[arr[i].split('=')[0]] = arr[i].split('=')[1];
  }
  console.log('就看你的了',res)
  return res;
}

//序列化对象
export function urlEncode (param, key, encode) {
  if(param==null) return '';  
  var paramStr = '';  
  var t = typeof (param);  
  if (t == 'string' || t == 'number' || t == 'boolean') {  
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);  
  } else {  
    for (var i in param) {  
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);  
      paramStr += urlEncode(param[i], k, encode);  
    }  
  }  
  return paramStr.substr(1);  
}
