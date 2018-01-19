var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients;
clients = {};

// allows express to serve entire folder, which means that index.html can access other files in the same directory (i.e. web-client.js)
app.use(require('express').static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  	console.log('Started server on port 3000');
});

io.on ('connection', function(socket) {
	clients[socket.id] = Client (socket);

	socket.on ('userlist', onUserList);	
	socket.on ('disconnect', onUserLeave);
	socket.on ('join', onUserJoin);
    socket.on ('message', onMessageSend);
});

function onUserList (data) {
	var users = [];

	for (var c in clients) {
		if (clients[c].username != null) {
			users.push (clients[c].username);
		}
	}

	io.to(this.id).emit ('userlist', {users : users});
}

function onUserLeave (data) {
	if (clients[this.id] != null) {
		leavingUser = clients[this.id].username; 

		console.log (leavingUser + ' has left');
		delete clients[this.id];

		for (var c in clients) {
			io.to(c).emit ('userLeft', {username: leavingUser});
		}

	} else {
		console.log ('Could not find client: ' + this.id);
	}
}

function onUserJoin (data) {
	clients[this.id].username = data.username;

	console.log ('user ' + data.username + ' has joined: ' + this.id);

	for (var c in clients) {
		if (c != this.id) {
			io.to(c).emit ('join', {username: data.username});
		}
	}
}

function onMessageSend (data) {
    for (var c in clients) {
        if (clients[c].username != null && c != this.id) {
            io.to(c).emit ('message', {username : clients[this.id].username, message : data.message});    
        }    
    }
}

var Client = function (socket) {
	socket = socket,
	username = null;

	return {
		socket : socket,
		username : username
	}
}
