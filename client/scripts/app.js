$(document).ready(function() {
  var roomNames = {};

  
//function to output all messages for data object
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
  
  // need to add this functionality when you change pages
  var friendAdder = function(event) {
    var name = $(this).context.innerText;
    var usernames = $('.username');
    for (var i = 0; i < usernames.length; i++) {
      if (usernames[i].innerHTML === name) {
        console.log(usernames.eq([i]).text());
        usernames.eq([i]).toggleClass('friends');
      }
    }
  };
  
//generate all the rooms names
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
      
      $('.username').on('click', friendAdder);   
    }
  });
  
  
  //filters messages by room when changed in drop down
  $('.roomNames').change(function() {
    var room = $(this).val();
    var url = `http://parse.sfm8.hackreactor.com/chatterbox/classes/messages/?where={"roomname":"${room}"}`;
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        $('#chats').html('');
        outputMessages(data);
        $('.username').on('click', friendAdder); 
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
  
  //add a new message
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var $container = $('<div class="chat"></div>');
        var $message = $('<div class="message"></div>');
        var $name = $('<div class="username"></div>');
        var $time = $('<div class="time"></div>');
      
        $message.text(text);
        $name.text('Dandrew');
        $time.text(new Date().toLocaleString());
      
        $('#chats').prepend($container);
        $container.append($name);
        $container.append($message);
        $container.append($time);
        $('.username').on('click', friendAdder); 
        
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

});
