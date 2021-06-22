const path = require('path')//引入path模块
const webpack = require('webpack')
function resolve(dir) {
    return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}

const httpsFlag = process.env.VUE_APP_URL && process.env.VUE_APP_URL.indexOf('https') > -1
module.exports = {
    //  设置项目域名访问
    devServer: {
        open: true,
        disableHostCheck: true,
        port: '8088',
        https: httpsFlag,
        hotOnly: false,
        proxy: null
    },
    publicPath: process.env.VUE_APP_PUBLICPATH,
    productionSourceMap: false
}
