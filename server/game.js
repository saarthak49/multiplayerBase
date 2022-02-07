import Player from "./player.js";




export function createGameState() {
    return ({
        players: {}
    })
}


export function gameLoop(state) {


    const players = Object.keys(state.players);
    players.forEach(player => {
        if (state.players[player].keys.right.pressed)
            state.players[player].position.x += 5;
        if (state.players[player].keys.left.pressed)
            state.players[player].position.x -= 5;
        if (state.players[player].keys.up.pressed)
            state.players[player].position.y -= 5;
        if (state.players[player].keys.down.pressed)
            state.players[player].position.y += 5;

    });
}