var Firebase = require('firebase');
var fb = new Firebase('https://dazzling-inferno-9961.firebaseio.com/');
fb.remove(function(error){process.exit()});

