var net = require('net');
var config = require('./config/master-config');
var sugar = require('sugar');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

var sockets = [];

var server = net.createServer();

server.on("connection", (socket) => {
    socket.setEncoding('utf-8');
    sockets.push(socket);

    console.log("New connection: " + socket.remoteAddress + ":" + socket.remotePort);
    console.log("Socket connected. Current socket count: " + sockets.length);

    socket.on('end', () => {
        console.log("Socket disconnected." + socket.remoteAddress + ":" + socket.remotePort);
        sugar.Array.remove(sockets, (s) => {
            return s.remoteAddress == socket.remoteAddress && s.remotePort == socket.remotePort;
        });
        console.log("Socket removed from the socket list. Current socket count: " + sockets.length);
    });
});

var port = config.socket.port;
var host = config.socket.ip;
server.listen(port, host, () => {
    console.log("Listening port : " + port);
    readline.question("Waiting user command. Write 'START' when you are ready \n", commandCallback);
});


function commandCallback(command) {
    if (command.toLowerCase() == 'start') {
        console.log("Commencing load test");
        startLoadTest();
        readline.question("waiting user command\n", commandCallback);
    }
    else if (command.toLowerCase() == 'exit') {
        console.log('Terminating application');
        closeClients();
        readline.close();
        server.close();
    }
    else {
        console.log("Unknown command");
        readline.question("Try again \n", commandCallback);
    }
};

function startLoadTest() {
    sockets.forEach(socket => {
        socket.write("start");
    })
};

function closeClients() {
    sockets.forEach(socket => {
        socket.write("terminate");
    })
}
