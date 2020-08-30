// ajax请求模块
// 返回值是promise对象(异步返回的是：response.data)

import axios from 'axios'

axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证

export default function ajax(url,data={},type='GET'){
    return new Promise(function(resolve,reject){
        let promise
        // 执行异步ajax请求
        if (type === 'GET') {
            //准备url query参数数据
            let dataStr = '' // 数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&'
            })
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            // 发送get请求
            promise = axios.get(url)
        }else {
            promise = axios.post(url,data)
            // console.log(promise)
        }
        promise.then(function (response){
            //成功了调用resolve
            resolve(response.data)
        }).catch(function(error){
            reject(error)
        })
    })
}