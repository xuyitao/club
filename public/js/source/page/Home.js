import React from 'react'
import UserAction from'../actions/UserAction'
import config from '../../../../config.js'
import { ButtonToolbar, ToggleButtonGroup, ToggleButton, Panel, Form,
	FormGroup,Col, FormControl,ControlLabel, Button, Breadcrumb, HelpBlock,Alert,Row  } from 'react-bootstrap';
import _ from 'underscore'
import Pagination from '../components/MyPagination';
import Center from 'react-center';
import Cell from '../components/Cell';

export default class Home extends React.Component{
  constructor(props) {
    super(props);
    let tabs = [{key:'all', value:'全部'}, {key:'good',value:'精华'}].concat(config.tabs)
    this.state = {
        tabs:tabs,
        selectTab:'all',
        currentPage:1,
        products:[],
        total:0,
        currentPageSize:10
    }
  }
  componentDidMount () {
    this.getTopics();
		console.log(this.props.login);
		if(this.props.login) {
			UserAction.isVerify();
		}
  }
  getTopics() {
      let selectTab =this.state.selectTab;
      let page = this.state.currentPage - 1;
      UserAction.ajaxPost("/topic/getByPage",
        JSON.stringify({tab:selectTab, page:page, size:this.state.currentPageSize}),
        function(itemData,status,xhr){
              this.setState({
                products:itemData.data,
                total:parseInt(itemData.total)
              })
        }.bind(this));
  }
  onPageChange(page) {
      this.setState({
          currentPage: page,
          products:[]
      }, function () {
          this.getTopics();
      });
  }
  _SelectTab(tabType) {
      this.setState({
          selectTab:tabType,
          page:0
      }, function () {
          this.getTopics();
      })
  }
  getHeaders() {
      let that = this;
      let selectTab = this.state.selectTab;
      return _.map(this.state.tabs, function (tab,index) {
          let value = tab.key;
          return <a onClick={(e)=>that._SelectTab(value)} href='#' key={index}
                className={`topic-tab ${value === selectTab ? 'current-tab':''}`}>{tab.value}</a>
      })
  }
  render()  {
    return (
      <Panel header={this.getHeaders()}>
        {
            _.map(this.state.products, function (product,index) {
                return <Cell key={index} data={product}/>
            })
        }
        <Center>
            { this.state.total != 0 &&
                <Pagination onChange={this.onPageChange.bind(this)} current={this.state.currentPage}
                    pageSize={this.state.currentPageSize} total={this.state.total} />
            }
        </Center>
      </Panel>
    );
  }
}
