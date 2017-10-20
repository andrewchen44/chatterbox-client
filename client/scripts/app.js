$(document).ready(function() {
  var outputMessages = function(data) {
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
  };
  
  
  $('.roomNames').change(function() {
    var room = $(this).val();
    var url = `http://parse.sfm8.hackreactor.com/chatterbox/classes/messages/?where={"roomname":"${room}"}`;
    console.log(url);
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        $('#chats').html('');
        outputMessages(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to get new data', data);
      }
    });
  });
  


  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages Recieved', data);
      //loop to go through all our data
      outputMessages(data);
        //append container dive to the chats class
      
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

});



