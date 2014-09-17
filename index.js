#!/usr/bin/env node
//Starting Message.
console.log("Starting Terminal Chat");

//The code for terminal chat starts here

//Required modules
var prompt = require('prompt');
prompt.start();
var Notification = require('node-notifier');
var notifier = new Notification();
var Firebase = require('firebase');
var fb = new Firebase('https://dazzling-inferno-9961.firebaseio.com/');
//End required modules

//Set up global vars to strings
var username = '',
    roomname = '',
    password = '',
    user_id = 2,
    chat_array = [],
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

  //join or create
  join(username, password, roomname);
});

//request for existing messages and prints on console
var print_chat = function(arr) {
  if (arr.length < 1) {return 0;}
  for (var j = message_counter; j< arr.length; j++) {
    if (arr[j]["username"] !== username && message_counter !== 0){
      notifier.notify({
        title: 'Terminal message received',
        message: arr[j]["username"] + ": " + arr[j]["msg"],
        sound: 'Funk'
      });
      console.log('' + arr[j]["username"] + ": " + arr[j]["msg"]);
    };
  };
  message_counter = arr.length;
};

//Chat function
var chat = function(username, password, roomname, user_id) {
  my_inter = setInterval(function(){print_chat(chat_array);}, 500);
  prompt.message = '';
  prompt.delimiter = '';
  prompt.get({properties: {':': {'hidden': true}}}, function (err, result) {
    clearInterval(my_inter);
    prompt.get(['Enter chat message: '], function (err, result) {
      if(result['Enter chat message: '] == 'exit') {
        fb.child(roomname).child(password).child(user_id).update({msg: username + " has exit the room"}, 
          function(){process.exit()});
      } else if(result['Enter chat message: '] == '/list') {
        list();
        chat(username, password, roomname, user_id);
      } else {
        var msg = result['Enter chat message: '];
        fb.child(roomname).child(password).child(user_id).update({msg: msg});
        chat(username, password, roomname, user_id);
      }
    });
  });
};

//join function
var join = function(username, password, roomname) {
  fb.child(roomname).once('value', function(dat){
    if (dat.val() == null || password in dat.val()) {
      joining();
      //fb.onDisconnect().update();
    }
    else if(!(password in dat.val())) {
      console.log('Wrong Password');
      process.exit();
    }
  });
};

var joining = function () {
  fb.child(roomname).child(password).once('value', function(dat){
    user_id = dat.numChildren() + 2;
    console.log("Join room: " + roomname + " with password: " + password);
    fb.child(roomname).child(password).child(user_id).update({
      username: username, msg: username + " has joined room: " + roomname
    });
    fb.child(roomname).child(password).child('users').child(user_id).update({username: username});
    fb.child(roomname).child(password).child('users').child(user_id).onDisconnect().update({username: null});

    fb.child(roomname).child(password).on('child_added', function(current, oldName){
      if('msg' in current.val()){chat_array.push({username: current.val().username, msg: current.val().msg});};
    });
    fb.child(roomname).child(password).on('child_changed', function(current, oldName){
      if('msg' in current.val()){chat_array.push({username: current.val().username, msg: current.val().msg});};
    });
    chat(username, password, roomname, user_id);
  });
};

var list = function(){
  fb.child(roomname).child(password).child('users').once('value', function(dat){
    var users = dat.val();
    console.log("Users: ");
    for(var key in users) {
      console.log(users[key]['username'] +', ');
    };
    console.log("are currently in the room");
  });
};
