var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients;
clients = {};


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  	console.log('Started server on port 3000');
});

io.on ('connection', function(socket) {
	clients[socket.id] = Client (socket);
	
	socket.on ('disconnect', function () {	
		if (clients[socket.id] != null) {
			leavingUser = clients[socket.id].username; 

			console.log (leavingUser + ' has left');
			delete clients[socket.id];

			for (var c in clients) {
				if (clients[c].username != null) {
					io.to(c).emit ('userLeft', {username: leavingUser});
				}
			}

		} else {
			console.log ('Could not find client: ' + socket.id);
		}
	});

	socket.on ('join', onUserJoin);
    socket.on ('message', onMessageSend);
});

function onUserJoin (data) {
	clients[this.id].username = data.username;

	console.log ('user ' + data.username + ' has joined: ' + this.id);

	for (var c in clients) {
		if (clients[c].username != null) {
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
