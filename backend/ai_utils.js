// check move if placing piece outside of board
const checkConstraints = position=>(
    position[0] >= 0 && position[0]<8 &&
    position[1] >= 0 && position[1]<8 
)

// horizontally check if some piece comes in between 
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

// vertically check if some piece comes in between 
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

// diagonally check if some piece comes in between 
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

// diagonally check if some piece comes in between 
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
        return 0; // if empty cell is selected
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
                if( positions[id]===undefined || (positions[id]!==undefined && positions[id].color!==turn)){
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
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].color!==turn)){
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
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].color!==turn)){
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
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].color!==turn)){
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
                if(positions[id]===undefined || (positions[id]!==undefined && positions[id].color!==turn)){
                    return 1;
                }   
            }
            break;
        default : break;
    }
}
module.exports = { checkValidMove }