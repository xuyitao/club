import React from 'react'
import { Row, Col, Nav, NavItem, Well, Label, Image, ListGroup,ListGroupItem, Panel,Table, Button } from 'react-bootstrap';
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import {Route, Link, Switch} from 'react-router-dom'
import Config from '../../../../config'
import SiginInNav from './nav/SiginInNav'
import TopicEditNav from './nav/TopicEditNav'
import DefaultNav from './nav/DefaultNav'

export default class RightNav extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      user:UserStore.getUser()
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
  render()  {
    return (
        <Switch>
            <Route path="/about" component={SiginInNav}/>
            <Route path="/siginin" component={SiginInNav}/>
            <Route path="/topicedit" component={TopicEditNav}/>
            <Route component={DefaultNav}/>
        </Switch>
    )
  }
}

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)
const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)
