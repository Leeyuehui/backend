
function transformRequest(data, headers) {
    /* 把类似content-type这种改成Content-Type */
       let keys = Object.keys(headers);
       let normalizedName = 'Content-Type';
       keys.forEach(name => {
         if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
           headers[normalizedName] = headers[name];
           delete headers[name];
         }
       });
       // if (isFormData(data) ||
       //   isArrayBuffer(data) ||
       //   isStream(data) ||
       //   isFile(data) ||
       //   isBlob(data)
       // ) {
       //   return data;
       // }
       // if (isURLSearchParams(data)) {
       //   setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
       //   return data.toString();
       // }
       /* 这里是重点，其他的其实可以照着axios的源码抄 */
       /* 这里就是用来解决POST提交json数据的时候是直接把整个json放在request payload中提交过去的情况
        * 这里简单处理下，把 {name: 'admin', pwd: 123}这种转换成name=admin&pwd=123就可以通过
        * x-www-form-urlencoded这种方式提交
        * */
       if (isObject(data)) {
         setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
         let keys2 = Object.keys(data);
         /* 这里就是把json变成url形式，并进行encode */
         return encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&'));
       }
       return data;
};

function setContentTypeIfUnset(headers, value) {
  if (!isUndefined(headers) && isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function isObject(target){
    if (typeof target == 'Object' && target != null) {
        return true;
    }else {
        return false;
    }
}
function isFormData(target){
    if (target instanceof FormData) {
        return true;
    } else {
        return false;
    }
}

function isUndefined(target){
    if (typeof target == 'undefined') {
        return true;
    }else {
        return false;
    }
}

export default{
    isObject
}
