import React from 'react'
import { Row, Col, Nav, NavItem, Well, Label, Image, ListGroup,ListGroupItem, Panel,Table, Button } from 'react-bootstrap';
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'
import {Route, Link} from 'react-router-dom'
import Config from '../../../../config'

export default class RightNav extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      user:UserStore.getUser()
    }

  }
  componentDidMount() {
    // Decode entities in the URL

  }
  render()  {

    // return (
    //   	<div>
	// 		{ this.state.user &&
	// 	  	<Panel header="个人信息" style={{marginTop:20}}>
    //
	// 			<Button bsStyle="info" onClick={e=>this._onExportBill()}>导出账单表</Button>
	// 		</Panel>
	// 		}
    //         { this.state.user &&
	// 	  	<Panel style={{marginTop:20}}>
	// 			<Button bsStyle="warning" onClick={e=>this._onExportBill()}>发布话题</Button>
	// 		</Panel>
	// 		}
    //         <Panel header="此处是广告" style={{marginTop:20}}>
    //         </Panel>
    //   	</div>
    // );
    return (
        <div>
            <Route exact path="/" component={SiginIn}/>
            <Route path="/home" component={SiginIn}/>
            <Route path="/about" component={SiginIn}/>
            <Route path="/siginin" component={SiginIn}/>
        </div>
    )
  }
}

const SiginIn = () => (
    <Panel header="关于" style={{marginTop:20}}>
        <p>{Config.description}</p>

        <p>在这里你可以：</p>
        <ul>
            <li>向别人提出你遇到的问题</li>
            <li>帮助遇到问题的人</li>
            <li>分享自己的知识</li>
            <li>和其它人一起进步</li>
        </ul>
    </Panel>
)

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
