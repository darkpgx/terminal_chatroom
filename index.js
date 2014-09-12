//Starting Message.
console.log("Starting Terminal Chat");

//The code for terminal chat starts here

//Required modules
var http = require('http');
var prompt = require('prompt');
var request = require('request');
prompt.start();
var Notification = require('node-notifier');
var notifier = new Notification();
//End required modules

//Set up global vars to strings
var username = '',
    roomname = '',
    password = '',
    host = 'http://larryschatroom.herokuapp.com',
    my_inter,
    message_counter = 0;
//End set up global vars

//Error Handler
function onErr(err) {
  console.log(err);
  return 1;
};
//End Error Handler

//Prompt for credentials
prompt.get(['username', 'roomname', 'password'], function (err, result) {
  if(err) {return onErr(err);};
  console.log('  username: ' + result.username); //display user entered credentials
  console.log('  roomname: ' + result.roomname);
  console.log('  password: ' + result.password);
  username = result.username;
  roomname = result.roomname;
  password = result.password;

  //POST request for joining room
  my_inter = setInterval(function(){post(host + '/termchat/get', getchat, '');}, 1000);
  post(host + '/termchat/join', join_room, '');
});

//Function to POST
var post = function(url, action, send_msg) {
  request.post(url, {json: {"username" : username, "roomname" : roomname, "password" : password, "send_msg" : send_msg}},
      action);
};

//request for existing messages and prints on console
getchat = function(err,res,body) {
  if (res.body == "end") {return 0;};
  var arr = res.body;
  if (arr.length < 1) {return 0;}
  for (var j = message_counter; j< arr.length; j++) {
    if (arr[j]["username"] !== username && message_counter !== 0){
      notifier.notify({
        title: 'My awesome title',
        message: arr[j]["username"] + ": " + arr[j]["send_msg"],
        sound: 'Funk'
      });
    };
    console.log('' + arr[j]["username"] + ": " + arr[j]["send_msg"]);
  };
  message_counter = arr.length;
};

//chat function that prompts for chat messages one after another until exit entered
var chat = function (username, password) {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.get({properties: {':': {'hidden': true}}}, function (err, result) {
    if(result[':'] == 'exit') {console.log('Exiting chatroom'); clearInterval(my_inter); return 0;};
    var send_msg = result[':'];
    post(host + '/termchat/chat', function(err,res,body) {chat(username, password);}, send_msg);
  });
};

//joins a room then go to chat; if room does not eixist, create a new one
join_room = function(err,res,body) {
  if(!err && res.statusCode == 200){
    if(res.body == "Wrong password") {
      console.log(res.body); //error message
      clearInterval(my_inter);
      return 0;
    } else {
      console.log(res.body); //Join room message
      chat(username, password);
    };
  };
}

