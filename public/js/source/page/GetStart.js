import React from 'react'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel, Form,
	FormGroup,Col, FormControl,ControlLabel, Button, Breadcrumb, Alert } from 'react-bootstrap';
import {Route, Link} from 'react-router-dom'
import marked from 'marked'

export default class GetStart extends React.Component{
  	constructor(props) {
    	super(props);
		this.state ={
			code:`## Node.js 入门

《**汇智网 Node.js 课程**》

http://www.hubwiz.com/course/?type=nodes

《**快速搭建 Node.js 开发环境以及加速 npm**》

http://fengmk2.com/blog/2014/03/node-env-and-faster-npm.html

《**Node.js 包教不包会**》

https://github.com/alsotang/node-lessons

《**ECMAScript 6入门**》

http://es6.ruanyifeng.com/

《**七天学会NodeJS**》

https://github.com/nqdeng/7-days-nodejs

《**Node入门-_一本全面的Node.js教程_**》

http://www.nodebeginner.org/index-zh-cn.html

## Node.js 资源

《**node weekly**》

http://nodeweekly.com/issues

《**node123-_node.js中文资料导航_**》

https://github.com/youyudehexie/node123

《**A curated list of delightful Node.js packages and resources**》

https://github.com/sindresorhus/awesome-nodejs

《**Node.js Books**》

https://github.com/pana/node-books

## Node.js 名人

《**名人堂**》

https://github.com/cnodejs/nodeclub/wiki/%E5%90%8D%E4%BA%BA%E5%A0%82

## Node.js 服务器

新手搭建 Node.js 服务器，推荐使用无需备案的 [DigitalOcean(https://www.digitalocean.com/)](https://www.digitalocean.com/?refcode=eba02656eeb3)
`
		};
  	}

 	render()  {
		let preview = marked(this.state.code);
    return (
      <Panel header={'Node.js 新手入门'} >
  	  	<div className="preview" dangerouslySetInnerHTML={{__html: preview}} />
      </Panel>
    );
  }


}
