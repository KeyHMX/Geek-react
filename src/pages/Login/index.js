import './index.scss'
import { Card, Form, Input, Button,message } from 'antd'
import logo from '@/assets/logo.png'
import {useDispatch} from 'react-redux'
import { fetchLogin } from '@/store/modules/user'
import { useNavigate } from "react-router-dom"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  //这里不加上async和await会立马报错，因为如果代码中未正确处理异步操作，就可能导致请求超时的错误
  //如果不等待异步请求完成就立即导航到另一个页面，可能会导致异步请求还未完成就离开当前页面，从而导致数据不一致或其他意外行为。
  // 如果未等待异步请求完成就立即显示成功消息，可能会导致成功消息在数据未真正提交成功时就显示出来，给用户错误的提示。

  const onFinish = async (formValue)=>{
    console.log(formValue)
    await dispatch(fetchLogin(formValue))
    
    navigate('/')
    message.success('登录成功')
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form validateTrigger={['onBlur']} onFinish={onFinish}>
          <Form.Item
          name="mobile"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '手机号码格式不对'
            }
          ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item 
          name="code"
          rules={[
            { required: true, message: '请输入验证码' },
          ]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login