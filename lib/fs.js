var fs = require('fs');
var p = require('path');
var _ = require('underscore');
var q = require('q');
var http = require('http');
var conn = require('./connect.js');

exports.mkdir = function(path, basePath){
  var dirs = path.split(p.sep);
  var connect = new conn.Connect();

  _.each(dirs, function(){
    connect.use(function(data, next){
      if(!data){
        basePath || (basePath = '/');
        data = p.normalize(basePath);
      }

      data = p.join(data, dirs.shift());
      if(!fs.existsSync(data)){
        fs.mkdirSync(data);
      }
      next(data);
    });
  });
  connect.fire();
}

//??????,?????????internet
exports.readFile = function(url){
  var isNet = url.indexOf('http') != -1;
  var defer = q.defer();
  if(isNet){
    var chunks = '';
    http.get(url, function(res){
      res.on('data', function(chunk){
        chunks += chunk;
      });
      res.on('end', function(){
        if(res.statusCode == 200){
          defer.resolve(chunks);
        }
        else{
          defer.reject(url + ' 404!');
        }
      })
    }).on('error', function(e){
      defer.reject(e);
    });
  }
  else{
    fs.readFile(url, {encoding : 'utf-8'}, function(err, data){
      if(!err){
        defer.resolve(data);
      }
      else{
        defer.reject(err);
      }
    });
  }

  return defer.promise;
}

//??????
exports.clearDirSync = function(dir, callback){
  try{
    var files = fs.readdirSync(dir);
  }
  catch(e){
    return;
  }
  if(files.length > 0){
    _.each(files, function(file, key){
      var filePath = dir + '/' + file;
      if(fs.statSync(filePath).isFile()){
        fs.unlinkSync(filePath);
        if(callback){
          callback(filePath);
        }
      }
      else{
        exports.clearDirSync(filePath);
      }
    });
  }
}