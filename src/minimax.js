import Utils from "./util";

export default class MiniMax {
    constructor(){
        this.utils = new Utils();
        this.pawnEvalWhite =
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
        
        this.pawnEvalBlack = this.reverseArray(this.pawnEvalWhite);
        
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
        
        this.bishopEvalWhite = [
            [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
            [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
            [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
            [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
            [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
            [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
            [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
            [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
        ];
        
        this.bishopEvalBlack = this.reverseArray(this.bishopEvalWhite);
        
        this.rookEvalWhite = [
            [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
            [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
        ];
        
        this.rookEvalBlack = this.reverseArray(this.rookEvalWhite);
        
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
        
        this.kingEvalWhite = [
        
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
            [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
            [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
            [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
        ];
        
        this.kingEvalBlack = this.reverseArray(this.kingEvalWhite);
    
    }

    generateMoves=(turn,positions)=>{
        let moves = [];
        Object.keys(positions).forEach(key=>{
            if(positions[key]!==undefined && positions[key].substring(0,5)===turn){
                let temp = this.getMoves(key,positions[key].substring(6),positions);
                temp.forEach(move=>moves.push(move));
            }
        })
        return moves;
    }

    getMoves = (id,type,positions,turn) => {
        const row = Number(id.split('+')[0]);
        const col = Number(id.split('+')[1]);
        let moves = []
        let counter=1;
        let validMoves=0;
        switch(type){
            case 'king':
                let square = [
                    [row+1,col],[row-1,col],[row,col+1],[row,col-1],
                    [row+1,col+1],[row+1,col-1],[row-1,col+1],[row-1,col-1]
                ];
                square.forEach(position=>{
                   if(this.utils.checkValidMove(`${position[0]}+${position[1]}`,id,{...positions},turn,false)!==0)
                        moves.push([id,`${position[0]}+${position[1]}`])
                      
                })
                break;
            case 'queen':
                counter=1;
                validMoves=0;
                do{
                    validMoves=0;
                    let choices = [
                        [row+counter,col],[row-counter,col],
                        [row,col+counter],[row,col+counter],
                        [row+counter,col+counter],[row-counter,col-counter],
                        [row+counter,col-counter],[row-counter,col-counter]
                    ]
                    choices.forEach(position=>{
                        if(this.utils.checkValidMove(`${position[0]}+${position[1]}`,id,{...positions},turn,false)!==0){
                            moves.push([id,`${position[0]}+${position[1]}`])
                            validMoves+=1;
                        }    
                    })
                    counter+=1;
                } while (validMoves!==0);
                break;
            case 'bishop':
                counter=1;
                validMoves=0;
                do{
                    validMoves=0;
                    let choices = [
                        [row+counter,col+counter],[row-counter,col-counter],
                        [row+counter,col-counter],[row-counter,col-counter]
                    ]
                    choices.forEach(position=>{
                        if(this.utils.checkValidMove(`${position[0]}+${position[1]}`,id,{...positions},turn,false)!==0){
                            moves.push([id,`${position[0]}+${position[1]}`])
                            validMoves+=1;
                        }     
                    })
                    counter+=1;
                } while (validMoves!==0);
                break;
            case 'knight':
                const choices = [
                    [row+2,col+1],[row-2,col+1],[row+1,col+2],[row+1,col-2],
                    [row+2,col-1],[row-2,col-1],[row-1,col+2],[row-1,col-2]
                ]
                choices.forEach(position=>{
                    if(this.utils.checkValidMove(`${position[0]}+${position[1]}`,id,{...positions},turn,false)!==0)
                        moves.push([id,`${position[0]}+${position[1]}`])  
                })
                break;
            case 'rook':
                counter=1;
                validMoves=0;
                do{
                    validMoves=0;
                    let choices = [
                        [row+counter,col],[row-counter,col],
                        [row,col+counter],[row,col+counter]
                    ]
                    choices.forEach(position=>{
                        if(this.utils.checkValidMove(`${position[0]}+${position[1]}`,id,{...positions},turn,false)!==0){
                            moves.push([id,`${position[0]}+${position[1]}`])
                            validMoves+=1;
                        }  
                    })
                    counter+=1;
                } while (validMoves!==0);
                break;
            case 'pawn':
                const plainMoves = [
                    row===1 || row===6 ? [(turn==='white' ? row-2 : row+2),col] : [row+10,col+10],
                    [(turn==='white' ? row-1 : row+1),col]
                ]
                const attackMoves = [
                    turn==='white' ? [row-1,col+1] : [row+1,col-1],
                    turn==='white' ? [row-1,col-1] : [row+1,col+1]
                ]
                let done=false;
                attackMoves.forEach(position=>{
                   if(this.utils.checkValidMove(`${position[0]}+${position[1]}`,id,{...positions},turn,false)!==0)
                        moves.push([id,`${position[0]}+${position[1]}`])
                       
                })
                if(done===false){
                    plainMoves.forEach(position=>{
                        if(this.utils.checkValidMove(`${position[0]}+${position[1]}`,id,{...positions},turn,false)!==0)
                            moves.push([id,`${position[0]}+${position[1]}`])
                            
                    })
                }
                break;
            default : break;
        }
        return moves;
    }


    minimaxRoot =function(depth,isMaximisingPlayer,turn,positions) {

        var newGameMoves = this.generateMoves(turn,{...positions});
        var bestMove = -9999;
        var bestMoveFound;
    
        for(var i = 0; i < newGameMoves.length; i++) {
            var newGameMove = newGameMoves[i]
            let piece = positions[newGameMove[0]];
            positions[newGameMove[1]] = piece;
            delete positions[newGameMove[0]];

            var value = this.minimax(
                depth - 1,
                -10000,
                10000,
                !isMaximisingPlayer,
                {...positions},
                turn==='white' ? 'black' : 'white'
            );

            piece = positions[newGameMove[1]];
            positions[newGameMove[0]] = piece;
            delete positions[newGameMove[1]];

            if(value >= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMove;
            }
        }
        return bestMoveFound;
    };
    
    minimax = function (depth,alpha, beta, isMaximisingPlayer,positions,turn) {
    
        if (depth === 0) {
            return -this.evaluateBoard(positions);
        }
        
        var newGameMoves = this.generateMoves(turn,positions);
       
        if (isMaximisingPlayer) {
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
            var bestMove = 9999;
            for (var i = 0; i < newGameMoves.length; i++) {
                var newGameMove = newGameMoves[i]
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
        throw "Unknown piece type: " + piece;
    };
    
    getPieceValue = function (piece, x, y) {
        if (piece === undefined) {
            return 0;
        }

        var absoluteValue = this.getAbsoluteValue(piece.substring(6), piece.substring(0,5) === 'white', x ,y);
        return piece.substring(0,5) === 'white' ? absoluteValue : -absoluteValue;
    };
    
}