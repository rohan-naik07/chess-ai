const checkConstraints = position=>(
    position[0] >= 0 && position[0]<8 &&
    position[1] >= 0 && position[1]<8 
)

const checkRowOverlap = (common_row,col,newCol,positions)=>{
    if(col < newCol){
        for(let i=col+1;i<newCol;i++){
            if(positions[`${common_row}+${i}`]!==undefined){
                return true;
            }
        }
    } else {
        for(let i=col-1;i>newCol;i--){
            if(positions[`${common_row}+${i}`]!==undefined){
                return true;
            }
        }
    }
    return false;
}

const checkColOverlap = (common_col,row,newRow,positions)=>{
    if(row < newRow){
        for(let i=row+1;i<newRow;i++){
            if(positions[`${i}+${common_col}`]!==undefined){
                return true;
            }
        }
    } else {
        for(let i=row-1;i>newRow;i--){
            if(positions[`${i}+${common_col}`]!==undefined){
                return true;
            }
        }
    }
    return false;
}

const checkbackwardDiagonalOverlap = (row,col,newRow,newCol,positions)=>{
    let temp_row = row;
    let temp_col = col;
    if(row > newRow){
        temp_row-=1;
        temp_col-=1;
        for(let i=row+col-2;i>newRow+newCol;i-=2){
            if(positions[`${temp_row}+${temp_col}`]!==undefined){
                return true;
            }
            temp_row-=1;
            temp_col-=1;
        }
    } else {
        temp_row+=1;
        temp_col+=1;
        for(let i=row+col+2;i<newRow+newCol;i+=2){
            if(positions[`${temp_row}+${temp_col}`]!==undefined){
                return true;
            }
            temp_row+=1;
            temp_col+=1;
        }
    }
    return false;
}

const checkforwardDiagonalOverlap = (row,col,newRow,newCol,positions)=>{
    let temp_row = row;
    let temp_col = col;
    if(row > newRow){
        temp_row-=1;
        temp_col+=1;
        for(let i=row-col-2;i>newRow-newCol;i-=2){
            if(positions[`${temp_row}+${temp_col}`]!==undefined){
                return true;
            }
            temp_row-=1;
            temp_col+=1;
        }
    } else {
        temp_row+=1;
        temp_col-=1;
        for(let i=row-col+2;i<newRow-newCol;i+=2){
            if(positions[`${temp_row}+${temp_col}`]!==undefined){
                return true;
            }
            temp_row+=1;
            temp_col-=1;
        }
    }
    return false;
}

