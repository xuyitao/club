import React from 'react'
import { Panel, Image, Button, Label } from 'react-bootstrap';
import UserStore from'../../stores/UserStore'
import UserAction from'../../actions/UserAction'
import Config from '../../../../../config'
import {Route, Link, withRouter} from 'react-router-dom'
import _ from 'underscore'


export default class DefaultNav extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        user:UserStore.getUser(),
        unreplyTopics:[]
    }
  }
  _onChange() {
    this.setState({user:UserStore.getUser()});
  }
  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange.bind(this));
  }
  componentWillMount() {
    UserStore.addChangeListener(this._onChange.bind(this));
  }

  componentDidMount() {
		UserAction.ajaxGet("/topic/getUnReplyTopic",
    	function(itemData,status,xhr){
        this.setState({
          unreplyTopics:itemData
        })
    	}.bind(this));
	}

  _getUserInfo(user) {
    if(user) {
      return <div>
                <Link to='/user'>
                  <Image src={user.avatar_url} rounded />
                  <span>{user.username}</span>
                </Link>
                <p>{`积分：${user.score}`}</p>
                <i>{`"${user.signature?user.signature:'这家伙很懒，什么个性签名都没有留下。'}"`}</i>
              </div>
    } else {
      return  <div>
                <p>{Config.description}</p>
                <div>
                  您可以<Link to='/signin' > 登录 </Link>
                  或<Link to='/signup'> 注册 </Link>
                  , 也可以
                </div>
              </div>
    }
  }

  _getTop100() {
    return <span>积分榜  <Link to='/top100'>{'TOP 100 >>'}</Link></span>

  }

  render()  {
    let user = this.state.user;
    return (
      <div>
  		  <Panel header="个人信息" style={{marginTop:20}}>
          {
            this._getUserInfo(user)
          }
  	    </Panel>
        {
          user &&
          <Panel style={{marginTop:20}}>
            <Link to='/topicedit' >
              <Button bsStyle="warning">发布话题</Button>
            </Link>
    	    </Panel>
        }
        <Panel header="我是广告" style={{marginTop:20}}>
        {
          '我是广告'
        }
  	    </Panel>

        <Panel header="无人回复的话题" style={{marginTop:20}}>
        {
          _.map(this.state.unreplyTopics, function (topic, index) {
            return <Link key={index} to={`/topicshow/${topic.objectId}`}><p>{topic.title}</p></Link>
          })
        }
  	    </Panel>

        <Panel header={this._getTop100()} style={{marginTop:20}}>
        {
          '我是广告'
        }
       </Panel>
       <Panel header={'友情社区'} style={{marginTop:20}}>
           <a href="https://ruby-china.org/" target="_blank">
             <Image style={{width:140}} src="/images/ruby-china-20150529.png"/>
           </a>
           <br /><br />
           <a href="http://golangtc.com/" target="_blank">
             <Image style={{width:140}} src="/images/golangtc-logo.png"/>
           </a>
           <br /><br />
           <a href="http://phphub.org/" target="_blank">
             <Image style={{width:140}} src="/images/phphub-logo.png" />
           </a>
       </Panel>
       <Panel header={'客户端二维码'} style={{marginTop:20}}>
          <img width='200' src="//dn-cnode.qbox.me/FtG0YVgQ6iginiLpf9W4_ShjiLfU"/>
          <br />
          <a href="https://github.com/soliury/noder-react-native" target="_blank">客户端源码地址</a>
        </Panel>
      </div>
    )
  }
}
