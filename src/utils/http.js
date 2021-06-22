import Vue from 'vue'
import axios from 'axios'
import request from '../utils/md5/request'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
import Cookie from 'js-cookie'
/*设备id，服务端验证用*/
function generateUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0
        d = Math.floor(d/16)
        return (c=='x' ? r : (r&0x3|0x8)).toString(36)
    })
    return uuid
}
if(!localStorage.getItem('visitorId')){
    let visitorId=generateUUID()
    localStorage.setItem('visitorId',visitorId)
}
// 请求超时时间
axios.defaults.timeout = 15000
// baseurl
axios.defaults.baseURL = process.env.VUE_APP_URL
axios.defaults.withCredentials=true

// post请求头
axios.defaults.headers.Accept = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.request.use(
    config => {
        if (config.loading) {
            NProgress.start()
        }
        let visitorId=''
        if(localStorage.getItem('visitorId')){
            visitorId = localStorage.getItem('visitorId')
        }else {
            visitorId=generateUUID()
            localStorage.setItem('visitorId',visitorId)
        }
        config.headers['Device-Id'] = visitorId
        return config
    },
    error => {
        return Promise.error(error)
    })


axios.interceptors.response.use(function (response) {
    if (response.data.code == 403) {
        // 响应拦截等操作
    }
    NProgress.done()
    return response
}, function (error) {
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    NProgress.done()
    return Promise.reject(error)
})


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param sign_key
 */
function doGet(url, param) {
    let params = param || {}
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: request.sign(params, localStorage.getItem('visitorId')),
            loading: true
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 */
function doPost(url, param) {
    let params = param || {}
    return new Promise((resolve, reject) => {
        axios.post(url, request.sign(params, localStorage.getItem('visitorId')), {
            loading: true
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })

}

/**
 * get方法，对应get请求，没有加载条
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function getNotLoading(url, param) {
    let params = param || {}
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: request.sign(params, localStorage.getItem('visitorId')),
            loading: false
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })

}

/**
 * post方法，对应post请求，没有加载条
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function postNotLoading(url, param) {
    let params = param || {}
    return new Promise((resolve, reject) => {
        axios.post(url, request.sign(params, localStorage.getItem('visitorId')), {
            loading: false
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

/**
 * image 文件流上传
 * @param {String} url [请求的url地址]
 */
function doFile(url, param, method = 'post') {
    let params = param || {}
    let formData = new FormData()
    formData.append('file', params)
    return new Promise((resolve, reject) => {
        axios[method](url, formData, {
            loading: true,
            headers: {
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq'
            }
        }).then(res => {
            resolve(res.data.data)
        })
        .catch(err => {
            reject(err.data.data)
        })
    })

}

/** 文件导出/下载Get方法
 * @表格 'xls' => 'application/vnd.ms-excel'
 * @ZIP 'zip' => 'application/zip'
 * @gif => 'image/gif',
 * @jpeg => 'image/jpeg',
 * @jpg => 'image/jpeg',
 * @png => 'image/png',
 * **/
function fileExport (url, param, resType = 'blob', methodType) {
    const params = param || {}
    const method = methodType || 'get'
    return new Promise((resolve, reject) => {
        axios[method](url, {
            params: request.sign(params),
            loading: true,
            responseType: resType
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

export default {
    doPost,
    doGet,
    doFile,
    getNotLoading,
    postNotLoading,
    fileExport
}
