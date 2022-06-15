import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import servicePath from '../../config/apiUrl';

export default function ArticleList(props) {

  const [articleList, setArticleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getArticleList();
  }, []);

  // 文章列表数据定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: text => <span>{text}</span>,
      width: 400,
    },
    {
      title: '类别',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      filters: [
        {
          text: '技术杂谈',
          value: '技术杂谈',
        },
        {
          text: '学习总结',
          value: '学习总结',
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      ellipsis: true,
      sorter: (a, b) => {
        let x = a.publishDate.replaceAll('-', '');
        let y = b.publishDate.replaceAll('-', '');
        return Number(x) - Number(y);
      },
    },
    {
      title: '标签名',
      key: 'tags',
      dataIndex: 'tags',
      ellipsis: true,
      render: tags => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      ellipsis: true,
      sorter: (a, b) => Number(a.viewCount) - Number(b.viewCount),
    },
    {
      title: '操作',
      key: 'action',
      ellipsis: true,
      render: (text, { id }, index) => (
        <Space size="middle">
          <Button type="primary" onClick={() => { updateArticle(id) }}>修改</Button>
          <Button type="primary" danger onClick={() => { delArticle(id) }}>删除</Button>
        </Space>
      ),
    },
  ];

  // 发送请求获取列表数据
  const getArticleList = async () => {
    const token = localStorage.getItem('token');
    const ret = await axios({
      method: 'GET',
      url: servicePath.getArticleList,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    let list = ret.data.data;
    if (list === '没有登录') {
      localStorage.removeItem('token');
      props.history.push('/login');
    } else {
      setIsLoading(false);
      setArticleList(handleList(list));
    }
  }

  // 处理请求回的列表数据
  const handleList = (list) => {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      res[i] = {};
      Object.assign(res[i], list[i], {
        key: list[i].id,
        tags: list[i].tags.split(','),
      })
    }
    return res;
  }

  // 删除文章的回调
  const delArticle = (id) => {
    const token = localStorage.getItem('token');
    const { confirm } = Modal;
    confirm({
      title: '确定要删除这篇博客文章吗？',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        axios.delete(servicePath.delArticle + id, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((res) => {
            message.success('文章删除成功');
            getArticleList();
          })
      },
      onCancel() {
        message.success('没有任何改变');
      }
    });
  }

  // 修改文章的回调
  const updateArticle = (id) => {
    // 直接路由跳转
    props.history.push(`/index/add/${id}`);
  }

  return (
    <Table
      columns={columns}
      isLoading={isLoading}
      dataSource={articleList}
    >
    </Table>
  )
}
