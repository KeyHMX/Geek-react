import { http } from "@/utils";
//获取频道列表
export function getChannelAPI(){
    return http({
        url:'/channels',
        method:'GET'
    })
}

//2.提交文章表单
export function creaeteArticleAPI(data){
    return http({
        url:'/mp/articles?draft=false',
        method:'POST',
        data
    })
}

//获取文章列表

export function getArticleListAPI(params){
    return http({
        url:'/mp/articles',
        method:'GET',
        params
    })
}

//删除文章

export function delArticleAPI(id){
    return http({
        url:`/mp/articles/${id}`,
        method:'DELETE'
    })
}

//获取文章详情
export function getArticleById(id){
    return http({
        url:`/mp/articles/${id}`
    })
}

//update
export function updateArticleAPI(data){
    return http({
        url:`/mp/articles/${data.id}?draft=false`,
        method:'PUT',
        data
    })
}