import React from 'react'
import { Panel} from 'react-bootstrap';

import Config from '../../../../../config'

export default class SiginInNav extends React.Component{
  constructor(props) {
    super(props);
  }

  render()  {
    return (
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
  }
}
