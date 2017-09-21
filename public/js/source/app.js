import React from 'react'
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import App from './components/App';
// import Home from './page/Home';


function requireAuth(nextState, replace) {
  if (!UserStore.isLogin()) {
    replace({
      pathname: '/signin',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function routerChanged(e, d){
    if ( (e['location']['action'] == 'PUSH' || e['location']['action'] == 'REPALCE' )&& e['location']['pathname'] == '/createItem'){
        var myCustomEvent = new Event('createItemActivated');
        document.dispatchEvent(myCustomEvent);
    }
}


ReactDOM.render ((
    <Router>
        <App />
    </Router>
), document.querySelector('#root'))
