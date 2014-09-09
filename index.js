var prompt = require('prompt');
prompt.start();
var http = require('http');
var username = '',
    rec_name = '',
    send_msg = '';
for (var i = 2; i < process.argv.length; i++){
  send_msg = send_msg + encodeURIComponent(process.argv[i] + ' ');
};
console.log(send_msg);

prompt.get(['username', 'Recepient_Name'], function(err, result) {
  if (err) { return onErr(err); }
  console.log('  Username: ' + result.username);
  console.log('  Recepient name: ' + result.Recepient_Name);
  username = encodeURIComponent(result.username);
  rec_name = encodeURIComponent(result.rec_name);
  var options = {
  host: 'localhost',
  port: '8888',
  path: '/getmessage?username=' + username + '&send_msg=' + send_msg + '&rec_name=' + rec_name
};

print_msg = function(res){
  res.on('data', function(res){
    console.log(res+'');
  });
};

http.request(options, print_msg).end();

});

function onErr(err) {
  console.log(err);
  return 1;
}


/*
var username = encodeURIComponent(process.argv[2]);
var rec_name = encodeURIComponent(process.argv[3]);
for (var i = 4; i < process.argv.length; i++){
  send_msg = send_msg + process.argv[i] + ' ';
};
send_msg = encodeURIComponent(send_msg);
console.log(send_msg);
var http = require('http');

*/
