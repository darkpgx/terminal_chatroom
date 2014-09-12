var request = require('request');

request.post(
    'http://localhost:8888/testing1',
    {json: { "roomname" : "1234", "password" : "1234", "username" : "Larry", "send_msg" : "POST is Working"}},
    function(err, res, body) {
      if(!err && res.statusCode == 200) {
        console.log(body);
      };
    }
);
