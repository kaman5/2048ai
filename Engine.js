class Engine {
    board;

    constructor(newBoard) {
        this.board = newBoard;
        this.depth = 2;
    }

    play() {
        // separate thread
        const evalWorker = new Worker('bgEval.js');
        evalWorker.postMessage(this.board.getPosition());

        evalWorker.onmessage = (e) => {
            let textContent = e.data;

            engine.updateBar();

            let move = e.data;

            let lines = document.getElementsByClassName("line");

            lines[0].innerHTML = "up: " + Math.floor(move[0]);
            lines[1].innerHTML = "right: " + Math.floor(move[1]); 
            lines[2].innerHTML = "down: " + Math.floor(move[2]); 
            lines[3].innerHTML = "left: " + Math.floor(move[3]); 

            let bestMove = move[0];
            let finalMove = 0;
            for(let i = 0; i < move.length; i++) {
                lines[i].style.color = "black";
                if(bestMove < move[i]) {
                    bestMove = move[i];
                    finalMove = i;
                }
            }
            lines[finalMove].style.color = "red";

            
            if(finalMove == 0) {
                // console.log("UP:" + bestMove);
                this.board.shiftUp();
                this.board.addRandomTile();
            }
            else if(finalMove == 1) {
                // console.log("RIGHT: " + bestMove);
                this.board.shiftRight();
                this.board.addRandomTile();

            }
            else if(finalMove == 2) {
                // console.log("DOWN: " + bestMove);
                this.board.shiftDown();
                this.board.addRandomTile();

            }
            else if(finalMove == 3) {
                // console.log("LEFT: " + bestMove);
                this.board.shiftLeft();
                this.board.addRandomTile();

            }
            evalWorker.terminate();
        }
    }

    updateBar(board) {
        let bar = document.getElementById("eval");
        bar.style.height = (Math.random() * 60) + "vmin";
    }

    showLines(board) {
        let pos = this.board.getPosition();
        let move = this.evaluate(pos);
        let lines = document.getElementsByClassName("line");

        lines[0].innerHTML = "up: " + Math.floor(move[0]);
        lines[1].innerHTML = "right: " + Math.floor(move[1]); 
        lines[2].innerHTML = "down: " + Math.floor(move[2]); 
        lines[3].innerHTML = "left: " + Math.floor(move[3]); 
    }

    // WEB WORKER DOWN
    getEveryTile(board) {
        let allTiles = [];

        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if(board[i][j] == null) {
                    board[i][j] = 2;
                    allTiles.push(structuredClone(board));
                    board[i][j] = 4;
                    allTiles.push(structuredClone(board));
                    board[i][j] = null;
                }
            }
        }
        return allTiles;
    }

    evaluate(board) {
        let moves = [this.simUp(board), this.simRight(board), this.simDown(board), this.simLeft(board)];
        let bestMove = null;
        let bestScore = 0;
        let allMoves = [];

        for(let i = 0; i < moves.length; i++) {
            if(!compareArray(moves[i], board)) {
                let score = this.getScore(moves[i], 0, this.depth);
                allMoves.push(score);
            }
            else {
                allMoves.push(0);
            }

            // if(score > bestScore) {
            //     bestScore = score;
            //     bestMove = moves[i];
            // }
        }
        return allMoves;
    }

    // gets all positions
    getScore(board, currentDepth, limDepth) {
        if(currentDepth >= limDepth) {
            return this.getFinalScore(board);
        }
        var allTiles = this.getEveryTile(board);
        var totalScore = 0;

        for(let i = 0; i < allTiles.length-1; i++) {
            let board2 = allTiles[i];
            totalScore = totalScore + (1 * this.getMoveScore(board2, currentDepth, limDepth));

            let board4 = allTiles[i+1];
            totalScore = totalScore + (0.1 * this.getMoveScore(board4, currentDepth, limDepth));

        }
        return totalScore;
    }

    // helps get all positions
    getMoveScore(board, currentDepth, limDepth) {
        var bestScore = 0;
        let moves = [this.simUp(board), this.simRight(board), this.simDown(board), this.simLeft(board)];

        for(let i = 0; i < moves.length; i++) {
            if(!compareArray(moves[i], board)) {
                let score = this.getScore(moves[i], currentDepth+1, limDepth);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }

    // returns final score of all positions
    getFinalScore(board) {
        let finalScore = 0;

        finalScore += this.getMaxTile(board);
        finalScore += this.getGridWeight(board);

        return finalScore;
    }

    getGridWeight(position) {
        let scoreGrid = [[5, 4, 3, 2],
                         [4, 2, 1, 1],
                         [3,  1,  0,  -1],
                         [2, 1, -1, -10]];
        let value = 0;

        for(let i = 0; i < position.length; i++) {
            for(let j = 0; j < position[i].length; j++) {
                value += position[i][j] * scoreGrid[i][j];
            }
        }
        return value;
    }

    getEmptyTiles(position) {
        let emptyTiles = 0;

        for(let i = 0; i < position.length; i++) {
            for(let j = 0; j < position[i].length; j++) {
                emptyTiles += position[i][j] == null ? 1: 0;
            }
        }
        return emptyTiles;
    }

    getWeightedVal(position) {
        let sum = 0;

        for(let i = 0; i < position.length; i++) {
            for(let j = 0; j < position[i].length; j++) {
                let val = position[i][j] * 0.01;
                sum += val;
            }
        }
        return sum;
    }

    getMaxTile(position) {
        let max = 0;

        for(let i = 0; i < position.length; i++) {
            for(let j = 0; j < position[i].length; j++) {
                max = position[i][j] > max ? position[i][j]: max;
            }
        }
        return max;
    }

    simRight(position) {
        let pos = structuredClone(position);

        for(let i = 0; i < pos.length; i++) {
            this.simRowRight(pos[i]);
        }
        return pos;
    }

    simLeft(position) {
        let pos = structuredClone(position);

        for(let i = 0; i < pos.length; i++) {
            this.simRowLeft(pos[i]);
        }
        return pos;
    }

    simUp(position) {
        let pos = structuredClone(position);

        let retPos;
        for(let i = 0; i < pos[0].length; i++) {
            retPos = [];
            for(let j = pos.length-1; j >= 0; j--) {
                retPos.push(pos[j][i]);
            }
            let newCol = this.simColUp(retPos);
            for(let j = pos.length-1; j >= 0; j--) {
                pos[j][i] = newCol[j];
            }
        }
        pos.reverse();
        return pos;
    }

    simDown(position) {
        let pos = structuredClone(position);

        let retPos;
        for(let i = 0; i < pos[0].length; i++) {
            retPos = [];
            for(let j = 0; j < pos.length; j++) {
                retPos.push(pos[j][i]);
            }
            let newCol = this.simColUp(retPos);
            for(let j = 0; j < pos.length; j++) {
                pos[j][i] = newCol[j];
            }
        }
        return pos;
    }

    simRowRight(row) {
        let numCombine = 0;
        let max = 3;

        for(let i = 2; i >= 0; i--) {
            for(let j = i; j < max; j++) {
                let tile = row[j];
                let nextTile = row[j+1];

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    row[j+1] = row[j];
                    row[j] = null;
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile == nextTile) {
                    row[j+1] *= 2;
                    row[j] = null;
                    numCombine++;
                    max--;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile !== nextTile) {
                    max--;
                }
            }
        }
    }

    simRowLeft(row) {
        let numCombine = 0;
        let max = 0;

        for(let i = 0; i < 4; i++) {
            for(let j = i; j > max; j--) {
                let tile = row[j];
                let nextTile = row[j-1];

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    row[j-1] = row[j];
                    row[j] = null;
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile == nextTile) {
                    row[j-1] *= 2;
                    row[j] = null;
                    numCombine++;
                    max++;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile != nextTile) {
                    max++;
                }
            }
        }
    }

    simColUp(col) {
        let numCombine = 0;
        let max = 3;

        for(let i = 2; i >= 0; i--) {
            for(let j = i; j < max; j++) {
                let tile = col[j];
                let nextTile = col[j+1];

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    col[j+1] = col[j];
                    col[j] = null;
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile == nextTile) {
                    col[j+1] *= 2;
                    col[j] = null;
                    numCombine++;
                    max--;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile != nextTile) {
                    max--;
                }
            }
        }
        return col;
    }

    shiftColDown(col) {
        let numCombine = 0;
        let max = 0;

        for(let i = 0; i < 4; i++) {
            for(let j = i; j > max; j--) {
                let tile = col[j];
                let nextTile = col[j-1];

                // shift to next empty space
                if(tile != null && nextTile == null) {
                    col[j-1] = col[j];
                    col[j] = null;
                }
                // combine similar tiles
                else if(numCombine < 2 && tile != null && nextTile != null && tile == nextTile) {
                    col[j-1] *= 2;
                    col[j] = null;
                    numCombine++;
                    max++;
                }

                else if(numCombine < 2 && tile != null && nextTile != null && tile != nextTile) {
                    max++;
                }
            }
        }
    }
}

function compareArray(arr1, arr2) {
    for(let i = 0; i < arr1.length; i++) {
        for(let j = 0; j < arr1.length; j++) {
            if(arr1[i][j] != arr2[i][j]) {
                return false;
            }
        }
    }
    return true;
}
