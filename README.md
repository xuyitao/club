# Club

## 介绍
  Club是一个仿[CNodejs](https://cnodejs.org/)项目，通过对Nodejs源代码的通读、实现，达到学习的目的。
  
## 区别
  Club的逻辑和项目结构基本参照CNodejs，还是有区别：
  
1、因为服务器的问题。CNodejs的数据库采用[MongoDB](https://www.mongodb.org)，而本项目使用[LeanCloud](http://leancloud.cn/)，体量小时可免费使用。

2、同样的原因，CNodejs采用[Redis](http://redis.io)，而本项目线上使用数据库替代，也实现redis的支持。

3、页面，CNodejs使用ejs渲染，而本项目使用reactjs

>目前了解CNodejs的主要技术
Nodejs+Express+MongoDB+Redis+Ejs+eventproxy

>本项目主要技术
Nodejs+Express+LeanCloud+Reactjs+React-bootstrap

## 测试

```bash
$ make test
```

## 本地启动

线上跑的是 [Node.js](https://nodejs.org) v6.9.1，[Redis](http://redis.io) 是 v3.0.3。

```
1. 安装 `Node.js[必须]` `Redis[必须]`
2. 启动 Redis
3. `$ make install` 
4. `$ make test`    确保各项服务都正常
5. `$ lean init`    初始化项目
6. `$ lean login`   登陆账号 
7. `$ lean up`      Leancloud启动
8. visit `http://localhost:3000`
9. done!
```

## 安装部署

在LeanCloud注册并创建项目，配置项目地址和SSH、点击部署即可。


有任何意见或建议都欢迎提 issue，或者直接提给 [@xuyitao](https://github.com/xuyitao)
