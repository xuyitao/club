import React from 'react';
import NotificationSystem from 'react-notification-system'
import UserStore from'../stores/UserStore'
import UserAction from'../actions/UserAction'
import {BrowserRouter as Router, Route, Link, withRouter} from 'react-router-dom'
import { Navbar, Nav, NavItem, Row, Col,Grid,Badge  } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import RightNav from './RightNav'
import ScrollButton from './ScrollButton'
import Topics from '../page/Topics'
import SignIn from '../page/SignIn'
import Signup from '../page/Signup'
import TopicEdit from '../page/TopicEdit'
import Home from '../page/Home'
import ShowTopic from '../page/ShowTopic'
import GetStart from '../page/GetStart'
import '../../../stylesheets/app.less'
import '../../../stylesheets/common.css'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        user:UserStore.getUser(),
        unReadMsg:0
    }
  }

  _onChange() {
    this.setState({user:UserStore.getUser()});
    if(!UserStore.isLogin()) {
        this.props.history.replace('/signin')
    }
    this.onGetUnReadMsg();
  }
  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange.bind(this));
    UserStore.removeNotifyListener(this._addNotification.bind(this));
  }
  componentWillMount() {
    UserStore.addChangeListener(this._onChange.bind(this));
    UserStore.addNotifyListener(this._addNotification.bind(this));
  }
  componentDidMount () {
    this._notificationSystem = this.refs.notificationSystem;
    UserAction.isVerify();
    this.onGetUnReadMsg();
  }
  _addNotification() {
    var _notify=UserStore.getMsg();
    this._notificationSystem.addNotification({
      message: _notify.msg,
      level: _notify.level,
      autoDismiss:2
    });
  }
  onGetUnReadMsg() {
    if(this.state.user) {
  		UserAction.ajaxGet("/message/unReadMsg",
  			function(result,status,xhr){
  				this.setState({unReadMsg:result})
  			}.bind(this));
    }
	}

  render() {
    let user = this.state.user;
    return (
      <div>
        <NotificationSystem ref="notificationSystem" />
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <LinkContainer to="/home">
                            <img src="/images/cnodejs_light.svg" style={{width:128}}/>
                        </LinkContainer>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  <Nav pullRight>
                    <LinkContainer to="/home">
                        <NavItem eventKey={1.0}>首页</NavItem>
                    </LinkContainer>
                    { user &&
                      <LinkContainer to="/mymessages">
                          <NavItem eventKey={1.1}>未读消息<Badge>{this.state.unReadMsg}</Badge></NavItem>
                      </LinkContainer>
                    }
                    <LinkContainer to="/getstart">
                        <NavItem eventKey={2.0}>新手入门</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/topics">
                        <NavItem eventKey={3.0}>API</NavItem>
                    </LinkContainer>
                    { !user &&
                      <LinkContainer to="/signin">
                          <NavItem eventKey={4.0}>登陆</NavItem>
                      </LinkContainer>
                    }
                    { user &&
                        <NavItem eventKey={5.0} onClick={(e)=> UserAction.logout()}>登出</NavItem>
                    }

                  </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Grid>
            <Row className="show-grid">
              <Col sm={9} md={9}>
                <div style={{background:'red'}} style={{marginTop:20}}>
                    <Route exact path="/" component={Home}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/about" component={About}/>
                    <Route path="/topics" component={Topics}/>
                    <Route path="/signin" component={SignIn}/>
                    <Route path="/topicedit/:topicId" component={TopicEdit}/>
                    <Route path="/topicshow/:topicId" component={ShowTopic}/>
                    <Route path="/getstart" component={GetStart}/>
                    <Route path="/mymessages" component={GetStart}/>
                    <Route path="/github" component={() => (<Home login={true}/>)}/>
                </div>
              </Col>
              <Col sm={3} md={3}>
                <RightNav />
              </Col>
            </Row>
            </Grid>
            <div id='backtotop' style={backtotop}>回到顶部</div>
            <ScrollButton scrollStepInPx="50" delayInMs="16.66"/>
        </div>
    );
  }
}
const backtotop = {
  width: '24px',
  color: 'gray',
  padding: '12px 0px 12px 5px',
  display: 'none',
  position: 'fixed',
  cursor: 'pointer',
  textAlign: 'center',
  zIndex: '20px',
  backgroundColor: 'white',
  borderRadius: '12px 0px 0px 12px'
}

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)
App.propTypes = {
  children: React.PropTypes.node
};

export default withRouter(App);
