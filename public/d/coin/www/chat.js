/* global io */

//$(function() {

  var necronomiCoin;

  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $messages = $('.messages'); // Messages area
  var $consoleMessages = $('.consoleMessages');
  var $console = $('.console');
  var $recipient = $('#recipient');
  var $quantity = $('#quantity');

  var $inputMessage = $('.inputMessage'); // Input message input box
  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $inputMessage.focus();

  var socket = io();

  function addParticipantsMessage (data) {

    console.log(data)

    /*
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
    */
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: home,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
   // var $typingMessages = getTypingMessages(data);
    options = options || {};

    var $usernameDiv = $('<span onclick="copyHome(\''+data.username+'\');" class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append('<span class="system">'+h(Date.now())+'</span> ',$usernameDiv,' ', $messageBodyDiv);

    addMessageElement($messageDiv, options);
    $('.chat')[0].scrollTop=$('.chat')[0].scrollHeight;
  }


  function addConsoleMessage (data, options) {
    

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    //var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      //.addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

   
      $consoleMessages.append($messageDiv);
    
      setTimeout(function () {
        $console[0].scrollTop = $console[0].scrollHeight;
      }, 2)

    }



  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      //if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      /*} else {
        setUsername();
      }*/
    }
  });

  // Click events

  // Focus input when clicking anywhere on login page


  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    /*
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
    */
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });
  
  //
  socket.on('console', function (data) {
    addConsoleMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    //log(data.username + ' joined');
    //addParticipantsMessage(data);
    
  });  

  socket.on('update users', function (data) {
    users=data;
    console.log(data)
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
  });


      socket.on('hash found', function (data) {

        //console.log(data)
        //return;
        
        var $minerDiv = $('<span onclick="copyHome(\''+data+'\');" class="username"/>')
        .text(data)
        .css('color', getUsernameColor(data))
        .css('font-weight', 'bold');

        cl = '#aaa';
        if (data==home) {cl = '#0FF';};

        var $messageDiv = $('<li class="message"/>')
        .data('username', data)
        .css('color', cl)
        //.addClass(typingClass)
        .append('<span class="system">'+h(Date.now())+'</span> '+'Block mined by '+data);

     
        $consoleMessages.append($messageDiv);
      
        setTimeout(function () {
          $console[0].scrollTop = $console[0].scrollHeight;
        }, 2)

    });


    socket.on('coin sent', function (data){

      var $senderDiv = $('<span onclick="copyHome(\''+data.sender+'\');" class="username"/>')
        .text(data.sender)
        .css('color', getUsernameColor(data.sender));

      var $recipientDiv = $('<span onclick="copyHome(\''+data.recipient+'\');" class="username"/>')
        .text(data.recipient)
        .css('color', getUsernameColor(data.recipient));

      var $messageBodyDiv = $('<span class="messageBody">')
        .text(' send 💸'+data.quantity+' to ');

      //var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        //.addClass(typingClass)
        .append('<span class="system">'+h(Date.now())+'</span> ',$senderDiv, $messageBodyDiv,$recipientDiv);

     
        $consoleMessages.append($messageDiv);
      
        setTimeout(function () {
          $console[0].scrollTop = $console[0].scrollHeight;
        }, 2)


    });


  socket.on('blockchain', function (data) {
    //srch=false;
    
    //console.log('blockchain')

    necronomiCoin=data;
    pending = 0;
    clearInterval(mineLoop);

    parseBlockchain()





  });


  socket.on('mine', function (data) {
    //console.log('Let\'s mine!');

    /*
        var $messageDiv = $('<li class="message"/>')
        //.addClass(typingClass)
        .append('<span class="system">'+h(Date.now())+'</span> '+'Mining...');

     
        $consoleMessages.append($messageDiv);
      
        setTimeout(function () {
          $console[0].scrollTop = $console[0].scrollHeight;
        }, 2)
    */

    mine(data);
  });

  socket.on('transaction', function (data) {
    //console.log('TRANSACTION DEMANDEE')
    //srch=true;
    mine(data);
  });

  socket.on('home', function (data) {
    home = data;
    document.getElementById('home').innerHTML = ''+home;
  });

//});


