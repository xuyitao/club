import React from 'react'
import { Panel} from 'react-bootstrap';

import Config from '../../../../../config'

export default class TopicEditNav extends React.Component{
  constructor(props) {
    super(props);
  }

  render()  {
    return (
		<div>
			<Panel header="Markdown 语法参考" style={{marginTop:20}}>
				<p><tt>### 单行的标题</tt></p>
				<p><tt>**粗体**</tt></p>
				<p><tt>`console.log('行内代码')`</tt></p>
				<p><tt>```js\n code \n```</tt> 标记代码块</p>
				<p><tt>[内容](链接)</tt></p>
				<p><tt>![文字说明](图片链接)</tt></p>
				<span><a href='https://segmentfault.com/markdown' target='_blank'>Markdown 文档</a></span>
		    </Panel>
			<Panel header="话题发布指南" style={{marginTop:20}}>
				<p><tt>尽量把话题要点浓缩到标题里</tt></p>
				代码含义和报错可在 <a href="http://segmentfault.com/t/node.js">SegmentFault</a> 提问
		    </Panel>
		</div>
    )
  }
}
