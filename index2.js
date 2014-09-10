console.log("Starting Terminal Chat");
var http = require('http');
var prompt = require('prompt');
prompt.start();
var username = '',
    roomname = '',
    password = '';

prompt.get(['username', 'roomname', 'password'], function (err, result) {
  if(err) {return onErr(err);};
  if(result.username == '' || result.roomname == '' || result.password == '') {console.log("Please do not leave any blanks.")}
  else {
    console.log('  username: ' + result.username);
    console.log('  roomname: ' + result.roomname);
    console.log('  password: ' + result.password);
    username = encodeURIComponent(result.username);
    roomname = encodeURIComponent(result.roomname);
    password = encodeURIComponent(result.password);
    if (process.argv[2] == 'create') {
      var options = {host: "localhost", port: "8888"};
      options['path'] = "/termchat?username=" + username + "&roomname=" + roomname + "&password=" + password;
      http.request(options, print_res).end();
      var option1 = {host: "localhost", port: "8888", path: "/termchat/get?username=" + username + "&roomname=" + roomname + "&password=" + password};
      setInterval(function() {http.request(option1, getchat).end();},1000);
    }
    else {chat();
      var option1 = {host: "localhost", port: "8888", path: "/termchat/get?username=" + username + "&roomname=" + roomname + "&password=" + password};
      setInterval(function() {http.request(option1, getchat).end();},1000);
    };
  };
});

getchat = function(response) {
  var str = '';
  response.on('data', function(dat){
    str += dat;
  });
  response.on('end', function(){
    var arr = JSON.parse(str);
    for (var i = 0; i< arr.length; i++) {
      console.log(arr[i]["username"] + ": " + arr[i]["send_msg"]);
    };
  });
};

function chat () {
  prompt.get(['chat'], function (err, result) {
    if(result.chat == 'exit') {return 0;}
    var send_msg = encodeURIComponent(result.chat);
    var options = {host: "localhost", port: "8888", path: "/termchat/chat?username=" + username + "&roomname=" + roomname + "&password=" + password + "&send_msg=" + send_msg};
    http.request(options, sendchat).end();
  });
};

sendchat = function (response) {
  var str = '';

  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    if(str == "Roomname does not exist" || str == "Wrong password") {
      console.log(str);
      return 0;
    };
    chat();
  });

};

function onErr(err) {
  console.log(err);
  return 1;
};

print_res = function(response) {
  var str = '';

  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
    if(str == "Roomname Exists Already.") {return 0;};
    chat();
  });

}
