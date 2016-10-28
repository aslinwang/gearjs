//继承underscore
var _ = require('underscore');
_.extend(exports, _);

//继承q（Promise Library）
var q = require('q');
_.extend(exports, {q:q});

//并发处理
var Do = require('./lib/do');
exports.Do = Do;
exports.do = function(fn){
  var d = new Do();
  if(fn){
    return d.do(fn);
  }
  else{
    return d;
  }
}

//职责链对象
var conn = require('./lib/connect');
exports.Connect = conn.Connect;
exports.connect = function(){
  return new exports.Connect();
}

//文件操作类
exports.fs = require('./lib/fs');

//工具类
exports.util = require('./lib/util');

//数据监听
exports.listen = require('./lib/listen').listen;

//计算简单对象长度
exports.jsonsize = function(json){
  var size = 0;
  for(var key in json){
    if(json.hasOwnProperty(key)){
      size++;
    }
  }
  return size;
}