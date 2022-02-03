class Utils {

    static canbeAttackedpassant = {};

    checkConstraints = position=>(
            position[0] >= 0 && position[0]<8 &&
            position[1] >= 0 && position[1]<8 
        )

    checkOverlap = (id,selectedLocation,positions)=>{
        const nrow = Number(id.split('+')[0]);
        const ncol = Number(id.split('+')[1]);
        const crow = Number(selectedLocation.split('+')[0]);
        const ccol = Number(selectedLocation.split('+')[1]);

        let rowOverlap=false;
        let colOverlap=false;
        let forwardDiagonalOverlap = false;
        let backwardDiagonalOverlap = false;

        Object.keys(positions).forEach(
            function(position){
                const row = Number(position.split('+')[0]);
                const col = Number(position.split('+')[1]);
                if(nrow===row){ // column should be same for row overlap
                    if(
                        (ncol > ccol && col > ccol && ncol > col) ||
                        (ncol < ccol && col < ccol && ncol < col)
                    ){
                        rowOverlap = true;
                        
                    }
                }
                if(ncol===col){
                    if(
                        (nrow < crow && row < crow && nrow < row) ||
                        (nrow > crow && row > crow && nrow > row)
                    ){
                        colOverlap = true;
                    } 
                }
                if(
                    (nrow > crow && row > crow && nrow>row) || 
                    (nrow < crow && row < crow && nrow < row)
                ){
                    if(nrow + ncol === row + col){
                        forwardDiagonalOverlap = true;
                    }
                    if(nrow - ncol +7 === row - col+7){
                        backwardDiagonalOverlap = true;
                    }
                } 
            }
        )
        return [rowOverlap,colOverlap,forwardDiagonalOverlap,backwardDiagonalOverlap];
    }

    checkValidMove = (id,selectedLocation,positions,turn,checkPassant)=>{
        if(id===undefined || id===null){
            return;
        }
        if(positions[selectedLocation]===undefined){
            return 0;
        }
        const type = positions[selectedLocation].substring(6);
        const newRow = Number(id.split('+')[0]);
        const newCol = Number(id.split('+')[1]);
        const row = Number(selectedLocation.split('+')[0]);
        const col = Number(selectedLocation.split('+')[1]);
        let flag=0;
        switch(type){
            case 'king':
                let square = [
                    [row+1,col],[row-1,col],[row,col+1],[row,col-1],
                    [row+1,col+1],[row+1,col-1],[row-1,col+1],[row-1,col-1]
                ];
                square.forEach(position=>{
                    if(this.checkConstraints(position)){
                        if(newRow===position[0] && newCol===position[1]){
                            if(
                                positions[id]===undefined || 
                                ( positions[id]!==undefined && positions[id].substring(0,5)!==turn )
                            ){
                                if(positions[id]!==undefined && positions[id].substring(0,5)!==turn){
                                flag = 2;
                                } else flag=1;
                                return;
                            } 
                        }
                    }
                })
                break;
            case 'queen':
                const overlapping = this.checkOverlap(id,selectedLocation,positions);
                if(
                    this.checkConstraints([newRow,newCol]) &&
                    ((newRow===row && newCol!==col && overlapping[0]===false) ||
                    (newRow!==row && newCol===col && overlapping[1]===false) ||
                    (newRow + newCol === row + col && overlapping[2]===false) ||
                    (newRow - newCol + 7 === row - col + 7 && overlapping[3]===false))
                ){
                    if(positions[id]===undefined ||
                    (positions[id]!==undefined && positions[id].substring(0,5)!==turn)){
                        if(positions[id]!==undefined && positions[id].substring(0,5)!==turn){
                            flag=2;
                        } else flag=1;
                    }   
                }
                break;
            case 'bishop':
                if(
                    (newRow + newCol === row + col) ||
                    (newRow - newCol + 7 === row - col + 7)
                ){
                    if(this.checkConstraints([newRow,newCol])){
                        const overlapping = this.checkOverlap(id,selectedLocation,positions);
                        if(newRow + newCol === row + col && overlapping[2]===true ){
                            flag=0;
                            return flag;
                        }
                        if(newRow - newCol + 7 === row - col + 7 && overlapping[3]===true){
                            flag=0;
                            return flag;
                        }
                        if(
                            positions[`${newRow}+${newCol}`]===undefined || 
                            ( positions[id]!==undefined && positions[id].substring(0,5)!==turn )
                        ){
                            if(positions[id]!==undefined && positions[id].substring(0,5)!==turn){
                                flag=2;
                            } else flag=1;
                        } 
                    }
                }
                break;
            case 'knight':
                const moves = [
                    [row+2,col+1],[row-2,col+1],[row+1,col+2],[row+1,col-2],
                    [row+2,col-1],[row-2,col-1],[row-1,col+2],[row-1,col-2]
                ]
                moves.forEach(position=>{
                    if(this.checkConstraints(position)){
                        if(newRow===position[0] && newCol===position[1]){
                            if(
                                positions[id]===undefined ||
                                (positions[id]!==undefined && positions[id].substring(0,5)!==turn)
                            ){
                                if(positions[id]!==undefined && positions[id].substring(0,5)!==turn){
                                flag=2;
                                }
                            else flag =1;
                                return;
                            } 
                        }
                    }
                })
                break;
            case 'rook':
                if(
                    (newRow===row && newCol!==col) ||
                    (newRow!==row && newCol===col) 
                ){
                    if(this.checkConstraints([newRow,newCol])){
                        const overlapping = this.checkOverlap(id,selectedLocation,positions);
                        if(overlapping[0]===true || overlapping[1]===true){
                            flag=0;
                            return flag;
                        }
                        if(
                            positions[`${newRow}+${newCol}`]===undefined ||
                            (positions[id]!==undefined &&
                            positions[id].substring(0,5)!==turn)
                        ){
                            if(positions[id]!==undefined && positions[id].substring(0,5)!==turn){
                                flag=2;
                            }
                            flag=1;
                        } 
                    }
                }
                break;
            case 'pawn':
                if(checkPassant===true){
                    if(col===newCol && Math.abs(row-newRow)===2){
                        // mark pawn eligible for passant
                        Utils.canbeAttackedpassant[positions[selectedLocation]] = newRow;
                    } else {
                        delete Utils.canbeAttackedpassant[positions[selectedLocation]];
                    }
                }
                const plainMoves = [
                    row===1 || row===6 ? [row+2,col] : [row+10,col+10],
                    row===1 || row===6 ? [row-2,col] : [row+10,col+10],
                    [row+1,col],[row-1,col]
                ]
                const attackMoves = [
                    [row-1,col+1],[row+1,col-1],
                    [row-1,col-1],[row+1,col+1]
                ]
                
                let done=false;
                attackMoves.forEach(move=>{
                    if(move[0]===newRow && move[1]===newCol){
                        if(this.checkConstraints(move)){
                            if(positions[id]!==undefined && positions[id].substring(0,5)!==turn){
                                flag=2;
                                done = true;
                                return;
                            } else {
                                if(checkPassant===true && Utils.canbeAttackedpassant[positions[`${row}+${col-1}`]]!==undefined){
                                    flag = `${row}+${col-1}`;
                                    done = true;
                                    delete Utils.canbeAttackedpassant[positions[`${row}+${col-1}`]];
                                    return;
                                }
                                if(checkPassant===true && Utils.canbeAttackedpassant[positions[`${row}+${col+1}`]]!==undefined){
                                    flag = `${row}+${col+1}`;
                                    done = true;
                                    delete Utils.canbeAttackedpassant[positions[`${row}+${col+1}`]];
                                    return;
                                }
                            }
                        }
                    }
                });
                if(done===false){
                    plainMoves.forEach(move=>{
                        if(move[0]===newRow && move[1]===newCol){
                            if(this.checkConstraints(move)){
                                if(
                                    positions[`${move[0]}+${move[1]}`]===undefined
                                ){
                                    flag=1;
                                    return;
                                }
                            }
                        }
                    });
                }
                break;
            default : break;
        }
        
        return flag;
    }    
}


