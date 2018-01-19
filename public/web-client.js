$(function () {
	var socket = io();
	var username = null;
	$('#username').focus();
	socket.emit ('userlist', {});

	$('#messageInput').submit(function(){
		var message = username + ': ' + $('#m').val();
		$('#messages').append( $('<li>').text( message ) );
		socket.emit ('message', {message : message });
		$('#m').val('');
		return false;
	});

	socket.on ('join', function(data) {
		if (username != null) {
			$('#messages').append($('<li>').text('| ' + data.username + ' joined. |'));
		}
		
		$('#users').append($('<li>').prop("id", data.username).text(data.username));
	});

    socket.on ('userlist', function(data) {
    	console.log ('Receiving user list!');
    	for (var i = 0; i < data.users.length; i ++) {
    		$('#users').append($('<li>').prop("id", data.users[i]).text(data.users[i]));
    		console.log (data.users[i]);
    	}
    });

    socket.on ('userLeft', function (data) {
    	if (username != null) {
    		$('#messages').append($('<li>').text('| ' + data.username + ' left. |'));
    	}

    	$('#' + data.username).remove();
    });

    socket.on('message', function(data){
      $('#messages').append($('<li>').text(data.username + ': ' + data.message));
    });

    $('#usernameInput').submit(function(e) {
    	e.preventDefault();
  		socket.emit ('join', {username : $('#username').val() });
  		username = $('#username').val ();
  		$('#messages').append($('<li>').text('| ' + username + ' joined. |'));
  		$('#login').hide();
	  	$('#m').focus();
    });
});