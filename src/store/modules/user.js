import {createSlice} from '@reduxjs/toolkit'
import { http } from '@/utils'
import { clearToken, getToken ,setToken} from '@/utils/token'
const userStore = createSlice({
    name:'user',
    initialState:{
        token: getToken() || '',
        userFormat:{}
    },
    //同步修改方法
    reducers:{
        setUserInfo(state,action){
            state.token = action.payload
            //存入本地
            setToken(state.token)
            //这里注意，localstorage里面是有的，但是redux里丢失了，但是还是存在的
            // localStorage.setItem('token_key',action.payload)
        },
        //操作用户身份信息
        setUserFormat(state,action){
            state.userFormat = action.payload
        },
        clearUserFormat(state){
            state.token = ''
            state.userFormat = {}
            clearToken()
        }
    }
})
//解构出actionCreater
const {setUserInfo,setUserFormat,clearUserFormat} = userStore.actions

//获取reducer函数
const userReducer = userStore.reducer

//异步存储token到本地
const fetchLogin = (loginForm)=>{
    return async (dispatch)=>{
        const res = await http.post('authorizations',loginForm)
        dispatch(setUserInfo(res.data.token))
    }
}
//异步获取登录信息
const fetchUserFormat = ()=>{
    return async (dispatch)=>{
        const res = await http.get('/user/profile')
        dispatch(setUserFormat(res.data))
    }
}



export {fetchLogin,fetchUserFormat,clearUserFormat}

export default userReducer

