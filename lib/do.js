/**
 * 并发处理函数
 * https://github.com/wyicwx/mutils
 * @example
 *    var app = do();
 *      app.do(function(done) {
 *        //do something
 *          done(1);
 *      });
 *      app.do(function() {
 *        //do something
 *          done(2);
 *      });
 *      app.done(function(result1, result2) {
 *        console.log(arguments);
 *        //[1,2]
 *      });
 */
var _gid = 0;

function _done(id, self){
  return function(data){
    var args;
    if(arguments.length > 1){
      args = Array.prototype.slice.call(arguments);
    }
    else{
      args = data;
    }
    self.doned[id] = true;
    self.doneArgs[id] = args;
    self.done();
  }
}

function _checkDone(self){
  for(var i in self.doned){
    if(!self.doned[i]){
      return false;
    }
  }
  return true;
}

function Do(){
  this.doned = {};
  this.doneArgs = {};
}

Do.prototype.do = function(fn){
  var id = ++_gid;
  this.doned[id] = false;
  fn(_done(id, this));

  return this;
}

Do.prototype.done = function(fn){
  if(!fn){
    return;
  }
  this.done = function(){
    if(_checkDone(this)){
      var args = [];
      for(var i in this.doned){
        args.push(this.doneArgs[i]);
      }
      fn.apply(null, args);
    }
  };
  this.done();
}

exports.Do = Do;