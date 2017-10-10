var io = require ('socket.io-client');
var readline = require ('readline');

var rl = readline.createInterface ({
	input: process.stdin,
	output: process.stdout
});

username = '';

var socket = io.connect ('http://localhost:3000');

socket.on('connect', function() {
	console.log ('connected to socket server.');
	rl.question ('choose a username.\n', function (answer) {
		socket.emit ('join', {username : answer});
		username = answer;
	});
});

socket.on ('join', function (data) {
	rl.pause ();
	console.log ('\n');
	console.log ('| ' + data.username + ' joined. |\n');
	rl.prompt ();

	sendMessage ();
});

socket.on ('message', function (data) {
	rl.pause ();
	console.log ('\n');
    console.log (data.username + ': ' + data.message);
    rl.prompt (); 
});

socket.on ('userLeft', function (data) {
	rl.pause ();
	console.log ('\n');
	console.log ('| ' + data.username + ' left. |\n');
	rl.prompt ();
});

function sendMessage () {
		rl.question ("\x1b[1m\x1b[34m" + username + '\x1b[0m: ', function (input) {
			console.log ('\n');
			socket.emit ('message', {message : input});
			sendMessage ();
		});
}