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

var room_prompt = function(){
  prompt.get(['roomname'], function (err, result){
    roomname = result.roomname;
    if(err) {return onErr(err);};
    if(roomname == '') {console.log('Roomname cannot be empty.'); room_prompt();}
    else if(roomname == '/listroom') {listroom();}
    else if(roomname == 'exit') {process.exit();}
    else{pass_prompt(roomname);};
  });
}

room_prompt();

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

var joining = function () {
  fb.child(roomname).child(password).once('value', function(dat){
    user_id = dat.numChildren() + 2;
    if(password == "publicpasscode123g") {console.log("Join public room: " + roomname);}
    else{console.log("Join room: " + roomname + " with password: " + password);};
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

var listroom = function(){
  fb.once('value', function(snapshot){
    console.log('Rooms: ');
    for(key in snapshot.val()){
      if('publicpasscode123g' in snapshot.val()[key]){console.log(key + '(public room), ');}
      else{console.log(key + ', ');};
    };
    console.log('are available.');
    room_prompt();
  });
};

var pass_prompt = function(roomname){
  prompt.get(['password'], function(err, result){
    if(err) {return onErr(err);};
    if(result.password == 'exit') {process.exit();};
    password = result.password;
    if(password == ''){password = 'publicpasscode123g';};
    fb.once('value', function(snapshot){
      if(!(roomname in snapshot.val())){user_prompt(roomname, password);}
      else{
        fb.child(roomname).once('value', function(snapshot){
          if (password == 'exit'){process.exit();}
          else if(!(password in snapshot.val())){
            console.log('Wrong password');
            pass_prompt(roomname);
          } else {user_prompt(roomname, password);};
        });
      };
    });
  });
};

var user_prompt = function(roomname, password){
  prompt.get(['username'], function(err, result){
    if(err){return onErr(err);};
    username = result.username;
    if(username == '') {console.log('Username cannot be empty.'); user_prompt();}
    else if(username == 'exit'){process.exit();}
    else{
      fb.child(roomname).child(password).once('value', function(snapshot){
        if(snapshot.val() == null){joining();}
        else if(!('users' in snapshot.val())){joining();}
        else {
          for(key in snapshot.val()['users']){
            if (username == snapshot.val()['users'][key]['username']){
              console.log('Username: ' + username + ' already in use, choose differnt one ');
              user_prompt(roomname, password);
            } else{joining();};
          };
        };
      });
    };
  });
};
