var prompt = require('prompt');
prompt.start();
var http = require('http');
var username = '',
    rec_name = '',
    send_msg = '';

if(process.argv[2] == "receive"){
  prompt.get(['username'], function(err, result) {
    if (err) { return onErr(err); };
    console.log('  Username: ' + result.username);
    username = encodeURIComponent(result.username);
    var options = {
      host: 'localhost',
      port: '8888',
      path: 'receivemessage?username=' + username
    };
    http.request(options, print_msg).end();
  });
}

else if(process.argv[2] == "send"){
  prompt.get(['username', 'Recepient_Name', 'Message'], function(err, result) {
    if (err) { return onErr(err); }
    console.log('  Username: ' + result.username);
    console.log('  Recepient name: ' + result.Recepient_Name);
    console.log('  Message: ' + result.Message);
    username = encodeURIComponent(result.username);
    rec_name = encodeURIComponent(result.rec_name);
    send_msg = encodeURIComponent(result.Message);
    var options = {
      host: 'localhost',
      port: '8888',
      path: '/getmessage?username=' + username + '&send_msg=' + send_msg + '&rec_name=' + rec_name
    };
    http.request(options, print_msg).end();
  });
}
else{
  console.log('Please add either send or receive at the end.(e.g "node index.js send")');
};

function print_msg(res){
  res.on('data', function(res){
    console.log(res);
  });
}

function onErr(err) {
  console.log(err);
  return 1;
}

