console.log("Starting Terminal Chat");
var http = require('http');
var prompt = require('prompt');
prompt.start();
var username = '',
    roomname = '',
    password = '';

prompt.get(['username', 'roomname', 'password'], function (err, result) {
  /* this is where I stopped working. I need to come up with a way to run setInterval after my password is saved;
  var options = {host: "localhost", port: "8888", path: "/termchat/get?username=" + username + "&roomname=" + roomname + "&password=" + password};
  setInterval(function() {http.request(options, getchat).end();},1000);
  */
  if(err) {return onErr(err);};
  if(result.username == '' || result.roomname == '' || result.password == '') {console.log("Please do not leave any blanks.")}
  else {
    console.log('  username: ' + result.username);
    console.log('  roomname: ' + result.roomname);
    console.log('  password: ' + result.password);
    username = encodeURIComponent(result.username);
    roomname = encodeURIComponent(result.roomname);
    password = encodeURIComponent(result.password);
    var option1 = {host: "localhost", port: "8888", path: "/termchat/get?username=" + username + "&roomname=" + roomname + "&password=" + password};
    if (process.argv[2] == 'create') {
      var options = {host: "localhost", port: "8888"};
      options['path'] = "/termchat?username=" + username + "&roomname=" + roomname + "&password=" + password;
      http.request(options, print_res).end();
    }
    else {chat();};
  };
});

getchat = function(response) {
  var arr = [];
  response.on('data', function(dat){
    arr = [];
  });
  response.on('end', function(){
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i]["username"] + ": " + arr[i]["send_msg"] + "\n");
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

//another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

//the whole response has been recieved, so we just print it out here
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

//another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

//the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
    if(str == "Roomname Exists Already.") {return 0;};
    chat();
  });

}
