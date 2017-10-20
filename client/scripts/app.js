// YOUR CODE HERE:
var message = {
  username: 'Dandrew',
  text: 'Hello Everyone',
  roomname: '4chan'
};

    
    //container div
    //head div, append it to the container
    //make a message div, append head
    //make a time div, append to message div

$.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  }
});

$.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Messages Recieved', data);
    //loop to go through all our data
    for (var i = 0; i < data.results.length; i++) {
      var $container = $('<div class="container"></div>');
      var $message = $('<div class="message"></div>');
      var $name = $('<div class="name"></div>');
      var $time = $('<div class="time"></div>');
      
      $message.text(data.results[i].text);
      $name.text(data.results[i].username);
      $time.text(data.results[i].createdAt);
      
      //insert the message text into our container div
      $('#chats').prepend($container);
      $container.append($name);
      $container.append($message);
      $container.append($time);
    }
      //append container dive to the chats class
    
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  }
});


