//封装存取方法
const TOKENKEY = 'token_key'

function setToken (token){
    console.log('success')
    return localStorage.setItem(TOKENKEY,token)
}

function getToken (){
    
    
    return localStorage.getItem(TOKENKEY)
    
}

function clearToken(){
    return localStorage.removeItem(TOKENKEY)
}

export {
    setToken,
    getToken,
    clearToken
}

//这里有个小知识点，比如说settoken和其他的方法名
//起了冲突，可以用setToken as _setToken来命名规避冲突