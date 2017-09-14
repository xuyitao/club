import React from 'react'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel, Form,
	FormGroup,Col, FormControl,ControlLabel, Button, Breadcrumb } from 'react-bootstrap';
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import {Route, Link} from 'react-router-dom'

export default class SiginIn extends React.Component{
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    // Decode entities in the URL

  }

  getHeaders() {
  	return  <Breadcrumb className='breadcrumb'>
		        <Breadcrumb.Item >
					<Link to='/'>主页</Link>
				</Breadcrumb.Item>
		        <Breadcrumb.Item active>登录</Breadcrumb.Item>
      		</Breadcrumb>
  }
  render()  {
    return (
      	<div>
            <Panel header={this.getHeaders()} >
			<Form horizontal style={{marginTop:20}}>
			    <FormGroup controlId="formHorizontalEmail">
			      <Col componentClass={ControlLabel} sm={2}>
			        Email
			      </Col>
			      <Col sm={10}>
			        <FormControl type="email" placeholder="Email" />
			      </Col>
			    </FormGroup>

			    <FormGroup controlId="formHorizontalPassword">
			      <Col componentClass={ControlLabel} sm={2}>
			        Password
			      </Col>
			      <Col sm={10}>
			        <FormControl type="password" placeholder="Password" />
			      </Col>
			    </FormGroup>

			    <FormGroup horizontal style={{marginTop:50}}>
			      <Col smOffset={2} sm={10}>
			        <Button bsStyle="primary">
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
