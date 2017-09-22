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
			topicId:this.props.match.params.topicId,
			errMsg:null,
			tabs:config.tabs,
			selectTab:'share',
			code:'',
			codeModel:1, //1 编辑  2预览
			title:'',
		};
		// console.log(this.props.match);

  	}
  	componentDidMount() {

  	}

  	onSubmit(e) {
	  	e.preventDefault();
		let tab = this.state.selectTab
		let title = this.state.title
		let code = this.state.code
		let topicId = this.state.topicId
		if(title.length == 0) {
			return UserAction.notify('标题不能为空');
		}
		if(tab.length == 0) {
			return UserAction.notify('未选择分类');
		}

		UserAction.ajaxPost("/topic/create",
		 	JSON.stringify({tab:tab, title:title, t_content:code,topicId:topicId}),
          	function(result,status,xhr){
            	UserAction.notify('发布成功');
          	}.bind(this), function(xhr, status,err){
			this.setState({
				errMsg:err.toString()
			})
		}.bind(this));
  	}

  	render()  {
		let preview = marked(this.state.code);
    	return (
      	<div>
          <Panel header={'编辑话题'}>
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
					        <FormControl type="text" placeholder="标题字数 10个字以上" onChange={(e)=>this.setState({ title: e.target.value })}/>
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
