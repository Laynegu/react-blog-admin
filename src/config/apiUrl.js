let baseUrl = 'http://localhost:7001/admin/';

let servicePath = {
  checkLogin: baseUrl + 'checkLogin',             //   登录验证
  getTypeInfo: baseUrl + 'getTypeInfo',           //   获取博客文章类别
  addArticle: baseUrl + 'addArticle',             //   增加博客文章
  updateArticle: baseUrl + 'updateArticle',       //   修改博客文章
  getArticleList: baseUrl + 'getArticleList',     //   获得博客文章列表
  delArticle: baseUrl + 'delArticle/',            //   删除指定文章
  getArticleById: baseUrl + 'getArticleById/',    //   获取指定文章
}

export default servicePath;
