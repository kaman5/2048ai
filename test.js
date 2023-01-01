
// grab html tiles
var board = [];

var tiles = Array.prototype.slice.call(document.getElementsByClassName("tile"));
while(tiles.length) board.push(tiles.splice(0,5));
board.reverse();

var b = new Board(board);
var engine = new Engine(b);
b.addRandomTile();
b.addRandomTile();
document.addEventListener('keydown', keyListen, false);

mainLoop();
var limFrame = 0;
var delay = 50;

function mainLoop() {
    limFrame++;

    if(limFrame % delay == 0) {
        let box = document.getElementById("computer-play").checked;

        if(!box) {
            document.addEventListener('keydown', keyListen, false);
        }
        else {
            document.removeEventListener('keydown', keyListen, false);
            document.getElementById("eval").style.height = 50 + "vmin";
            engine.play();
        }
    }
    requestAnimationFrame(mainLoop);
}

function keyListen(event) {
    var name = event.key;
    var code = event.code;

    if(code === "ArrowRight") {
        b.shiftRight();
    }
    else if(code === "ArrowUp") {
        b.shiftUp();
    }
    else if(code === "ArrowDown") {
        b.shiftDown();
    }
    else if(code === "ArrowLeft") {
        b.shiftLeft();
    }

    if(code === "ArrowRight" || code === "ArrowUp" || code === "ArrowDown" || code === "ArrowLeft") {
        b.addRandomTile();
        //engine.showLines(b.getPosition());
    }
}






