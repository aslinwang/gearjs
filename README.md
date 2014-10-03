gearjs
======

Some useful tools for nodejs development

Some tools are from https://github.com/wyicwx/mutils

##Usage
```javascript
var gear = require('gear');

var _ = gear._;//underscore

//watch object`s change
var listenid = gear.listen.add({}, function(data){//add watch
  //do something
});
gear.listen.set(listenid, {a:1});//set object, and will trigger callback function of 'add'

gear.jsonsize(jsonobj);//calculate the length of a simple json object

gear.fs.mkdir('a/b/c', './');//make dir ./a/b/c

gear.fs.readFile('test.js').done(function(data){//read local file
  //content of test.js
});
gear.fs.readFile('http://test.com/test.js').done(function(data){//read net file
  //content of test.js
});

gear.fs.copyFile(file, tarDir, [
  { regexp : '@', replacement : '-'}
]).done(function(src){
  
});

gear.fs.clearDirSync('a', function(){//remove all files from 'a' directory
  //do something
});

//Sequential execution in nodejs
var c = gear.connect();
c.use(function(data, next, done) {
  //coding1
  next(data); //pass to next function 
});
c.use(function(data, next, done) {
  //coding2
  done(data); //stop pass and trigger to fire
});
c.fire();

```
