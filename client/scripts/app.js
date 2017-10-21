$(document).ready(function() {
  var roomNames = {};

  
//function to output all messages for data object
  var outputMessages = function(data) {
    for (var i = 0; i < data.results.length; i++) {
      var $container = $('<div class="chat"></div>');
      var $message = $('<div class="message"></div>');
      var $name = $('<div class="username"><span class="name"></span></div>');
      var $time = $('<div class="time"></div>');
      
      $message.text(data.results[i].text);
      $name.find('.name').text(data.results[i].username);
      var time = moment(data.results[i].createdAt).startOf('min').fromNow();
      $time.text(time);
      
      //insert the message text into our container div
      $('#chats').append($container);
      $container.append($name);
      $container.append($message);
      $container.append($time);
    }
  };
  //turns all messages into red when clicking on a username
  var friendAdder = function(event) {
    var name = $(this).context.innerText;
    var usernames = $('.username');
    for (var i = 0; i < usernames.length; i++) {
      if (usernames.eq([i]).find('.name')['0'].innerHTML === name) {
        usernames.eq([i]).closest('.chat').toggleClass('friends');
      }
    }
  };
  
//generate all the rooms names and original messages
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages/',
    type: 'GET',
    contentType: 'application/json',
    data: {order: '-createdAt'},
    success: function (data) {
      console.log(data);
      for (var i = 0; i < data.results.length; i++) {
        var room = data.results[i].roomname;
        if (!roomNames[room] && room) {
          roomNames[room] = true;
          var $newRoom = $(`<option value="${room}">${room}</option>`);
          $('select').append($newRoom);
        }
      }
      outputMessages(data);
      
      $('.name').on('click', friendAdder);   
    },
    error: function(data) {
      console.log('failed to get request', data);
    }

  });
  //// trying to refactor to data object
  //filters messages by room when changed in drop down
  $('.roomNames').change(function() {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages/',
      type: 'GET',
      contentType: 'application/json',
      data: { 
        'where': {'roomname': $(this).val()},
        'order': '-createdAt' 
      },
      success: function (data) {
        $('#chats').html('');
        outputMessages(data);
        $('.name').on('click', friendAdder); 
      },
      error: function (data) {
        console.error('error');
      }
    });
  });
  
  //submits the message to the server
  $('.new-room-btn').on('click', function(event) {
    event.preventDefault();
    var message = {
      username: 'Dandrew',
      text: $('input[type="text"]').val(),
      roomname: $('.roomNames').val()
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
        var $name = $('<div class="username"><span class="name"></span></div>');
        var $time = $('<div class="time"></div>');
      
        $message.text($('input[type="text"]').val());
        $name.find('.name').text('Dandrew');
        $time.text(moment().startOf('min').fromNow());
      
        $('#chats').prepend($container);
        $container.append($name);
        $container.append($message);
        $container.append($time);
        $('.name').on('click', friendAdder); 
        $('input[type="text"]').val(''); 
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
