import { createServer } from "http";
import { start } from "repl";
import { Server } from "socket.io";
import { createGameState, gameLoop } from "./game.js";
import Player from "./player.js";
import { generateId,getRndInteger } from "./utils.js";
const httpServer = createServer();

//creating and starting server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});
httpServer.listen(3000);

const state = {};
const clientToGameCode = {};
const gameInterval = {};

//client connected to server 
io.on('connection', handleConnectionByClient);

function handleConnectionByClient(client) {


    //handling client's key presses
    client.on('keydown', handleKeydown);
    client.on('keyup', handleKeyup);


    //client's game starting interactions
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);
    client.on('startGame', handleStartGame);
    client.once('disconnect', handleClientDisconnect);








    //implementation of event handler functions
    function handleKeydown(key) {
        const gameCode = clientToGameCode[client.id];
        if (!gameCode)
            return;
        if (state[gameCode]) {
            if (state[gameCode].players[client.id]) {
                switch (key) {
                    case 'ArrowLeft':
                        state[gameCode].players[client.id].keys.left.pressed = true;
                        break;

                    case 'ArrowRight':
                        state[gameCode].players[client.id].keys.right.pressed = true;
                        break;

                    case 'ArrowUp':
                        state[gameCode].players[client.id].keys.up.pressed = true;
                        break;
                    case 'ArrowDown':
                        state[gameCode].players[client.id].keys.down.pressed = true;
                        break;
                }
            }
        }

    }
    function handleKeyup(key) {
        const gameCode = clientToGameCode[client.id];
        if (!gameCode)
            return;
        if (state[gameCode]) {
            if (state[gameCode].players[client.id]) {
                switch (key) {
                    case 'ArrowLeft':
                        state[gameCode].players[client.id].keys.left.pressed = false;
                        break;

                    case 'ArrowRight':
                        state[gameCode].players[client.id].keys.right.pressed = false;
                        break;

                    case 'ArrowUp':
                        state[gameCode].players[client.id].keys.up.pressed = false;
                        break;
                    case 'ArrowDown':
                        state[gameCode].players[client.id].keys.down.pressed = false;
                        break;
                }
            }
        }
    }
    function handleNewGame(userName) {
        let gameCode = generateId(6);
        console.log(client.id);
        clientToGameCode[client.id] = gameCode;
        state[gameCode] = createGameState();
        client.emit('gameCode', gameCode);
        client.join(gameCode);
        state[gameCode].players[client.id] = (new Player({x:getRndInteger(100,500), y:getRndInteger(100,500), userName: userName}));
        client.number = 0;
        io.sockets.in(gameCode).emit('playerAdded', JSON.stringify(Object.values(state[gameCode].players)))
        client.emit('init', client.number);
        console.log(clientToGameCode);
        console.log(io.sockets.adapter.rooms.get(gameCode).size)
    }
    function handleJoinGame(detail) {
        const gameCode = detail.gameCode;
        const userName = detail.userName;
        if (!(io.sockets.adapter.rooms.get(gameCode)))
            client.emit('unknownGame');
        else {
            clientToGameCode[client.id] = gameCode;
            
            client.number = io.sockets.adapter.rooms.get(gameCode).size;
            client.join(gameCode);
            state[gameCode].players[client.id] = (new Player({x:getRndInteger(100,500), y:getRndInteger(100,500), userName: userName}));
            io.sockets.in(gameCode).emit('playerAdded', JSON.stringify(Object.values(state[gameCode].players)))
            console.log(client.number);
            client.emit('init', client.number);
            console.log(io.sockets.adapter.rooms.get(gameCode).size)
        }
    }

    function handleClientDisconnect() {
        const gameCode = clientToGameCode[client.id];
        delete clientToGameCode[client.id];
        if(state[gameCode]){
            delete state[gameCode].players[client.id];
            io.sockets.in(gameCode).emit('playerAdded', JSON.stringify(Object.values(state[gameCode].players)));
        }
        if (!(io.sockets.adapter.rooms.get(gameCode))) {
            if (state[gameCode]) {
                stopGameInterval(gameCode);
            }
        }
    }
    function handleStartGame() {
        const gameCode = clientToGameCode[client.id];
        startGameInterval(gameCode);
    }
}



function startGameInterval(gameCode) {
    gameInterval[gameCode] = setInterval(() => {
        gameLoop(state[gameCode]);
        io.sockets.in(gameCode).emit('renderGameState', JSON.stringify(Object.values(state[gameCode].players)));
    }, 1000 / 60);

    
}

function stopGameInterval(gameCode) {
    clearInterval(gameInterval[gameCode]);
    delete gameInterval[gameCode];
}



