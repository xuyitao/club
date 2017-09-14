import React from 'react'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel} from 'react-bootstrap';
import UserAction from'../actions/UserAction'
import UserStore from'../stores/UserStore'

export default class Topics extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      user:UserStore.getUser()
    }

  }
  componentDidMount() {
    // Decode entities in the URL

  }

  getTopics() {
  	return  <ButtonToolbar>
	      		<ToggleButtonGroup type="radio" name="options" defaultValue={1}>
			        <ToggleButton value={1}>全部</ToggleButton>
			        <ToggleButton value={2}>精华</ToggleButton>
			        <ToggleButton value={3}>分享</ToggleButton>
	      		</ToggleButtonGroup>
	    	</ButtonToolbar>
  }
  render()  {
    return (
      	<div>
            <Panel header={this.getTopics()} >
            </Panel>
      	</div>
    );
  }


}
