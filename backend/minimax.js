const {checkValidMove} = require('./ai_utils');

/*
    Mini max algorithm with alpha beta pruning.
    The search space goes upto depth 3
*/

class MiniMax {
    constructor(turn){
        this.turn = turn; // your turn color

        // chess board heuristics for each piece 
        let pawnEvalSelf =
            [
                [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
                [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
                [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
                [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
                [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
                [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
                [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
                [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
            ];
        
        let pawnEvalOpponent = this.reverseArray(pawnEvalSelf);
        
        this.knightEval =
            [
                [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
                [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
                [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
                [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
                [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
                [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
                [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
                [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
            ];
        
        let bishopEvalSelf = [
            [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
            [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
            [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
            [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
            [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
            [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
            [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
            [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
        ];
        
        let bishopEvlOpponent = this.reverseArray(bishopEvalSelf);
        
        let rookEvalSelf = [
            [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
            [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
        ];
        
        let rookEvalOpponent = this.reverseArray(rookEvalSelf);
        
        this.evalQueen = [
            [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
            [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
            [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
            [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
            [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
            [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
            [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
            [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
        ];
        
        let kingEvalSelf = [
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
            [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
            [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
            [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
        ];
        
        let kingEvalOpponent = this.reverseArray(kingEvalSelf);

        if(turn==='white'){
            this.kingEvalWhite = kingEvalSelf;
            this.rookEvalWhite = rookEvalSelf;
            this.bishopEvalWhite = bishopEvalSelf;
            this.pawnEvalWhite = pawnEvalSelf;
            this.kingEvalBlack = kingEvalOpponent;
            this.rookEvalBlack = rookEvalOpponent;
            this.bishopEvalBlack = bishopEvlOpponent;
            this.pawnEvalBlack = pawnEvalOpponent;
        } else {
            this.kingEvalBlack = kingEvalSelf;
            this.rookEvalBlack = rookEvalSelf;
            this.bishopEvalBlack = bishopEvalSelf;
            this.pawnEvalBlack = pawnEvalSelf;
            this.kingEvalWhite = kingEvalOpponent;
            this.rookEvalWhite = rookEvalOpponent;
            this.bishopEvalWhite = bishopEvlOpponent;
            this.pawnEvalWhite = pawnEvalOpponent;
        }

        // all possible chess board positions for move generation
        this.squares = [];
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                this.squares.push(`${i}+${j}`)
            }
        }
    }

    //generate all possible moves
    generateMoves=(turn,positions)=>{
        let moves = [];
        for(let i=0;i<64;i++){
            if(positions[this.squares[i]]!==undefined && positions[this.squares[i]].color===turn){
                for(let j=0;j<64;j++){
                    if(checkValidMove(this.squares[j],this.squares[i],positions,turn,this.turn)===1){
                        moves.push([this.squares[i],this.squares[j]]);
                    }
                }
            }  
        }
        return moves;
    }

    minimaxRoot =function(depth,isMaximisingPlayer,turn,positions) {
        return new Promise((resolve,reject)=>{
            try {
                var newGameMoves = this.generateMoves(turn,{...positions});
                var bestMove = -9999;
                var bestMoveFound;
                for(var i = 0; i < newGameMoves.length; i++) {
                    var newGameMove = newGameMoves[i]
                    let piece = positions[newGameMove[0]];
                    positions[newGameMove[1]] = piece;
                    delete positions[newGameMove[0]]; // opponent plays the move on board
        
                    var value = this.minimax(
                        depth - 1,
                        -10000,
                        10000,
                        !isMaximisingPlayer,
                        {...positions},
                        turn==='white' ? 'black' : 'white' // play the remaining game 
                    );
        
                    piece = positions[newGameMove[1]];
                    positions[newGameMove[0]] = piece;
                    delete positions[newGameMove[1]]; // opponent un-plays the played move or backtracks
        
                    if(value >= bestMove) {
                        bestMove = value;
                        bestMoveFound = newGameMove;
                    }
                }
                resolve(bestMoveFound);
            } catch (error) {
                reject(error);
            }
        })
    };
    
    /*
        if beta is less than alpha, a better move is availiable for the opponent, which is 
        the parent of current node 
    */
   
    minimax = function (depth,alpha, beta, isMaximisingPlayer,positions,turn) {
    
        if (depth === 0) {
            return -this.evaluateBoard(positions);
        }
        
        var newGameMoves = this.generateMoves(turn,positions);
       
        if (isMaximisingPlayer) { 
            //chose move with max score
            // update alpha with max of all moves
            var bestMove = -9999;
            for (var i = 0; i < newGameMoves.length; i++) {
                var newGameMove = newGameMoves[i]
                let piece = positions[newGameMove[0]];
                positions[newGameMove[1]] = piece;
                delete positions[newGameMove[0]];

                bestMove = Math.max(
                    bestMove, 
                    this.minimax(
                        depth - 1, 
                        alpha, 
                        beta, 
                        !isMaximisingPlayer,
                        {...positions},
                        turn==='white' ? 'black' : 'white'
                    )
                );

                piece = positions[newGameMove[1]];
                positions[newGameMove[0]] = piece;
                delete positions[newGameMove[1]];

                alpha = Math.max(alpha, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        } else {
            //chose move with min score
            // update beta with min of all moves
            bestMove = 9999;
            for (i = 0; i < newGameMoves.length; i++) {
                newGameMove = newGameMoves[i]
                let piece = positions[newGameMove[0]];
                positions[newGameMove[1]] = piece;
                delete positions[newGameMove[0]];

                bestMove = Math.min(
                    bestMove, 
                    this.minimax(
                        depth - 1, 
                        alpha, 
                        beta, 
                        !isMaximisingPlayer,
                        {...positions},
                        turn==='white' ? 'black' : 'white'
                    )
                );

                piece = positions[newGameMove[1]];
                positions[newGameMove[0]] = piece;
                delete positions[newGameMove[1]];
                
                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    };
    
    evaluateBoard = function (positions) {
        var totalEvaluation = 0;
        Object.keys(positions).forEach(key=>{
            const row = Number(key.split('+')[0]);
            const col = Number(key.split('+')[1]);
            totalEvaluation = totalEvaluation + this.getPieceValue(positions[key], row ,col);
        })
        return totalEvaluation;
    };
    
    reverseArray = function(array) {
        return array.slice().reverse();
    };
    
    getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece === 'pawn') {
            return 10 + ( isWhite ? this.pawnEvalWhite[y][x] : this.pawnEvalBlack[y][x] );
        } else if (piece === 'rook') {
            return 50 + ( isWhite ? this.rookEvalWhite[y][x] : this.rookEvalBlack[y][x] );
        } else if (piece === 'knight') {
            return 30 + this.knightEval[y][x];
        } else if (piece === 'bishop') {
            return 30 + ( isWhite ? this.bishopEvalWhite[y][x] : this.bishopEvalBlack[y][x] );
        } else if (piece === 'queen') {
            return 90 + this.evalQueen[y][x];
        } else if (piece === 'king') {
            return 900 + ( isWhite ? this.kingEvalWhite[y][x] : this.kingEvalBlack[y][x] );
        }
    };
    
    getPieceValue = function (piece, x, y) {
        if (piece === undefined) {
            return 0;
        }

        var absoluteValue = this.getAbsoluteValue(piece.type, piece.color === 'white', x ,y);
        return this.turn==='white' ? 
        piece.color === 'white' ? absoluteValue : -absoluteValue : 
        piece.color === 'white' ? -absoluteValue : absoluteValue;
    };
    
}

module.exports = {
    minimax : MiniMax
}