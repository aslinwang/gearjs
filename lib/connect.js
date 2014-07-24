/**
 * 职责链对象
 * https://github.com/wyicwx/mutils
 * @example
 *    var c = connect();
 *      c.use(function(data, next, done) {
 *        //coding
 *        next(data); //传递给下一个链函数处理 
 *      });
 *      c.use(function(data, next, done) {
 *        //coding2
 *        done(data); //跳过后面的链函数直接调用fire
 *      })
 *      c.fire();
 */
function _next(stack, callback){
  var count = 0;
  
  function done(arg){
    if(callback){
      callback(arg);
    }
  }

  function next(arg){
    var fn = stack[count++];
    if(fn){
      fn.handler(arg, next, done);
    }
    else{
      done(arg);
    }
  }

  next();
}

function Connect(){
  this.stack = [];
}

Connect.prototype.use = function(fn){
  this.stack.push({handler : fn});
  return this;
}

Connect.prototype.fire = function(callback){
  _next(this.stack, callback);
}

exports.Connect = Connect;