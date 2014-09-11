//Starting Message.
console.log("Starting Terminal Chat");

//The code for terminal chat starts here

//Required modules
var http = require('http');
var prompt = require('prompt');
prompt.start();
//End required modules

//Set up global vars to strings
var username = '',
    roomname = '',
    password = '',
    host = 'larryschatroom.herokuapp.com',
    port = '',
    my_inter;
    i = 0;
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
  username = encodeURIComponent(result.username); //parse credentials to URI format
  roomname = encodeURIComponent(result.roomname);
  password = encodeURIComponent(result.password);
  var set_interval_path = "/termchat/get?username=" + username + "&roomname=" + roomname + "&password=" + password;
  var options_for_pool = createOptions(host, port, set_interval_path);
  
  //create new room handler
  if (process.argv[2] == 'create') {
    var path_create = "/termchat?username=" + username + "&roomname=" + roomname + "&password=" + password;
    var options_create = createOptions(host, port, path_create);
    //making my_inter global to pass into other functions and stop it when prompt ends
    my_inter = setInterval(function() {http.request(options_for_pool, getchat).end();},1000);
    http.request(options_create, create_room).end();
  }
  //end create new room handler

  //create Join room Handler
  else {
    var path_join = "/termchat/join?username=" + username + "&roomname=" + roomname + "&password=" + password;
    var options_join = createOptions(host, port, path_join);
    //making my_inter global to pass into other functions and stop it when prompt ends
    my_inter = setInterval(function() {http.request(options_for_pool, getchat).end();},1000);
    http.request(options_join, join_room).end();
  };
  //End Join room Handler
});

//Required Functions

//Function to create path for request;

var createOptions = function (host, port, path){
  return {"host": host,
    "port" : port,
    "path" : path};
};

getchat = function(response) {
  var str = '';
  response.on('data', function(dat){
    str += dat;
  });
  response.on('end', function(){
    var arr = JSON.parse(str);
    for (var j = i; j< arr.length; j++) {
      console.log(' ' + arr[j]["username"] + ": " + arr[j]["send_msg"]);
      i = j+1;
    };
  });
};

//chat function that prompts for chat messages one after another until exit entered
var chat = function (username, password) {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.get([':'], function (err, result) {
    if(result[':'] == 'exit') {console.log('Exiting chatroom'); clearInterval(my_inter); return 0;};
    var send_msg = encodeURIComponent(result[':']);
    var path_sendchat = "/termchat/chat?username=" + username + "&roomname=" + roomname + "&password=" + password + "&send_msg=" + send_msg;
    var options_sendchat = createOptions(host, port, path_sendchat);
    http.request(options_sendchat, send_chat).end();
  });
};

//sends chat messages to server
send_chat = function(response) {
  var str = '';
  response.on('data', function (chunk) {
  });
  response.on('end', function () {
    chat(username, password);
  });
}

//creates a room then go to chat
create_room = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    if(str == "Roomname Exists Already.") {console.log(str); clearInterval(my_inter); return 0;};
    console.log(str);
    chat(username, password);
  });
}

//joins a room then go to chat
join_room = function(response) {
  var str = '';
  response.on('data', function(chunk) {
    str += chunk;
  });
  response.on('end', function () {
    if(str == "Roomname does not exist" || str == "Wrong password") {
      console.log(str); //error message
      clearInterval(my_inter);
      return 0;
    };
    console.log(str); //Join room message
    chat(username, password);
  });
}
