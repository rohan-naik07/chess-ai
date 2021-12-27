function canOpponentEscape(moves,positions){
    if(moves.length===0){
        // Either stalemate or checkmate, return true if checkmate, false if stalemate
        let flag=0;
        Object.keys(positions).forEach(position=>{
            if(positions[position].substring(5)==='king'){
                flag+=1;
                return;
            }
        })
        return flag>1 ? false : true;
    } else if(moves.length===1){
        // Opponent can escape in the given number of moves
        return false;
    }
    for(let i=0;i<moves.length;i++){
        //do move
        let piece = positions[moves[i][0]]
        delete positions[moves[i][0]]
        positions[moves[i][1]] = piece;
        let reducedMoves = [...moves].splice(i,1);
        let answer = getAnswerMove(reducedMoves,{...positions});
        // undo move
        piece = positions[moves[i][1]]
        delete positions[moves[i][1]]
        positions[moves[i][0]] = piece;
        if(answer===null){
            return false;
        } 
   }
   return true; 
}

function getAnswerMove(moves,positions) {
    for(let i=0;i<moves.length;i++){
        //do move
        let piece = positions[moves[i][0]]
        delete positions[moves[i][0]]
        positions[moves[i][1]] = piece;
        let reducedMoves = [...moves].splice(i,1);
        let answer = canOpponentEscape(reducedMoves,{...positions});
        // undo move
        piece = positions[moves[i][1]]
        delete positions[moves[i][1]]
        positions[moves[i][0]] = piece;
        if(answer===true){
            // return the move
            return moves[i];
        } 
   }
   return null;
}
const checkConstraints = position=>{
    return (
        position[0] >= 0 && position[0]<8 &&
        position[1] >= 0 && position[1]<8 
    )};

const getMoves = (id,type,positions) => {
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

const checkOverlap = (id,selectedLocation,positions)=>{
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

export const verifyCheckMate = (turn,positions)=>{
    let moves = [];
    Object.keys(positions).forEach(key=>{
        if(positions[key].substring(0,5)===turn){
            let temp = getMoves(key,positions[key].substring(5),positions);
            temp.forEach(move=>moves.push(move));
        }
    })
    return getAnswerMove(moves,positions)
    
}
