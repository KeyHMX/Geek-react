import axios from 'axios'
import { clearToken, getToken } from './token'
import router from '@/router'
//注意注意这里名字是request.js但是导出的是http对象
const http = axios.create({
    baseURL:'http://geek.itheima.net/v1_0',
    timeout: 5000
})
//添加请求拦截器
http.interceptors.request.use((config)=>{  
    //if not login add token(如果不是通过登录获取的token，即原始token)
    const token = getToken()
    if (token) {
        //查找文档
        config.headers.Authorization = `Bearer ${token}`
        console.log(config.headers.Authorization)
    }
    return config
},(error)=>{
    
    return Promise.reject(error)
}
)

//添加响应拦截器
//token失效时请求接口，后端会返回401状态码
//前端可以监控这个状态做后续的操作
//在axios拦截监控401状态码，清楚失效token跳转登录
http.interceptors.response.use((response)=>{
    //超出2xx的范围状态码都会触发该函数
    //对响应错误做点什么
    return response.data
},(error)=>{
    //超出2xx的范围状态码都会触发该函数
    //对响应错误做点什么
    console.log(error)
    if (error.response.status === 401){
        clearToken()
        router.navigate('/login').then(()=>{
            window.location.reload()
        })//这种写法是为了隐藏报错信息
        // window.location.reload()
    }
    return Promise.reject(error)
})

export {http}
