const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.82;
let currentPlayer;

const socket = io('http://localhost:3000');



//html imports
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const lobby = document.getElementById('lobby');
const joinGameBtn = document.getElementById('joinGameBtn');
const newGameBtn = document.getElementById('newGameBtn');
const gameCode = document.getElementById('inputGameCode');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const gameCodeText = document.getElementById('gameCodeText');
const userName = document.getElementById('name');
const startGame = document.getElementById('startGame');
const joinedPlayers = document.getElementById('joinedPlayers');


//event listeners are added here
joinGameBtn.addEventListener('click', () => {
    if (gameCode.value && userName.value) {
        socket.emit('joinGame', {gameCode: gameCode.value, userName: userName.value.toLocaleUpperCase()});
    }
    else {
        alert('enter your name and code and try again')
        gotoHome();
    }
        
});

newGameBtn.addEventListener('click', () => {
    if (userName.value) {
        socket.emit('newGame', userName.value.toLocaleUpperCase());
    }
    else {
        alert('enter your name and try again')
        gotoHome();
    }
});

startGame.addEventListener('click', () => {
    socket.emit('startGame');
});

addEventListener('keydown', (event) => {
    socket.emit('keydown', event.key);
});

addEventListener('keyup', (event) => {
    socket.emit('keyup', event.key);
});



//listening to server events
socket.on('renderGameState', handleRenderGameState);
function handleRenderGameState(gameState) {
    gotoGame();
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => {
        animate(gameState);
    })
}
socket.on('gameCode', handleGameCode)
function handleGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
    gameCodeText.style.display = 'block';
}
socket.on('unknownGame', handleUnknownGame);
function handleUnknownGame() {
    alert('unknown game code');
}
socket.on('init', handleInit);
function handleInit(number) {
    currentPlayer = number;
    gotoLobby();
    if(currentPlayer === 0)
        startGame.style.display = "block";
}

socket.on('playerAdded', handlePlayerAdded);
function handlePlayerAdded(players) {
    players = JSON.parse(players);
    joinedPlayers.textContent = '';
    players.forEach(player => {
        const imgElem = document.createElement('img');
        imgElem.src = 'images/img.png';
        imgElem.style.display = 'block';
        const divElem = document.createElement('div');
        divElem.appendChild(imgElem);
        const pElem = document.createElement('p');
        const textElem = document.createTextNode(player.userName);
        pElem.appendChild(textElem);
        divElem.appendChild(pElem);
        joinedPlayers.appendChild(divElem);
        divElem.style.display = 'flex';
        divElem.style.alignItems = 'center';
        divElem.style.flexDirection = 'column';
        divElem.style.marginRight = '10%';
    })
}




// animate function
function animate(gameState) {
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height);
    // gameState = JSON.parse(gameState);
    gameState.forEach(player => {
        c.fillStyle = 'red';
        c.fillRect(player.position.x, player.position.y, 30, 30);
    })
}





//goto various screens functions
function gotoLobby() {
    startScreen.style.display = "none";
    gameScreen.style.display = "none";
    lobby.style.display = "flex";
}
function gotoHome() {
    gameScreen.style.display = "none";
    lobby.style.display = "none";
    startScreen.style.display = "flex";

}
function gotoGame() {
    startScreen.style.display = "none";
    lobby.style.display = "none";
    gameScreen.style.display = "block";
}