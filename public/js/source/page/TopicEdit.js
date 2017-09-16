import React from 'react'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel, Form,
	FormGroup,Col, FormControl,ControlLabel, Button, Breadcrumb, HelpBlock,Alert,Row  } from 'react-bootstrap';
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import {Route, Link} from 'react-router-dom'
import _ from 'underscore'
import Editor from 'react-md-editor'
import '../../../stylesheets/markdown.css'
import marked from 'marked'
import config from '../../../../config.js'


export default class TopicEdit extends React.Component{
  	constructor(props) {
    	super(props);
		this.state ={
			topicId:this.props.match.topicId,
			errMsg:null,
			tabs:[{key:'share',value:'分享'},{key:'ask',value:'问答'},
				{key:'job',value:'招聘'},{key:'dev',value:'客户端测试'}],
			selectTab:'share',
			code:'',
			codeModel:1 //1 编辑  2预览
		};
		// console.log(this.props.match);

  	}
  	componentDidMount() {

  	}

  	getHeaders() {
  		return  <Breadcrumb>
			        <Breadcrumb.Item href='/'>主页</Breadcrumb.Item>
					{
						this.state.topicId ? <Breadcrumb.Item active>编辑话题</Breadcrumb.Item> : <Breadcrumb.Item active>发布话题</Breadcrumb.Item>
					}

      			</Breadcrumb>
  	}

  	onSubmit(e) {
	  	e.preventDefault();
		const tab = this.state.selectTab
		console.log(tab);
		// const pass = this.state.password
		// if(name.length == 0) {
		// 	return UserAction.notify('用户名不能为空');
		// }
		// if(pass.length == 0) {
		// 	return UserAction.notify('密码不能为空');
		// }
		//
		// UserAction.ajaxPost("/signin",JSON.stringify({username:name, password:pass}),
        //   function(result,status,xhr){
        //     // AppDispatcher.dispatch({
        //     //   actionType: UserConstants.LOGIN_IN,
        //     //   isSus: true,
        //     //   name:itemData['name'],
        //     //   role:itemData['role'],
        //     // });
		//
        //   }.bind(this), function(xhr, status,err){
        //     //  AppDispatcher.dispatch({
        //     //    actionType: UserConstants.LOGIN_IN,
        //     //    isSus: false,
        //     //    errmsg:'login in fail err='+err.message
        //     //  });
		// 	JSON.stringify(err)
		// 	this.setState({
		// 		errMsg:err.toString()
		// 	})
		// }.bind(this));
  	}

  	render()  {
		let preview = marked(this.state.code);
    	return (
      	<div>
            <Panel header={this.getHeaders()}>
			{
				this.state.errMsg && <Alert bsStyle="warning">{this.state.errMsg}</Alert>
			}

			<Form horizontal onSubmit={this.onSubmit.bind(this)}>
			    <FormGroup controlId="formControlsSelect">
					<Col componentClass={ControlLabel} sm={2}>
			      	选择板块:
					</Col>
					<Col sm={10}>
				      <FormControl componentClass="select" placeholder="请选择"
					  	onChange={(e)=>this.setState({ selectTab: e.target.value })}
						value={this.state.selectTab}>
						{
							_.map(this.state.tabs, function (tab,index) {
								return <option key={index} value={tab.key}>{tab.value}</option>
							})
						}
				      </FormControl>
					</Col>
			    </FormGroup>

			    <FormGroup controlId="formHorizontalPassword">
					<Col sm={12}>
			        <FormControl type="text" placeholder="标题字数 10个字以上" onChange={(e)=>this.setState({ password: e.target.value })}/>
					</Col>
			    </FormGroup>

				<ButtonToolbar>
  				  <ToggleButtonGroup type="radio" name="options" defaultValue={this.state.codeModel}
  				  	onChange={(value)=>this.setState({codeModel:value})}>
  					  <ToggleButton value={1}>编辑</ToggleButton>
  					  <ToggleButton value={2}>预览</ToggleButton>
  				  </ToggleButtonGroup>
  			  	</ButtonToolbar>
				{
					this.state.codeModel == 1?<Editor value={this.state.code} onChange={(newCode)=>this.setState({code:newCode})} />:
									<div className="preview" dangerouslySetInnerHTML={{__html: preview}} />
				}

				<Button type="submit" bsStyle="primary">
				  提交
				</Button>
			</Form>
            </Panel>
      	</div>
    );
  }


}
