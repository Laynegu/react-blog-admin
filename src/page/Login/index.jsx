import React, { useState } from 'react';
import { Spin, Card, Input, Button, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../../static/css/login.css';
import servicePath from '../../config/apiUrl';

export default function Login(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkLogin = async() => {
    setIsLoading(true);
    // 初步判定输入内容的合法性
    if (!username) {
      message.error('用户名不能为空');
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return false;
    } else if (!password) {
      message.error('密码不能为空');
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return false;
    }

    // 发送Ajax请求，进一步从后台判断
    const ret = await axios({
      method: 'post',
      url: servicePath.checkLogin,
      data: {
        username,
        password
      },
      withCredentials: true,
    })
    setIsLoading(false);
    if (ret.data.data === '登录成功') {
      // localStorage.setItem('openId', ret.data.openId);
      localStorage.setItem('token', ret.data.token);
      props.history.push('/index');
    } else {
      message.error('用户密码错误');
    }
  }

  return (
    <div className="login-wrap">
      <div className="login">
        <Spin tip="Loading..." spinning={isLoading}>
          <Card title="Blog System Login" bordered={true} style={{ width: 400 }} >
            <Input
              id="username"
              size="large"
              placeholder="Enter your username"
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, .25)' }} />}
              onChange={(e) => { setUsername(e.target.value) }}
            />
            <br />
            <br />
            <Input.Password
              id="password"
              size="large"
              placeholder="Enter your password"
              prefix={<KeyOutlined style={{ color: 'rgba(0, 0, 0, .25)' }} />}
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <br />
            <br />
            <Button type="primary" size="large" block onClick={checkLogin} > Login in </Button>
          </Card>
        </Spin>
      </div>
    </div>
  )
}
