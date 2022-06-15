import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
import '../../static/css/addArticle.css';
import servicePath from '../../config/apiUrl';

const { Option } = Select;
const { TextArea } = Input;

export default function AddArticle(props) {

  // 解析markdown语法
  const [markdownContent, setMarkdownContent] = useState('预览内容');
  const [markdownIntro, setMarkdownIntro] = useState('等待编辑......');

  // 博客文章的相关信息
  const [articleId, setArticleId] = useState(0);
  const [typeInfo, setTypeInfo] = useState([]);
  const [selectTypeId, setSelectTypeId] = useState(0);
  const [selectTypeName, setSelectTypeName] = useState('文章类别');

  const [publishDateString, setPublishDateString] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [updateDateString, setUpdateDateString] = useState('');
  const [updateDate, setUpdateDate] = useState('');

  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleIntro, setArticleIntro] = useState('');
  const [articleTabName, setArticleTabName] = useState('');

  let blog_id = props.match.params.id;
  useEffect(() => {
    // 清空所有输入框
    clearInput();
    getTypeInfo();
    // 检测文章id是否传入
    if (blog_id) {
      setArticleId(blog_id);
      getArticleById(blog_id);
    };
  }, [blog_id]);

  // 清空内容
  const clearInput = () => {
    setMarkdownContent('预览内容');
    setMarkdownIntro('等待编辑......');
    setArticleTitle('');
    setArticleTabName('');
    setArticleContent('');
    setArticleIntro('');
    setUpdateDate('');
    setPublishDate('');
    setPublishDateString('');
    setUpdateDateString('');
    setArticleId(0);
    setSelectTypeName('文章类别');
    setSelectTypeId(0);
  }

  // 发送axios请求获取博客文章类别
  const getTypeInfo = async () => {
    const token = localStorage.getItem('token');
    const ret = await axios({
      url: servicePath.getTypeInfo,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token}`,
      },
      // withCredentials: true,
    });
    if (ret.data.data === '没有登录') {
      // localStorage.removeItem('openId');
      // 利用localStorage存储token
      localStorage.removeItem('token');
      props.history.push('/login');
    } else {
      setTypeInfo(ret.data.data);
    }
  };

  // 根据路由中传递的id请求指定文章数据
  const getArticleById = async (id) => {
    const token = localStorage.getItem('token');
    const ret = await axios({
      method: 'GET',
      url: servicePath.getArticleById + id,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    let {
      title,
      typeId,
      typeName,
      publishDate,
      tabName,
      articleIntro,
      articleContent,
    } = ret.data.data[0];
    // 文章标题
    setArticleTitle(title);
    // 文章简介与相应的解析
    setArticleIntro(articleIntro);
    setMarkdownIntro(marked(articleIntro));
    // 文章内容与相应的解析
    setArticleContent(articleContent);
    setMarkdownContent(marked(articleContent));
    // 文章发布时间，类型及标签
    setPublishDate(moment(publishDate));
    setPublishDateString(publishDate);
    setSelectTypeId(typeId);
    setSelectTypeName(typeName);
    setArticleTabName(tabName);
  };

  // 保存文章并发布
  const saveArticle = async () => {
    // 初步检测输入内容
    if (!selectTypeId) {
      message.error('必须选择文章类别');
      return false;
    } else if (!articleTitle) {
      message.error('文章名称不能为空');
      return false;
    } else if (!articleContent) {
      message.error('文章内容不能为空');
      return false;
    } else if (!articleIntro) {
      message.error('文章简介不能为空');
      return false;
    } else if (!publishDate) {
      message.error('发布日期不能为空');
      return false;
    } else if (!articleTabName) {
      message.error('标签名不能为空');
      return false;
    }
    //请求发布
    let data = {
      title: articleTitle,
      add_time: publishDateString,
      tab_name: articleTabName,
      type_id: selectTypeId,
      introduction: articleIntro,
      article_content: articleContent,
    }
    const token = localStorage.getItem('token');
    if (articleId === 0) {
      // 说明是新增加的文章
      data.view_count = 0;
      const ret = await axios({
        method: 'POST',
        url: servicePath.addArticle,
        data,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        // withCredentials: true,
      });
      setArticleId(ret.data.insertId);
      if (ret.data.isAddSuccess) {
        message.success('文章发布成功');
      } else {
        message.error('文章发布失败');
      }
    } else {
      // 说明是要保存的文章
      data.id = articleId;
      const ret = await axios({
        method: 'POST',
        url: servicePath.updateArticle,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data,
        // withCredentials: true,
      });
      if (ret.data.isUpdateSuccess) {
        message.success('文章保存成功');
      } else {
        message.error('文章保存失败');
      }
    }
  };

  // markdown语法解析设置
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    // 支持语法高亮
    highlight: (code) => hljs.highlightAuto(code).value,
  });

  const parseArticleContent = e => {
    let val = e.target.value;
    let html = marked(val);
    setArticleContent(val);
    setMarkdownContent(html);
  };

  const parseArticleIntro = e => {
    let val = e.target.value;
    let html = marked(val);
    setArticleIntro(val);
    setMarkdownIntro(html);
  };

  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10} className="add-blog-header">
            <Col span={16}>
              <Input
                placeholder="博客标题"
                size="large"
                className="add-blog-title"
                value={articleTitle}
                onChange={e => { setArticleTitle(e.target.value) }}
              />
            </Col>
            <Col span={4}>
              <Input
                placeholder="标签名"
                size="large"
                className="add-blog-tabName"
                value={articleTabName}
                onChange={e => { setArticleTabName(e.target.value) }}
              />
            </Col>
            <Col span={4}>
              <Select
                defaultValue={selectTypeName}
                value={selectTypeName}
                size="large"
                onChange={(value) => { setSelectTypeId(value) }}
              >
                {
                  typeInfo.map(item => {
                    return <Option key={item.id} value={item.id}>{item.type_name}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row gutter={10} className="add-blog-body">
            <Col span={12}>
              <TextArea
                className="markdown-content"
                rows={35}
                placeholder="文章内容"
                value={articleContent}
                onChange={parseArticleContent}
              />
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML={{ __html: markdownContent }}>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <Button size="large" className="tempSave-article">暂存文章</Button>
              <Button
                type="primary"
                size="large"
                className="publish-article"
                onClick={saveArticle}
              >发布文章</Button>
            </Col>
            <Col span={24} className="add-article-intro">
              <TextArea
                rows={4}
                placeholder="文章简介"
                value={articleIntro}
                onChange={parseArticleIntro}
              />
              <div
                className="introduce-html"
                dangerouslySetInnerHTML={{ __html: markdownIntro }}>
              </div>
            </Col>
            <Col span={12}>
              <div className="date-publish">
                <DatePicker
                  placeholder="发布日期"
                  value={publishDate}
                  size="large"
                  onChange={(date, dateString) => { 
                    setPublishDate(date); 
                    setPublishDateString(dateString); 
                  }}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="date-modify">
                <DatePicker
                  placeholder="修改日期"
                  value={updateDate}
                  size="large"
                  onChange={(date, dateString) => { 
                    setUpdateDate(date);
                    setUpdateDateString(dateString);
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
