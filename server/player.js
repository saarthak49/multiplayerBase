export default class Player {
    constructor({x, y, userName}) {
        this.position = {
            x,
            y
        },
        this.userName= userName,
        this.keys = {
            left: {
                pressed: false
            },
            right: {
                pressed: false
            },
            up: {
                pressed: false
            },
            down: {
                pressed: false
            },
        }
    }
}