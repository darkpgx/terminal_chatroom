var http = require('http');
http.request({host: "localhost", port: "8888", path: "/termchat/get"}, function(res){
  var str ='';
  res.on('data', function(dat){
    str += dat;
  });
  res.on('end', function(){
    console.log(str);
  });
}).end();
