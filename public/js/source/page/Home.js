import React from 'react'
import UserAction from'../actions/UserAction'

export default class Home extends React.Component{
  constructor(props) {
    super(props);

  }
  componentDidMount () {
  }

  render()  {
    return (
      <div style={{ margin: 20 }}>
        <h2>Hello</h2>
      </div>
    );
  }
}
