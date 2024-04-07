//ceshi token is or not inject
import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import {Outlet,useNavigate,useLocation} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { useEffect } from 'react'
import { clearUserFormat, fetchUserFormat } from '@/store/modules/user'
const { Header, Sider } = Layout

const items = [
  {
    label: '首页',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: '文章管理',
    key: '/article',
    icon: <DiffOutlined />,
  },
  {
    label: '创建文章',
    key: '/publish',
    icon: <EditOutlined />,
  },
]
// dispatch是Redux提供的一个函数，用于向Redux store发送一个
// action，进而触发store中的reducer函数执行状态更新操作。
// dispatch接受一个action对象作为参数，其中action对象通常包含
// type和payload两个属性，分别用于指明更新操作的类型和相关的数据。

// 在上面的代码中，我们首先使用useDispatch hook获取了dispatch函数，
// 并将其保存在变量dispatch中。然后，我们使用useEffect hook执行副
// 作用操作，即发送一个名为fetchData的action到Redux store。由于我们
// 只希望在组件挂载时执行一次该操作，因此将dispatch函数作为依赖项传入
// useEffect的依赖数组中。这样，当dispatch函数发生变化时，useEffect
// 才会重新执行。

const GeekLayout = () => {
  const navigate = useNavigate()
  const menuClick = (route)=>{
    navigate(route.key)
  }
  const dispatch = useDispatch()
  const name = useSelector(state=>state.user.userFormat.name)
  //感觉凡是“得到”的动作都不需要参数
  useEffect(()=>{
    dispatch(fetchUserFormat())
  },[dispatch])
  //反向高亮
  //1.获取当前路由路径
  const location = useLocation()
  const selectedKey = location.pathname
  //退出逻辑
  //目前还没确定，但是应该是要加同步异步操作的
  const loginOut = async()=>{
    await dispatch(clearUserFormat())
    navigate('/login')
  }
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消"
            onConfirm={loginOut}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKey}
            items={items}
            style={{ height: '100%', borderRight: 0 }}
            onClick={menuClick}>
          </Menu>
          
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet/>
        </Layout>
        
      </Layout>
      
    </Layout>
  )
}
export default GeekLayout