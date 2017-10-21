$(document).ready(function() {
  var roomNames = {};
  var friends = {};
  
  var outputMessages = function(data) {
    for (var i = 0; i < data.results.length; i++) {
      var $container = $('<div class="chat"></div>');
      var $message = $('<div class="message"></div>');
      var $name = $('<div class="username"></div>');
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
  
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      // iterate over all objects in array
      for (var i = 0; i < data.results.length; i++) {
        var room = data.results[i].roomname;
        if (!roomNames[room] && room) {
          roomNames[room] = true;
          var $newRoom = $(`<option value="${room}">${room}</option>`);
          $('select').append($newRoom);
        }
      }
      outputMessages(data);  
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
  
  
  //filters messages by room when changed in drop down
  $('.roomNames').change(function() {
    console.log('changed');
    var room = $(this).val();
    var url = `http://parse.sfm8.hackreactor.com/chatterbox/classes/messages/?where={"roomname":"${room}"}`;
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        $('#chats').html('');
        outputMessages(data);
      },
      error: function (data) {
        console.error('error');
      }
    });
  });
  
  //submits the message to the server
  $('input[type="submit"]').on('click', function(event) {
    event.preventDefault();
    var text = $('input[type="text"]').val();
    $('input[type="text"]').val('');
    var room = $('.roomNames').val();
    var message = {
      username: 'Dandrew',
      text: text,
      roomname: room
    };
    
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var $container = $('<div class="container"></div>');
        var $message = $('<div class="message"></div>');
        var $name = $('<div class="name"></div>');
        var $time = $('<div class="time"></div>');
      
        $message.text(text);
        $name.text('Dandrew');
        $time.text(new Date().toLocaleString());
      
      //insert the message text into our container div
        $('#chats').prepend($container);
        $container.append($name);
        $container.append($message);
        $container.append($time);
        
      },
      error: function (data) {
        console.error('chatterbox: failed to send new message', data);
      }
    });  
  });
  
  //adds a new room
  $('.addroom').on('click', function(event) {
    event.preventDefault();
    var newRoom = prompt('Enter new room name.');
    if (newRoom && !roomNames[newRoom]) {
      var $newRoom = $(`<option value="${newRoom}" selected>${newRoom}</option>`);
      $('select').prepend($newRoom);
      $('#chats').html('');
    }
  }); 
  
  $('div.username').on('click', function(event) {
    console.log('asdf');
    event.preventDefault();
    var name = $(this).val();
  }); 
  
});
  
  //sort by time
  //moment.js library





