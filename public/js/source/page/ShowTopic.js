import React from 'react'
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel, Form,
	FormGroup,Col, FormControl,ControlLabel, Button, Breadcrumb, HelpBlock,Alert,Row, Label} from 'react-bootstrap';
import _ from 'underscore'
import comFunc from '../../../../common/utils'
import marked from 'marked'
import {Link} from 'react-router-dom'
import Editor from 'react-md-editor'

export default class ShowTopic extends React.Component{
  constructor(props) {
    super(props);
    let topicId = this.props.match.params.topicId;
		this.state = {
			user:UserStore.getUser(),
			topicId:topicId,
			topic:null,
	  	replys:[],
			code:'',
			codeModel:1, //1 编辑  2预览
		}
  }
  componentDidMount () {
    this.getTopics();
  }
  getTopics() {
    let topicId =this.state.topicId;
    UserAction.ajaxPost("/topic/getDetail",
      JSON.stringify({topicId:topicId}),
      function(itemData,status,xhr){
				if(itemData) {
	        this.setState({
	          topic:itemData.topic,
	          replys:itemData.replys,
	  				linkContent:itemData.linkContent,
						isCollect:itemData.isCollect
	        })
				} else {
					UserAction.notify('此话题不存在或已被删除。');
					this.props.history.replace('/home')
				}
      }.bind(this));
  }


  topicTitle(topic) {
	  if(topic.top) {
		  return <Label bsStyle="warning">置顶</Label>
	  } else if(topic.good) {
		  return <Label bsStyle="warning">精华</Label>
	  } else if(topic.tab) {
		  return <Label bsStyle="warning">{topic.tab}</Label>
	  }
  }
	onSubmit(reply_id) {
		let code = this.state.code
		let topicId = this.state.topicId
		if(topicId.length == 0) {
			return UserAction.notify('话题不存在，不能回复');
		}

		if(code.length == 0) {
			return UserAction.notify('回复内容不能为空');
		}

		UserAction.ajaxPost("/reply/create",
		 	JSON.stringify({t_content:code,topicId:topicId}),
          	function(result,status,xhr){
            	UserAction.notify('发布成功');
          	}.bind(this), function(xhr, status,err){
			this.setState({
				errMsg:err.toString()
			})
		}.bind(this));
	}

	onDeleteTopic(topicId) {
		if(topicId.length == 0) {
			return UserAction.notify('话题不存在，不能回复');
		}
		UserAction.ajaxPost("/topic/delete",
			JSON.stringify({topicId:topicId}),
			function(result,status,xhr){
				UserAction.notify('删除成功');
				this.props.history.replace('/home')
			}.bind(this), function(xhr, status,err){
			this.setState({
				errMsg:err.toString()
			})
		}.bind(this));
	}
	onCollect(isCollect, topicId) {
		if(isCollect) {
			UserAction.ajaxPost("/topic/decollect",
				JSON.stringify({topicId:topicId}),
				function(result,status,xhr){
					UserAction.notify('取消成功');
					this.setState({isCollect:!isCollect})
				}.bind(this));
		} else {
			UserAction.ajaxPost("/topic/collect",
				JSON.stringify({topicId:topicId}),
				function(result,status,xhr){
					UserAction.notify('收藏成功');
					this.setState({isCollect:!isCollect})
				}.bind(this));
		}
	}
  getHeaders(topic) {
      return <div>
	      {this.topicTitle(topic)}
	      <span>{topic.title}</span>
      <div className="changes">
        <span>
          发布于 {comFunc.formatDate(topic.createdAt, true)}
        </span>
        <span>
          作者 <Link to={`/user/${topic.author_id.username}`}>{topic.author_id.username}</Link>
        </span>
        <span>
          	{topic.visit_count} 次浏览
        </span>
        { topic.createdAt != topic.updatedAt &&
          <span>
            最后一次编辑是 {comFunc.formatDate(topic.updatedAt, true)}
          </span>
				}
        { topic.tab &&
          <span> 来自 {topic.tab}</span>
	    	}

        {
					this.state.user &&
					<Button bsStyle="warning" onClick={(e)=>this.onCollect(this.state.isCollect,topic.objectId)}>{this.state.isCollect?'取消收藏':'收藏'}</Button>
	  		}
      </div>
      { this.state.user &&
      <div id="manage_topic">
	  	{ this.state.user.is_admin ?
			<div>
          <a href='/topic/<%= topic._id %>/top' data-method="post">
            {topic.top? <i className="fa fa-lg fa-star-o" title='取消置顶'></i>
			  :<i className="fa fa-lg fa-star" title='置顶'></i>
		  	}
          </a>


          <a href='/topic/<%= topic._id %>/good' data-method="post">
            {topic.good?<i className="fa fa-lg fa-heart-o" title="取消精华"></i>
	            :<i className="fa fa-lg fa-heart" title="加精华"></i>
            }
          </a>

          <a href='/topic/<%= topic._id %>/lock' data-method="post">
            { topic.lock ? <i className="fa fa-lg fa-unlock" title='取消锁定'></i>
              : <i className="fa fa-lg fa-lock" title='锁定（不可再回复）'></i>
		  	}
          </a>

          <a href='/topic/<%= topic._id %>/edit'>
            <i className="fa fa-lg fa-pencil-square-o" title='编辑'></i></a>
          <a href='javascript:;'
             data-id="<%= topic._id %>"
             className='delete_topic_btn'>
             <i className="fa fa-lg fa-trash" title='删除'></i></a>
			</div> :
			<div>
          {this.state.user.objectId == topic.author_id.objectId &&
			  <div>
          <Link to={`/topicedit/${topic.objectId}`}>
						<Button bsStyle="warning" >	编辑</Button>
					</Link>
					<Button bsStyle="warning" onClick={()=>this.onDeleteTopic(topic.objectId)}>删除</Button>
			  </div>
		 	}
          </div>
	  }


      </div>
  	}
    </div>
  }
  render()  {
	  let topic = this.state.topic
	  let preview = marked(this.state.code);
    return (
		<div>
	    <Panel>
		  	{topic &&
			  	<div>
						{this.getHeaders(topic)}
						<hr />
						<div className="preview" dangerouslySetInnerHTML={{__html: marked(this.state.linkContent)}} />
				</div>
				}
	    </Panel>
		  {topic && topic.reply_count > 0 &&
		  <Panel header={`${topic.reply_count} 回复`}>

		  </Panel>
		  }
		  <Panel header={"添加回复"}>
			  <Form horizontal >
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

				  <Button bsStyle="primary" onClick={(e)=>this.onSubmit()}>
					提交
				  </Button>
			  </Form>
	      </Panel>
	  	</div>
    );
  }
}
