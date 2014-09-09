var http = require('http');

var options = {
  host: 'localhost:8888',
  path: ''
};

http.request(options, function(response){console.log('hello');}).end();
