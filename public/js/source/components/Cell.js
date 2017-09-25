import React from 'react'
import { Row, Col, Nav, NavItem, Well, Label, Image, ListGroup,ListGroupItem, Panel,Table, Button } from 'react-bootstrap';
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import {Route, Link} from 'react-router-dom'
import Config from '../../../../config'
import SiginInNav from './nav/SiginInNav'
import TopicEditNav from './nav/TopicEditNav'
import comFunc from '../../../../common/utils'


export default class Cell extends React.Component{
	constructor(props) {
		super(props);
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
  	render()  {
	let topic = this.props.data
    return (
        <div className='cell'>
			<a className="user_avatar pull-left" href={`/user/${topic.author_id.username}`}>
			    <img src={topic.author_id.avatar_url}
			         title={topic.author_id.loginname}/>
			</a>

			<span className="reply_count pull-left">
			    <span className="count_of_replies" title="回复数">
			      	{topic.reply_count}
			    </span>
			    <span className="count_seperator">/</span>
			    <span className="count_of_visits" title='点击数'>
			      	{topic.visit_count}
			    </span>
			</span>
			{
				topic.last_reply && topic.last_reply.author_id &&
				<a className='last_time pull-right' href={`/topicshow/${topic.id}`}>
				    <img className="user_small_avatar" src={topic.last_reply.author_id.avatar_url} />
				    <span className="last_active_time">{comFunc.formatDate(topic.last_reply.createdAt, true)}</span>
				</a>
			}
			{
				!topic.last_reply &&
				<span className='last_time pull-right'>
				   <span className="last_active_time">{comFunc.formatDate(topic.createdAt, true)}</span>
				</span>
			}
			<div className="topic_title_wrapper">
				{
					this.topicTitle(topic)
				}
			    <Link className='topic_title' to={`/topicshow/${topic.objectId}`} title={topic.title}>
				 	{topic.title}
			    </Link>
			</div>
        </div>
    )
  }
}
