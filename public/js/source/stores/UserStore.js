/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var NOTIFY_EVENT = 'notify';
var LOGIN_EVENT = 'login';
var CONFIG_EVENT = 'config';

var _User = {
  isLogin: localStorage.isLogin,
  isRem: (localStorage.isRem == undefined ? true : localStorage.isRem),
  name:localStorage.name,
  role:localStorage.role,
  tkacc: localStorage.tkacc,
  tkpid: localStorage.tkpid,
};

var _notify= {
  level:'info',
  msg:'default'
}

var _UsrConfig = {
};


/**
 * Update a TODO item.
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateLogin(updates) {
  _User = assign({}, _User, updates);
}

function updateNotify(updates) {
  _notify = assign({}, _notify, updates);
}

function logout(msg) {
  localStorage.isLogin = false;
  localStorage.isRem = false;
  localStorage.name = null;
  localStorage.role = null;
  localStorage.tkacc = null;
  localStorage.tkpid = null;
  updateLogin({
    isLogin:false,
    isRem:false,
    name:null,
    tkacc: null,
    tkpid:null
  });
  updateNotify({
    msg:msg
  });
}


function updateConfig(updates) {
  _UsrConfig = assign({}, _UsrConfig, updates);
}

var UserStore = assign({}, EventEmitter.prototype, {


  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  isLogin: function() {
    return _User.isLogin;
  },

  isRem: function() {
    return _User.isRem;
  },

  getTkAcc: function() {
    return _User.tkacc;
  },

  getTkPid: function() {
    return _User.tkpid;
  },

  getUser: function() {
    return _User;
  },

  getMsg:function() {
    return _notify;
  },

  getConfig:function() {
    return _UsrConfig;
  },

  /**
   * change
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * notify
   */
  emitNotify: function() {
    this.emit(NOTIFY_EVENT);
  },
  addNotifyListener: function(callback) {
    this.on(NOTIFY_EVENT, callback);
  },

  removeNotifyListener: function(callback) {
    this.removeListener(NOTIFY_EVENT, callback);
  },

  /**
   * login
   */
  emitLogin: function() {
    this.emit(LOGIN_EVENT);
  },

  addLoginListener: function(callback) {
    this.on(LOGIN_EVENT, callback);
  },


  removeLoginListener: function(callback) {
    this.removeListener(LOGIN_EVENT, callback);
  },

  /**
   * config
   */
  emitConfig: function() {
    this.emit(CONFIG_EVENT);
  },
  addConfigListener: function(callback) {
    this.on(CONFIG_EVENT, callback);
  },
  removeConfigListener: function(callback) {
    // this.removeListener(CONFIG_EVENT, callback);
    this.removeAllListeners(CONFIG_EVENT);
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case UserConstants.LOGIN_VERIFY:
      updateLogin({
        isLogin:true
      });
      UserStore.emitChange();
      break;
    case UserConstants.LOGIN_VERIFY:
      updateLogin({
        isLogin:true
      });
      UserStore.emitChange();
      break;
    case UserConstants.NOTIFY:
      updateNotify({
        'msg':action.msg
      });
      UserStore.emitNotify();
      break;
    case UserConstants.LOGIN_IN:
      var isRem = true;//action.isRem;
      localStorage.isLogin = action.isSus;
      if(action.isSus) {
        localStorage.isRem = isRem;
        localStorage.name=action.name;
        localStorage.role=action.role;
        localStorage.tkacc=action.tkacc;
        localStorage.tkpid=action.tkpid;
        updateLogin({
          isLogin:action.isSus,
          name:action.name,
          role:action.role,
          tkacc:action.tkacc,
          tkpid:action.tkpid
        });
        UserStore.emitChange();
        UserStore.emitLogin();
      } else {
        updateNotify({
          isLogin:action.isSus,
          msg:action.errmsg
        });
        UserStore.emitLogin();
        UserStore.emitNotify();
      }
      break;
    case UserConstants.LOGIN_OUT:
      logout('登出成功');
      UserStore.emitChange();
      UserStore.emitNotify();
      break;
    case UserConstants.LOGIN_INVAILD:
      logout('请重新登陆');
      UserStore.emitChange();
      UserStore.emitNotify();
      break;

    case UserConstants.CONFIG_CHANGE:
      let config = action.config;
      updateConfig(config)
      UserStore.emitConfig();
      break;

    default:
      // no op
  }
});

module.exports = UserStore;
