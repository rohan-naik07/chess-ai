
export default class Utils {

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

checkValidMove = (id,selectedLocation,positions,turn,verifyCheck)=>{
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
                        if(
                            positions[id]!==undefined &&
                            positions[id].substring(0,5)!==turn
                        ){
                           flag=2;
                            return;
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

 isinCheck = (turn,positions)=>{
    let kingPosition = null;
    let flag = false;
    Object.keys(positions).forEach(position=>{
        if(positions[position].substring(0,5)!==turn && positions[position].substring(6)==='king'){
            kingPosition = position;
        }
    })
    Object.keys(positions).forEach(position=>{
        if(positions[position].substring(0,5)===turn && this.checkValidMove(kingPosition,position,positions,turn,false)>0){
            flag = true;
            return;
        }
    })
    return flag;
}

isCheckmated = (turn,positions)=>{
    if(this.isinCheck(turn,positions)===false){
        return false;
    }
    let squares = [];
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            squares.push(`${i}+${j}`)
        }
    }
    for(let i=0;i<64;i++){
        if(positions[squares[i]]!==undefined && positions[squares[i]].substring(0,5)!==turn){
            for(let j=0;j<64;j++){
                if(this.checkValidMove(squares[i],squares[j],positions,turn,true)!==0){
                    let piece = positions[squares[i]]
                    delete positions[squares[i]]
                    positions[squares[j]] = piece;
                    if(this.isinCheck(turn,positions)===false)
                        return false;
                    piece = positions[squares[j]]
                    delete positions[squares[j]]
                    positions[squares[i]] = piece;
                }
            }
        }  
    }
    return true;
}

}
/*
export default class verifyCheckMate {
    constructor(){
        this.count=0;
    }
    generateMoves(turn,positions){
        let moves = [];
        Object.keys(positions).forEach(key=>{
            if(positions[key].substring(0,5)===turn){
                let temp = this.getMoves(key,positions[key].substring(6),positions);
                temp.forEach(move=>moves.push(move));
            }
        })
        return moves;
    }

    getMoves(id,type,positions){
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
                    if(checkConstraints(position)){
                        if(
                            positions[`${position[0]}+${position[1]}`]===undefined ||
                            (positions[`${position[0]}+${position[1]}`]!==undefined && 
                            positions[`${position[0]}+${position[1]}`].substring(0,5)!==positions[id].substring(0,5))
                        ){
                            moves.push([id,`${position[0]}+${position[1]}`])
                        } 
                    }
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
                        if(checkConstraints(position)){
                            const overlapping = checkOverlap(`${position[0]}+${position[1]}`,id,positions);
                            if(overlapping[0]===true || overlapping[1]===true || overlapping[2]===true || overlapping[3]===true){
                                return;
                            }
                            if(
                                positions[`${position[0]}+${position[1]}`]===undefined ||
                                (positions[`${position[0]}+${position[1]}`]!==undefined && 
                                positions[`${position[0]}+${position[1]}`].substring(0,5)!==positions[id].substring(0,5))
                            ){
                                moves.push([id,`${position[0]}+${position[1]}`])
                                validMoves+=1;
                            } 
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
                        if(checkConstraints(position)){
                            const overlapping = checkOverlap(`${position[0]}+${position[1]}`,id,positions);
                            if(overlapping[2]===true || overlapping[3]===true){
                                return;
                            }
                            if(
                                positions[`${position[0]}+${position[1]}`]===undefined ||
                                (positions[`${position[0]}+${position[1]}`]!==undefined && 
                                positions[`${position[0]}+${position[1]}`].substring(0,5)!==positions[id].substring(0,5))
                            ){
                                moves.push([id,`${position[0]}+${position[1]}`])
                                validMoves+=1;
                            } 
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
                    if(checkConstraints(position)){
                        if(
                            positions[`${position[0]}+${position[1]}`]===undefined ||
                            (positions[`${position[0]}+${position[1]}`]!==undefined && 
                            positions[`${position[0]}+${position[1]}`].substring(0,5)!==positions[id].substring(0,5))
                        ){
                            moves.push([id,`${position[0]}+${position[1]}`])
                        } 
                    }
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
                        if(checkConstraints(position)){
                            const overlapping = checkOverlap(`${position[0]}+${position[1]}`,id,positions);
                            if(overlapping[2]===true || overlapping[3]===true){
                                return;
                            }
                            if(
                                positions[`${position[0]}+${position[1]}`]===undefined ||
                                (positions[`${position[0]}+${position[1]}`]!==undefined && 
                                positions[`${position[0]}+${position[1]}`].substring(0,5)!==positions[id].substring(0,5))
                            ){
                                moves.push([id,`${position[0]}+${position[1]}`])
                                validMoves+=1;
                            } 
                        }
                    })
                    counter+=1;
                } while (validMoves!==0);
                break;
            case 'pawn':
                let turn = positions[id].substring(0,5)
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
                    if(checkConstraints(position)){
                        if(
                            (positions[`${position[0]}+${position[1]}`]!==undefined && 
                            positions[`${position[0]}+${position[1]}`].substring(0,5)!==turn)
                        ){
                            moves.push([id,`${position[0]}+${position[1]}`])
                        } 
                    }
                })
                if(done===false){
                    plainMoves.forEach(position=>{
                        if(checkConstraints(position)){
                            if(
                                positions[`${position[0]}+${position[1]}`]===undefined
                            ){
                                moves.push([id,`${position[0]}+${position[1]}`])
                            } 
                        }
                    })
                }
                break;
            default : break;
        }
        return moves;
    }

    isCheckMated(){

    }

    isinCheck(depth,turn,positions){
        let flag=0;
        this.count+=1;
        console.log(this.count)
        Object.keys(positions).forEach(position=>{
            if(positions[position].substring(6)==='king'){
                flag+=1;
            }
        })
        if(flag===1){
            return true;
        }
        if(depth===0){
            // Opponent can escape in the given number of moves
           return false;
        }

        const moves = this.generateMoves(turn==='white' ? 'black' : 'white',positions);

        for(let i=0;i<moves.length;i++){
            //do move
            let board = {...positions}
            let piece = board[moves[i][0]]
            delete board[moves[i][0]]
            board[moves[i][1]] = piece;

            let answer = this.isCheckmated(
                depth-1,
                turn==='white' ? 'black' : 'white',
                board
            );

            // undo move
            piece = board[moves[i][1]]
            delete board[moves[i][1]]
            board[moves[i][0]] = piece;
            if(answer===true){
                return true;
            } 
       }
       return false; 
    }
    
    
}
*/