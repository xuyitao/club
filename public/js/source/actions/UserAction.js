/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

import AppDispatcher from'../dispatcher/AppDispatcher'
import UserConstants from'../constants/UserConstants'
import $ from 'jquery';

// var  host='http://127.0.0.1:8080'
var host='http://tk1.owngiftc.com'

var UserActions = {

  notify: function(msg) {
    AppDispatcher.dispatch({
      actionType: UserConstants.NOTIFY,
      msg: msg
    });
  },

  isVerify: function() {
    this.ajaxPost("/tkacc/verify",null, function(itemData,status,xhr){
      AppDispatcher.dispatch({
        actionType: UserConstants.LOGIN_VERIFY,
        isSus:true
      });
    });
  },

  logout: function() {
    this.ajaxPost("/user/logout",null);
    AppDispatcher.dispatch({
      actionType: UserConstants.LOGIN_OUT,
      isSus:true
    });
  },

  loginin:function (name, password) {
    if (name && password) {
        this.ajaxPost("/user/login",JSON.stringify({username:name, password:password}),
          function(itemData,status,xhr){
            AppDispatcher.dispatch({
              actionType: UserConstants.LOGIN_IN,
              isSus: true,
              name:itemData['name'],
              role:itemData['role'],
              tkacc:itemData['tkacc'],
              tkpid:itemData['tkpid']
            });
          }, function(xhr, status,err){
             AppDispatcher.dispatch({
               actionType: UserConstants.LOGIN_IN,
               isSus: false,
               errmsg:'login in fail err='+err.message
             });
          });
    }
    else {
        this.notify('params cannot empty.');
    }
  },

  loginInvaild: function() {
    AppDispatcher.dispatch({
      actionType: UserConstants.LOGIN_INVAILD
    });
  },

  changePwd: function(prepwd, curpwd){
      if (prepwd && curpwd) {
          this.ajaxPost("/user/changepwd",JSON.stringify({pre:prepwd, cur:curpwd}),
            function(itemData,status,xhr){
                if(itemData['result'] == 0){
                    this.notify('修改密码成功, 请重新登陆');
                    AppDispatcher.dispatch({
                      actionType: UserConstants.LOGIN_OUT,
                      isSus:true
                    });
                }
                else{
                    this.notify('修改密码失败 错误' + itemData['message']);
                }
            }.bind(this), function(xhr, status,err){
                this.notify('修改密码失败 错误' + err.message);
            }.bind(this));
      }
      else {
          this.notify('参数不正确');
      }
  },

  ajaxPost:function(url, data, funcSus, funcError) {
    return $.ajax({
      type: "POST",
      url: url,
      data: data,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(itemData,status,xhr) {
        if (itemData['result'] == 0) {
          if(funcSus) funcSus(itemData,status,xhr);
        } else {
          if(funcError) funcError(xhr, status,new Error(itemData['message']));
        }
      }.bind(this),
      error: function(xhr, status,err){
        if(xhr.status == 401) {
          this.loginInvaild();
        } else {
          if(funcError) {
            funcError(xhr, status,err);
          } else {
            // this.notify('Error Message='+err.message);
          }
        }
      }.bind(this)
    });
  },

  ajaxGet:function (url, funcSus, funcError) {
    return $.ajax({
      type: "GET",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(itemData,status,xhr) {
        if (itemData['result'] == 0) {
          if(funcSus) funcSus(itemData,status,xhr);
        } else {
          if(funcError) funcError(xhr, status,new Error(itemData['message']));
        }
      }.bind(this),
      error: function(xhr, status,err){
        if(xhr.status == 401) {
          this.loginInvaild();
        } else {
          if(funcError) {
            funcError(xhr, status,err);
          } else {
            // this.notify('Error Message='+err.message);
          }
        }
      }.bind(this)
    });
  },

  ajaxGetOri:function (url, funcSus, funcError) {
    return $.ajax({
      type: "GET",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(itemData,status,xhr) {
        funcSus(itemData,status,xhr);
      }.bind(this),
      error: function(xhr, status,err){
        if(funcError) {
          funcError(xhr, status,err);
        } else {
          // this.notify('Error Message='+err.message);
        }
      }.bind(this)
    });
  },

  jsoupPost:function (url, data, funcSus, funcError) {
    return $.ajax({
        url: host+url,
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        data:data,
        success: function(itemData,status,xhr) {
            funcSus(itemData,status,xhr);
        }.bind(this),
        error: function(xhr, status,err){
            if(funcError) {
                funcError(xhr, status,err);
            } else {
                // this.notify('Error Message='+err.message);
            }
        }.bind(this)
    });
  },
  jsoupGet:function (url, funcSus, funcError) {
    return $.ajax({
        url: host+url,
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        success: function(itemData,status,xhr) {
            funcSus(itemData,status,xhr);
        }.bind(this),
        error: function(xhr, status,err){
            if(funcError) {
                funcError(xhr, status,err);
            } else {
                // this.notify('Error Message='+err.message);
            }
        }.bind(this)
    });
  },

  queryConfig() {
    this.ajaxGet("/userconfig/getConfig",
      function(itemData,status,xhr){
        AppDispatcher.dispatch({
          actionType: UserConstants.CONFIG_CHANGE,
          config : itemData['data']
        });
      }.bind(this));
  },
  updateConfig(template) {
    this.ajaxPost("/userconfig/updateConfig",
      JSON.stringify({template:template}),
      function(itemData,status,xhr){
        this.notify("更新成功");
        AppDispatcher.dispatch({
          actionType: UserConstants.CONFIG_CHANGE,
          config : itemData['data']
        });
      }.bind(this));
  }
};

module.exports = UserActions;
