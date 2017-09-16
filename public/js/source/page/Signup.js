import React from 'react'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel, Form,
	FormGroup,Col, FormControl,ControlLabel, Button, Breadcrumb, HelpBlock } from 'react-bootstrap';
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import {Route, Link} from 'react-router-dom'

export default class Signup extends React.Component{
  	constructor(props) {
    	super(props);
		this.state ={
			name:'',
			password:'',
			errMsg:null
		};
  	}
  	componentDidMount() {
    	// Decode entities in the URL

  	}

  	getHeaders() {
  		return  <Breadcrumb>
			        <Breadcrumb.Item href='/'>主页</Breadcrumb.Item>
			        <Breadcrumb.Item active>登录</Breadcrumb.Item>
      			</Breadcrumb>
  	}

  	onSubmit(e) {
	  	e.preventDefault();
		const name = this.state.name
		const pass = this.state.password
		if(name.length == 0) {
			return UserAction.notify('用户名不能为空');
		}
		if(pass.length == 0) {
			return UserAction.notify('密码不能为空');
		}

		UserAction.ajaxPost("/signin",JSON.stringify({username:name, password:pass}),
          function(result,status,xhr){
            // AppDispatcher.dispatch({
            //   actionType: UserConstants.LOGIN_IN,
            //   isSus: true,
            //   name:itemData['name'],
            //   role:itemData['role'],
            // });

          }.bind(this), function(xhr, status,err){
            //  AppDispatcher.dispatch({
            //    actionType: UserConstants.LOGIN_IN,
            //    isSus: false,
            //    errmsg:'login in fail err='+err.message
            //  });
			JSON.stringify(err)
			this.setState({
				errMsg:err.toString()
			})
		}.bind(this));
  	}
  	render()  {
    	return (
      	<div>
            <Panel header={this.getHeaders()} >
			<Form horizontal style={{marginTop:20}} onSubmit={this.onSubmit.bind(this)}>>
			    <FormGroup controlId="formHorizontalEmail">
			      <Col componentClass={ControlLabel} sm={2}>
			        账户
			      </Col>
			      <Col sm={10}>
			        <FormControl type="text" placeholder="Text" onChange={(e)=>this.setState({ name: e.target.value })}/>
			      </Col>
			    </FormGroup>

			    <FormGroup controlId="formHorizontalPassword">
			      <Col componentClass={ControlLabel} sm={2}>
			        密码
			      </Col>
			      <Col sm={10}>
			        <FormControl type="password" placeholder="Password" onChange={(e)=>this.setState({ password: e.target.value })}/>
			      </Col>
			    </FormGroup>
				{
					this.state.errMsg && <p>{this.state.errMsg}</p>
				}
			    <FormGroup style={{marginTop:50}}>
			      <Col smOffset={2} sm={10}>
			        <Button type="submit" bsStyle="primary">
			          登陆
			        </Button>
					<Button bsStyle="warning" style={{marginLeft:10}}>
						通过github登陆
				    </Button>
					<Button bsStyle="link" style={{marginLeft:20}}>
			          忘记密码了
			        </Button>
			      </Col>
			    </FormGroup>
			  </Form>
            </Panel>
      	</div>
    );
  }


}
