class Board {    
    constructor(newBoard) {

    }

    setTile(x, y, value) {
        var newElement = document.createElement("div");
        newElement.id = "t" + x + y;
        newElement.classList.add("tile");
        newElement.classList.add("tileColor" + value);
        newElement.innerHTML = value;
        newElement.style.setProperty("--x", x);
        newElement.style.setProperty("--y", y);
        var table = document.getElementById("tile-table");
        table.appendChild(newElement);
    }

    clearTile(x, y) {
        let t = document.getElementById("t" + x + y);
        t.remove();
    }

    clearTileDelay(x, y) {
        let t = document.getElementById("t" + x + y);
        t.id = null;
        setTimeout(() => {t.remove()}, 150);
    }

    moveTile(x, y, newx, newy) {
        let t1 = document.getElementById("t" + x + y);
        let t2 = document.getElementById("t" + newx + newy);
        //if(t2 != null) {setTimeout(() => {t2.remove()}, 80); }

        if(t2 != null) { this.clearTileDelay(newx, newy); }
        t1.id = "t" + newx + newy;
        t1.style.setProperty("--x", newx);
        t1.style.setProperty("--y", newy);
    }

    moveTileRemove(x, y, newx, newy) {
        let t1 = document.getElementById("t" + x + y);
        let t2 = document.getElementById("t" + newx + newy);
        t2.style.zIndex = 1;
        t1.style.zIndex = 0;
        this.clearTileDelay(x, y);
        //t1.id = "t" + newx + newy;
        t1.style.setProperty("--x", newx);
        t1.style.setProperty("--y", newy);
    }

    combineTiles(x, y, otherx, othery) {
        let t1 = document.getElementById("t" + x + y);
        let t2 = document.getElementById("t" + otherx + othery);

        if(!this.compareTiles(x, y, otherx, othery) || t1 == null || t2 == null) {
            return false;
        }
        else {
            this.moveTileRemove(x, y, otherx, othery);
            t2.classList.remove("tileColor" + t2.innerHTML);
            t2.innerHTML = parseInt(t2.innerHTML) * 2;
            t2.classList.add("tileColor" + t2.innerHTML);
        }
        
    }

    compareTiles(x, y, otherx, othery) {
        let t1 = document.getElementById("t" + x + y);
        let t2 = document.getElementById("t" + otherx + othery);
        
        if(t1.innerHTML === t2.innerHTML) {
            return true;
        }
        return false;
    }

    addRandomTile() {
        let newTilex = Math.floor(Math.random() * 4);
        let newTiley = Math.floor(Math.random() * 4);
        let newTileVal = Math.floor(Math.random() * 10) == 0 ? 4: 2;
        let checkTile = document.getElementById("t" + newTilex + newTiley)

        if(checkTile == null) {
            this.setTile(newTilex, newTiley, newTileVal);
        }
        else {
            this.addRandomTile();
        }
    }

    getPosition() {
        let position = [];
        for(let i = 0; i < 4; i++) {
            let tempPos = [];
            for(let j = 0; j < 4; j++) {
                let tile = document.getElementById("t" + j + i);
                tempPos.push(tile == null ? null: parseInt(tile.innerHTML));
            }
            position.push(tempPos);
        }
        position.reverse();
        return position;
    }

    shiftRight() {
        for(let i = 0; i < 4; i++) {
            this.shiftRowRight(i);
        }
    }

    shiftLeft() {
        for(let i = 0; i < 4; i++) {
            this.shiftRowLeft(i);
        }
    }

    shiftUp() {
        for(let i = 0; i < 4; i++) {
            this.shiftColUp(i);
        }
    }

    shiftDown() {
        for(let i = 0; i < 4; i++) {
            this.shiftColDown(i);
        }
    }

    shiftRowRight(row) {
        let numCombine = 0;
        let max = 3;

        for(let i = 2; i >= 0; i--) {
            for(let j = i; j < max; j++) {
                let tile = document.getElementById("t" + j + row);
                let nextTile = document.getElementById("t" + (j+1) + row);

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    this.moveTile(j, row, j+1, row);
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML === nextTile.innerHTML) {
                    this.combineTiles(j, row, j+1, row);
                    numCombine++;
                    max--;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML !== nextTile.innerHTML) {
                    max--;
                }
            }
        }
    }

    shiftRowLeft(row) {
        let numCombine = 0;
        let max = 0;

        for(let i = 0; i < 4; i++) {
            for(let j = i; j > max; j--) {
                let tile = document.getElementById("t" + j + row);
                let nextTile = document.getElementById("t" + (j-1) + row);

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    this.moveTile(j, row, (j-1), row);
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML === nextTile.innerHTML) {
                    this.combineTiles(j, row, (j-1), row);
                    numCombine++;
                    max++;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML !== nextTile.innerHTML) {
                    max++;
                }
            }
        }
    }

    shiftColUp(col) {
        let numCombine = 0;
        let max = 3;

        for(let i = 2; i >= 0; i--) {
            for(let j = i; j < max; j++) {
                let tile = document.getElementById("t" + col + j);
                let nextTile = document.getElementById("t" + col + (j+1));

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    this.moveTile(col, j, col, (j+1));
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML === nextTile.innerHTML) {
                    this.combineTiles(col, j, col, (j+1));
                    numCombine++;
                    max--;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML !== nextTile.innerHTML) {
                    max--;
                }
            }
        }
    }

    shiftColDown(col) {
        let numCombine = 0;
        let max = 0;

        for(let i = 0; i < 4; i++) {
            for(let j = i; j > max; j--) {
                let tile = document.getElementById("t" + col + j);
                let nextTile = document.getElementById("t" + col + (j-1));

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    this.moveTile(col, j, col, (j-1));
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML === nextTile.innerHTML) {
                    this.combineTiles(col, j, col, (j-1));
                    numCombine++;
                    max++;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile.innerHTML !== nextTile.innerHTML) {
                    max++;
                }
            }
        }
    }

    clearBoard() {
        
    }

    getRow(x) {
        
    }

    getCol(y) {
        
    }
}


