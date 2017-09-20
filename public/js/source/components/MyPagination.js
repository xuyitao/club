

import React from 'react'
import { Pagination } from 'react-bootstrap';

export default class MyPagination extends React.Component{
  constructor(props) {
    super(props);

    let pageSize=this.props.pageSize;
    let total = this.props.total;
    let totalPage = parseInt(total / pageSize) + 1;
    this.state = {
      activePage:this.props.current,
      totalPage:totalPage
    };
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps) {
      let pageSize=nextProps.pageSize;
      let total = nextProps.total;
      let totalPage = parseInt(total / pageSize) + 1;
      this.state = {
        activePage:nextProps.current,
        totalPage:totalPage
      };
    } else {
      this.setState({
        activePage:0,
        totalPage:1
      });
    }
  }
  onHandleSelect(page) {
    this.props.onChange(page);
    this.setState({
      activePage:page
    })
  }

  getPagination() {
    if(this.state.totalPage > 10) {
      return  <Pagination
                bsSize="medium"
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={this.state.totalPage}
                maxButtons={5}
                activePage={this.state.activePage}
                onSelect={this.onHandleSelect.bind(this)} />
    } else {
      return <Pagination
                bsSize="medium"
                items={this.state.totalPage}
                activePage={this.state.activePage}
                onSelect={this.onHandleSelect.bind(this)} />
    }
  }
  render()  {
    return (
      this.getPagination()
    );
  }
}
