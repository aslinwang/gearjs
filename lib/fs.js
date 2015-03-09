var fs = require('fs');
var p = require('path');
var _ = require('underscore');
var q = require('q');
var http = require('http');
var conn = require('./connect.js');

exports.mkdir = function(path, basePath, callback){
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
        if(callback){
          fs.mkdir(data, 0777, callback);
        }
        else{
          fs.mkdirSync(data);
        }
      }
<<<<<<< HEAD
=======
      else{
        if(callback){
          callback();
        }
      }
>>>>>>> master
      next(data);
    });
  });
  connect.fire();
}

//file�����Ǵ�·�����ļ���������ļ�ϵͳ�в�����ĳ��·�������Զ�����
exports.writeFile = function(file, data, callback, basePath){
  var dirs = file.replace(/\//g, '\\').split(p.sep);
  dirs.pop();
  dirs = dirs.join('\\');

  if(fs.existsSync(dirs)){
    fs.writeFile(file, data, callback);
  }
  else{
    exports.mkdir(dirs, basePath, function(){
      fs.writeFile(file, data, callback);
    });
  }
}

//��ȡ�ļ����ݣ��ļ��������Ա��ػ�internet
//@param url �ļ�·��
//@param allowNoFile �����ļ������ڣ�������ʱ���Կ��ַ�������
exports.readFile = function(url, allowNoFile){
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
          if(allowNoFile){
            defer.resolve('');
          }
          else{
            defer.reject(url + ' 404!');
          }
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
        if(allowNoFile){
          defer.resolve('');
        }
        else{
          defer.reject(err);
        }
      }
    });
  }

  return defer.promise;
}

//˳���ȡ����ļ����ݣ��ļ��������Ա��ػ�Internet
exports.readFiles = function(urls){
  var datas = [];
  var defer = q.defer();
  
  function get(){
    var url = urls.shift();
    if(!url){
      defer.resolve(datas);
    }
    else{
      exports.readFile(url).done(function(v){
        datas.push(v);
        get();
      }, function(err){
        defer.reject(err);
      });
    }
  }

  get();

  return defer.promise;
}

/**
 * �����ļ���ָ��Ŀ¼
 * @param  {string} src         ��ԴĿ¼���ļ�·��
 * @param  {string} tarDir      Ŀ��Ŀ¼
 * @param  {array} namereplace  Ŀ���ļ����滻��������
 * @return {[type]}             [description]
 * 
 * @example
 * copyFile('/mobi/css/sprite/main.png', '/mobi/css/sprite/dist', [
<<<<<<< HEAD
 *   { regexp : '@', replacement : '-'},
 *   { regexp : '.png', replacement : '_141003.png'}
 * ]);
 */
exports.copyFile = function(src, tarDir, namereplace){
  var file = p.basename(src);
  tarfile = file;
  if(namereplace){
    _.each(namereplace, function(v, k){
      tarfile = tarfile.replace(v.regexp, v.replacement);
=======
 *   { match : '@', replacement : '-'},
 *   { match : '.png', replacement : '_141003.png', isreg:true}
 * ]);
 */
exports.copyFile = function(src, tarDir, namereplace, basePath){
  var file = p.basename(src);
  var defer = q.defer();
  tarfile = file;
  if(namereplace){
    _.each(namereplace, function(v, k){
      var match = (v.isreg ? new RegExp(v.match) : v.match);
      tarfile = tarfile.replace(match, v.replacement);
>>>>>>> master
    });
  }
  else{
    tarfile = file;
  }
<<<<<<< HEAD
  var srcRS = fs.createReadStream(src);
  var tarWS = fs.createWriteStream(p.join(tarDir, tarfile));
  var defer = q.defer();

  srcRS.pipe(tarWS);
  srcRS.on('end', function(){
    defer.resolve(tarfile);
=======

  exports.mkdir(tarDir, basePath, function(){
    var srcRS = fs.createReadStream(src);
    var tarWS = fs.createWriteStream(p.join(tarDir, tarfile));

    srcRS.pipe(tarWS);
    srcRS.on('end', function(){
      defer.resolve(tarfile);
    });
>>>>>>> master
  });
  return defer.promise;
}

/**
 * ���ƶ���ļ���ָ��Ŀ¼
 * @param  {array} files       Դ�ļ�·������
 * @param  {string} tarDir      Ŀ��·��
 * @param  {array} namereplace Ŀ���ļ����滻��������
 * @return {[type]}             [description]
 *
 * @example
 * copyFile([
 *   '/mobi/css/sprite/main.png',
 *   '/mobi/css/sprite/main-2x.png'
 * ], '/mobi/css/sprite/dist', [
 *   { regexp : '@', replacement : '-'},
 *   { regexp : '.png', replacement : '_141003.png'}
 * ]);
 */
exports.copyFiles = function(files, tarDir, namereplace){
  var defer = q.defer();
  var res = [];

  function get(){
    var file = files.shift();
    if(!file){
      defer.resolve(res);
    }
    else{
      exports.copyFile(file, tarDir, namereplace).done(function(src){
        res.push(src);
        get();
      });
    }
  }

  get();

  return defer.promise;
}

//ͬ�����Ŀ¼
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