const checkValidMove = (id,selectedLocation,positions,turn,initialTurn)=>{
    if(id===undefined || id===null){
        return;
    }
    if(positions[selectedLocation]===undefined){
        return 0;
    }
    
    const newRow = Number(id.split('+')[0]);
    const newCol = Number(id.split('+')[1]);
    const row = Number(selectedLocation.split('+')[0]);
    const col = Number(selectedLocation.split('+')[1]);
    
    switch(positions[selectedLocation].type){
        case 'pawn':
            const plainMoves={}
            const attackMoves={}
            
            if(initialTurn==='white'){
                if(positions[selectedLocation].color ==='white'){
                    plainMoves[`${row-1}+${col}`] = true;
                    attackMoves[`${row-1}+${col-1}`] = true;
                    attackMoves[`${row-1}+${col+1}`] = true;
                    if(row===6){
                        plainMoves[`${row-2}+${col}`] = true;
                    }
                }else{
                    plainMoves[`${row+1}+${col}`] = true;
                    attackMoves[`${row+1}+${col-1}`] = true;
                    attackMoves[`${row+1}+${col+1}`] = true;
                    if(row===1){
                        plainMoves[`${row+2}+${col}`] = true;
                    }
                }
                
            } else {
                if(positions[selectedLocation].color ==='black'){
                    plainMoves[`${row-1}+${col}`] = true;
                    attackMoves[`${row-1}+${col-1}`] = true;
                    attackMoves[`${row-1}+${col+1}`] = true;
                    if(row===6){
                        plainMoves[`${row-2}+${col}`] = true;
                    }
                }else{
                    plainMoves[`${row+1}+${col}`] = true;
                    attackMoves[`${row+1}+${col-1}`] = true;
                    attackMoves[`${row+1}+${col+1}`] = true;
                    if(row===1){
                        plainMoves[`${row+2}+${col}`] = true;
                    }
                }
            }
            
            if(attackMoves[`${newRow}+${newCol}`]===true){
                if(checkConstraints([newRow,newCol])){
                    if(positions[id]!==undefined && positions[id].color!==turn){
                        return 1;
                    }
                }
            }
    
            if(plainMoves[`${newRow}+${newCol}`]===true){
                if(checkConstraints([newRow,newCol]) && positions[`${newRow}+${newCol}`]===undefined){
                    return 1;
                }
            }
            break;
        case 'knight':
            let moves={
                [`${row+2}+${col+1}`] : true,
                [`${row-2}+${col+1}`] : true,
                [`${row+1}+${col+2}`] : true,
                [`${row+1}+${col-2}`] : true,
                [`${row+2}+${col-1}`] : true,
                [`${row-2}+${col-1}`] : true,
                [`${row-1}+${col+2}`] : true,
                [`${row-1}+${col-2}`] : true,
            }
    
            if(checkConstraints([newRow,newCol]) && moves[`${newRow}+${newCol}`]===true){
                if( positions[id]===undefined || (positions[id]!==undefined && positions[id].getColor()!==turn)){
                    return 1;
                }
            }
            break;
        case 'rook':
            if(checkConstraints([newRow,newCol])){
                let overlap = false;
                let allowed = false;
                if(newRow===row && newCol!==col){
                    overlap = checkRowOverlap(row,col,newCol,positions);
                    allowed = true;
                }
                if(newRow!==row && newCol===col){
                    overlap = checkColOverlap(col,row,newRow,positions);
                    allowed = true;
                }
                if(overlap===true || allowed ===false){
                    return 0;
                }
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].getColor()!==turn)){
                    return 1;
                }   
            }
            break;
        case 'king':
            let square={
                [`${row+1}+${col}`] : true,
                [`${row-1}+${col}`] : true,
                [`${row}+${col+1}`] : true,
                [`${row}+${col-1}`] : true,
                [`${row+1}+${col+1}`] : true,
                [`${row+1}+${col-1}`] : true,
                [`${row-1}+${col+1}`] : true,
                [`${row-1}+${col-1}`] : true,
            }
            
            if(checkConstraints([newRow,newCol]) && square[`${newRow}+${newCol}`]===true){
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].getColor()!==turn)){
                    return 1;
                }
            }
            break;
        case 'queen':
            if(checkConstraints([newRow,newCol])){
                let overlap = false;
                let allowed = false;
                if(newRow===row && newCol!==col){
                    overlap = checkRowOverlap(row,col,newCol,positions);
                    allowed = true;
                }
                if(newRow!==row && newCol===col){
                    overlap = checkColOverlap(col,row,newRow,positions);
                    allowed = true;
                }
                if(newRow + newCol === row + col){
                    overlap = checkforwardDiagonalOverlap(row,col,newRow,newCol,positions);
                    allowed = true;
                }
                if(newRow - newCol + 7 === row - col + 7){
                    overlap = checkbackwardDiagonalOverlap(row,col,newRow,newCol,positions);
                    allowed = true;
                }
                if(overlap===true || allowed ===false){
                    return 0;
                }
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].getColor()!==turn)){
                    return 1;
                }   
            }
            break;
        case 'bishop':
            if(checkConstraints([newRow,newCol])){
                let overlap = false;
                let allowed = false;
                if(newRow + newCol === row + col){
                    overlap = checkforwardDiagonalOverlap(row,col,newRow,newCol,positions);
                    allowed = true;
                }
                if(newRow - newCol + 7 === row - col + 7){
                    overlap = checkbackwardDiagonalOverlap(row,col,newRow,newCol,positions);
                    allowed = true;
                }
                if(overlap===true || allowed ===false){
                    return 0;
                }
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].getColor()!==turn)){
                    return 1;
                }   
            }
            break;
        default : break;
    }
}

class MiniMax {
    constructor(turn){
        this.turn = turn;
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
        this.squares = [];
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                this.squares.push(`${i}+${j}`)
            }
        }
    }

    generateMoves=(turn,positions)=>{
        let moves = [];
        for(let i=0;i<64;i++){
            if(positions[this.squares[i]]!==undefined && positions[this.squares[i]].color===turn){
                for(let j=0;j<64;j++){
                    if(checkValidMove(this.squares[j],this.squares[i],positions,turn)!==0){
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
                resolve(bestMoveFound);
            } catch (error) {
                reject(error);
            }
        })
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