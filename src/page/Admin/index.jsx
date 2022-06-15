import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Modal } from 'antd';
import {
  EditOutlined,
  MessageOutlined,
  AppstoreOutlined,
  HomeOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

import { Redirect, Route, Switch } from 'react-router-dom';
import AddArticle from '../AddArticle';
import ArticleList from '../ArticleList';
import Message from '../Message';
import User from '../User';
// import { clearCookie } from '../../config/cookie';
import '../../static/css/admin.css';

const { Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;

const map = {
  add: '添加文章',
  list: '文章列表',
  message: '留言管理',
  user: '用户管理',
  articleManage: '文章管理',
  index: '首页',
}

export default function Admin(props) {

  const [collapsed, setCollapsed] = useState(false);
  const [breadNav, setBreadNav] = useState([]);
  const [curNav, setCurNav] = useState('');

  // 处理路由跳转
  useEffect(() => {
    let navArr = props.location.pathname.substr(1).split('/');
    let len = navArr.length;
    let curAllNav = ['后台管理'];
    if (len === 1) {
      curAllNav.push('首页');
    } else {
      for (let i = 0; i < len; i++) {
        let path = navArr[i];
        if (path === 'add' || path === 'list') {
          curAllNav.push('文章管理');
        }
        if (len <= 2)
          path !== 'index' && curAllNav.push(map[path]);
        else {
          path !== 'index' && !Number(path) && curAllNav.push(map['list']);
        }
      }
    }
    setBreadNav(curAllNav);
    if (len > 2)
      setCurNav('list');
    else
      setCurNav(navArr[len - 1]);
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  }

  // 处理路由跳转
  const handleClick = ({ key, keyPath }) => {
    let curAllNav = [];
    keyPath.forEach(path => {
      curAllNav.unshift(map[path]);
    });
    curAllNav.unshift('后台管理');
    setBreadNav(curAllNav);
    setCurNav(key);
    key === 'index' ? props.history.push('/index') : props.history.push(`/index/${key}`);
  }

  // 处理退出登录
  const showConfirm = (e) => {
    e.preventDefault();
    const { confirm } = Modal;
    confirm({
      title: '确定退出吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        localStorage.removeItem('token');
        // sessionStorage.clear();
        // clearCookie('EGG_SESS');
        props.history.replace('/login');
      },
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo"></div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['index']}
          selectedKeys={[curNav]}
          mode="inline"
          onClick={handleClick}
        >
          <Menu.Item key="index" icon={<HomeOutlined />}>
            <span>首页</span>
          </Menu.Item>
          <SubMenu
            key="articleManage"
            icon={<AppstoreOutlined />}
            title="文章管理"
          >
            <Menu.Item key="add" icon={<EditOutlined />}>添加文章</Menu.Item>
            <Menu.Item key="list" icon={<UnorderedListOutlined />}>文章列表</Menu.Item>
          </SubMenu>
          <Menu.Item key="message" icon={<MessageOutlined />}>
            <span>留言管理</span>
          </Menu.Item>
          <Menu.Item key="user" icon={<UserOutlined />}>
            <span>用户管理</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background layout-header">
          <div className="layout-header-title">
            <span className="welcome">欢迎 gulinfei</span>
            <a className="leave" onClick={showConfirm}>退出</a>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb className="layout-breadNav">
            {
              breadNav.map((item, index) => {
                return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
              })
            }
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <div>
              <Switch>
                <Route path="/index" exact component={AddArticle}></Route>
                <Route path="/index/add" exact component={AddArticle}></Route>
                <Route path="/index/add/:id" exact component={AddArticle}></Route>
                <Route path="/index/list" exact component={ArticleList}></Route>
                <Route path="/index/message" exact component={Message}></Route>
                <Route path="/index/user" exact component={User}></Route>
                <Redirect to="/login"></Redirect>
              </Switch>
            </div>
          </div>
        </Content>
        <Footer className="layout-footer"> gulinfei.com </Footer>
      </Layout>
    </Layout>
  )
}
