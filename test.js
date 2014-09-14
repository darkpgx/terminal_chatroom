var Notification = require('node-notifier');

var notifier = new Notification();
notifier.notify({
  title: 'My awesome title',
  sound: 'Hero',
  message: 'Hello from node, Mr. User!'
});
