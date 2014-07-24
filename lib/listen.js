/**
 * 数据监听
 * @example 
 *   guid = listen.add(obj, function(data){
 *     
 *   });
 *
 *   listen.set(guid, obj);
 */
var _ = require('underscore');

var Listen = function(){
  this.guid = 0;
  this.stack = {};
}

Listen.prototype.add = function(obj, handler) {
  var guid = this.guid++;
  this.stack[guid] = {
    data : obj,
    handler : handler
  };
  return guid;
};

Listen.prototype.set = function(guid, data){
  _.extend(this.stack[guid].data, data);
  if(this.stack[guid].handler){
    this.stack[guid].handler(this.stack[guid].data);
  }
}

exports.listen = new Listen();