class MiniMax {
    constructor(turn){
        this.utils = new Utils();
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
            if(positions[this.squares[i]]!==undefined && positions[this.squares[i]].substring(0,5)===turn){
                for(let j=0;j<64;j++){
                    if(this.utils.checkValidMove(this.squares[j],this.squares[i],positions,turn,false)!==0){
                        moves.push([this.squares[i],this.squares[j]]);
                    }
                }
            }  
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

        var absoluteValue = this.getAbsoluteValue(piece.substring(6), piece.substring(0,5) === 'white', x ,y);
        return this.turn==='white' ? 
        piece.substring(0,5) === 'white' ? absoluteValue : -absoluteValue : 
        piece.substring(0,5) === 'white' ? -absoluteValue : absoluteValue;
    };
    
}

const initialPositionsWhite = {
    '0+0' : 'black0rook',
    '0+1' : 'black0knight',
    '0+2' : 'black0bishop',
    '0+3' : 'black0queen',
    '0+4' : 'black0king',
    '0+5' : 'black1bishop',
    '0+6' : 'black1knight',
    '0+7' : 'black1rook',
    '1+0' : 'black0pawn',
    '1+1' : 'black1pawn',
    '1+2' : 'black2pawn',
    '1+3' : 'black3pawn',
    '1+4' : 'black4pawn',
    '1+5' : 'black5pawn',
    '1+6' : 'black6pawn',
    '1+7' : 'black7pawn',
    '6+0' : 'white0pawn',
    '6+1' : 'white1pawn',
    '6+2' : 'white2pawn',
    '6+3' : 'white3pawn',
    '6+4' : 'white4pawn',
    '6+5' : 'white5pawn',
    '6+6' : 'white6pawn',
    '6+7' : 'white7pawn',
    '7+0' : 'white0rook',
    '7+1' : 'white0knight',
    '7+2' : 'white0bishop',
    '7+3' : 'white0queen',
    '7+4' : 'white0king',
    '7+5' : 'white1bishop',
    '7+6' : 'white1knight',
    '7+7' : 'white1rook'
}

const minimax = new MiniMax('white')
let start = new Date().getTime();
console.log(minimax.minimaxRoot(3,true,'black',{...initialPositionsWhite}))
let end = new Date().getTime();
console.log((end-start)/1000)