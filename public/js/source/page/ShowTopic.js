import React from 'react'
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel, Form,
	FormGroup,Col, FormControl,ControlLabel, Button, Breadcrumb, HelpBlock,Alert,Row  } from 'react-bootstrap';
import _ from 'underscore'
import comFunc from '../../../../common/utils'
import marked from 'marked'

export default class ShowTopic extends React.Component{
  constructor(props) {
    super(props);
    let topicId = this.props.match.topicId;
	this.state = {
		user:UserStore.getUser(),
		topicId:topicId,
		topic:null,
  	  	replys:[]
	}
  }
    componentDidMount () {
        this.getTopics();
    }
    getTopics() {
        let topicId =this.state.topicId;
        UserAction.ajaxPost("/topic/show",
          JSON.stringify({topicId:topicId}),
          function(itemData,status,xhr){
                this.setState({
                  topic:itemData.topic,
                  replys:itemData.replys
                })
          }.bind(this));
    }


  topicTitle(topic) {
	  if(topic.top) {
		  return <span className='put_top'>置顶</span>
	  } else if(topic.good) {
		  return <span className='put_good'>精华</span>
	  } else if(topic.tab === 'all' && topic.tabName) {
		  <span className="topiclist-tab">{topic.tabName}</span>
	  }
  }

  getHeaders(topic) {
      return <div className='header topic_header'>
      <span className="topic_full_title">
        {this.topicTitle(topic)}
        {topic.title}
      </span>
      <div className="changes">
        <span>
          发布于 {comFunc.formatDate(topic.createdAt, true)}
        </span>
        <span>
          作者 <a href="/user/<%= topic.author.loginname %>">{topic.author.loginname}</a>
        </span>
        <span>
          	{topic.visit_count}次浏览
        </span>
        { topic.createdAt != topic.updatedAt &&
          <span>
            最后一次编辑是 {comFunc.formatDate(topic.updatedAt, true)}
          </span>
		}
        { topic.tab &&
          <span> 来自 {topic.tabName}</span>
	    }

        { this.state.product &&
          <input className={`span-common ${is_collect ? '' : 'span-success'} pull-right collect_btn`}
		  	type="submit" value={is_collect ? '取消收藏' : '收藏'}
			action={is_collect ? 'de_collect' : 'collect'} />
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
          {this.state.user.id.equals(topic.author_id) &&
			  <div>
	          <a href='/topic/<%= topic._id %>/edit'>
	            <i className="fa fa-lg fa-pencil-square-o" title='编辑'></i></a>
	          <a href='javascript:;'
	             data-id="<%= topic._id %>"
	             className='delete_topic_btn'>
	             <i className="fa fa-lg fa-trash" title='删除'></i></a>
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
    return (
		<div>
	      <Panel>
		  	{topic &&
		  	<div className='inner topic'>
				{this.getHeaders(topic)}
				<div className='topic_content'>
				  <div className="preview" dangerouslySetInnerHTML={{__html: marked(this.state.topic.content)}} />
				</div>
			</div>
			}
	      </Panel>
		  {topic && topic.reply_count > 0 &&
		  <Panel header={`${topic.reply_count} 回复`}>

		  </Panel>
		  }
		  <Panel header={"添加回复"}>

	      </Panel>
	  	</div>
    );
  }
}
