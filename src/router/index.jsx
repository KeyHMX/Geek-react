import { createBrowserRouter } from 'react-router-dom'

import Login from '@/pages/Login'
import Layout from '../pages/Layout'
import AuthRoute from '@/components/AuthRoute'
import Home from '@/pages/Home'
import Article from '@/pages/Article'
import Publish from '@/pages/Publish'

const router = createBrowserRouter([
  {
    path: '/',
    element: (<AuthRoute><Layout /></AuthRoute>),
    //业务背景：封装 AuthRoute 路由鉴权高阶组件，实现未登录拦截，并跳转到登录页面
    //实现思路：判断本地是否有token，如果有，就返回子组件，否则就重定向到登录Login
    children:[
      {
        index: true,
        element: <Home/>
      },
      {
        path:'article',
        element:<Article/>
      },
      {
        path:'publish',
        element:<Publish/>
      }
    ]  
  },
  {
    path:'/login',
    element:<Login/>
  }
])



export default router