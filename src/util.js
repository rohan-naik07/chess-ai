import qdt from './pieces/Chess_qdt60.png';
import qlt from './pieces/Chess_qlt60.png';

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

// check if you can put opponent in check
export const isinCheck = (turn,positions)=>{
    let kingPosition = null;
    let flag = false;
    Object.keys(positions).forEach(position=>{
        if(positions[position]!==undefined && positions[position].getColor()!==turn && positions[position].getType()==='king'){
            kingPosition = position;
        }
    })
    Object.keys(positions).forEach(position=>{
        if(
            positions[position]!==undefined &&
            positions[position].getColor()===turn && 
            positions[position].checkValidMove(kingPosition,position,positions,turn)>0
        ){
            flag = true;
            return;
        }
    })
    return flag;
}


export const isCheckmated = (turn,positions)=>{
    if(isinCheck(turn,positions)===false){
        return false;
    }
    let squares = [];
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            squares.push(`${i}+${j}`)
        }
    }
    /*
        if opponent is in check, check if there is at least one move possible 
        for the opponent which can get him/her out of check
    */
    for(let i=0;i<64;i++){
        if(positions[squares[i]]!==undefined && positions[squares[i]].getColor()!==turn){
            for(let j=0;j<64;j++){
                if(positions[squares[i]].checkValidMove(squares[j],squares[i],positions,turn)!==0){
                    let piece = positions[squares[i]]
                    delete positions[squares[i]]
                    positions[squares[j]] = piece;
                    if(isinCheck(turn,positions)===false)
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

class Piece {
    constructor(identifier,image,initialTurn){
        this.identifier = identifier; //black0pawn
        this.image = image
        this.color = identifier.substring(0,5);
        this.type = identifier.substring(6);
        this.initialTurn = initialTurn;
    }

    setImage = (image)=>this.image=image;
    setId = (identifier)=>this.identifier = identifier;
    getImage = ()=>{return this.image}
    getId = ()=>{return this.identifier}
    getColor = ()=>{return this.color}
    getType = ()=>{return this.type}
}

class Pawn extends Piece{
    constructor(identifier,image,initialTurn){
        super(identifier,image,initialTurn);
        this.canbeAttackedpassant = false;
        this.passant_row = null;
        this.is_promoted = false;
        this.promotion = null;
    }
    
    promote = (turn,initialTurn,id)=>{
        const newRow = Number(id.split('+')[0]);
        if(initialTurn==='white'){
            if(turn==='white' && newRow===0){
                this.is_promoted = true;
            }
            if(turn==='black' && newRow===7){
                this.is_promoted = true;
            }
        } else {
            if(turn==='white' && newRow===7){
                this.is_promoted = true;
            }
            if(turn==='black' && newRow===0){
                this.is_promoted = true;
            }
        }
        if(this.is_promoted===true){
            this.promotion = new Queen(`${turn}1queen`,turn==='white' ? qlt : qdt);
        } 
    }

    demote = ()=>{
        this.promotion = null;
        this.is_promoted=false;
    }
    
    checkValidMove = (id,selectedLocation,positions,turn)=>{
        if(this.is_promoted===true){
            return this.promotion.checkValidMove(id,selectedLocation,positions,turn);
        }

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

        if(col===newCol && Math.abs(row-newRow)===2){
            // mark pawn eligible for passant
            this.canbeAttackedpassant = true
            this.passant_row = newRow;
        } else {
            this.canbeAttackedpassant = false
            this.passant_row = null;
        }

        const plainMoves={}
        const attackMoves={}
        
        if(this.initialTurn==='white'){
            if(positions[selectedLocation].getColor() ==='white'){
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
            if(positions[selectedLocation].getColor() ==='black'){
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
                if(positions[id]!==undefined && positions[id].getColor()!==turn){
                    return 1;
                } else {
                    if(positions[`${row}+${col-1}`]!==undefined && positions[`${row}+${col-1}`].canbeAttackedpassant===true){
                        positions[`${row}+${col-1}`].canbeAttackedpassant=false;
                        return `${row}+${col-1}`;
                    }
                    if(positions[`${row}+${col+1}`]!==undefined && positions[`${row}+${col+1}`].canbeAttackedpassant===true){
                        positions[`${row}+${col+1}`].canbeAttackedpassant=false;
                        return `${row}+${col+1}`;
                    }
                }
            }
        }

        if(plainMoves[`${newRow}+${newCol}`]===true){
            if(checkConstraints([newRow,newCol]) && positions[`${newRow}+${newCol}`]===undefined){
                return 1;
            }
        }
        
        return 0;
    }
}


class Queen extends Piece{
    checkValidMove = (id,selectedLocation,positions,turn)=>{
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
        return 0;
    }
}

class King extends Piece{
    constructor(identifier,image,initialTurn){
        super(identifier,image,initialTurn);
        this.moved = false;
    }

    setMoved = ()=>this.moved = true;

    checkCastling = (id,selectedLocation,positions,turn)=>{
        const newRow = Number(id.split('+')[0]);
        const newCol = Number(id.split('+')[1]);
        const row = Number(selectedLocation.split('+')[0]);
        const col = Number(selectedLocation.split('+')[1]);
        if(Math.abs(newCol-col)<2 || row!==newRow){
            return {
                newrookPos : null,
                rookPos : null
            }
        }
        const condition = newCol > col;
        let rookPos = null;
        for(let i=col;condition===true ? i<=7 : i>=0;condition===true ?i++ : i--){
            if(
                positions[`${row}+${i}`]!==undefined 
                && positions[`${row}+${i}`].getType()==='rook' 
                && positions[`${row}+${i}`].moved===false
            ){
                rookPos = `${row}+${i}`;
            }
        }
        if(rookPos===null){
            return;
        }
        let flag = isinCheck(turn,{...positions})===true;
        let temp_positions = {...positions};
        for(let i = condition===true ? col+1 : col-1;condition===true ? i<=newCol : i>=newCol;condition===true ? i++ : i--){
            if(i!==newCol && positions[`${row}+${i}`]!==undefined){
                return;
            } else {
                temp_positions[`${row}+${i}`] = temp_positions[selectedLocation];
                if(isinCheck(turn,{...temp_positions})===true){
                    return;
                }
            }
        }

        let newrookPos = null;
        if(flag===false){
            newrookPos = condition===true ? `${row}+${newCol-1}` : `${row}+${newCol+1}`;
        }
        return {
            newrookPos : newrookPos,
            rookPos : rookPos
        }
    }


    checkValidMove = (id,selectedLocation,positions,turn)=>{
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
            if( positions[id]===undefined || (positions[id]!==undefined && positions[id].getColor()!==turn)){
                return 1;
            }
        }
        return 0;
    }
}

class Knight extends Piece{
    checkValidMove = (id,selectedLocation,positions,turn)=>{
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
        return 0;
    }
}

class Rook extends Piece{
    constructor(identifier,image,initialTurn){
        super(identifier,image,initialTurn);
        this.moved = false;
    }

    setMoved = ()=>this.moved = true;

    checkValidMove = (id,selectedLocation,positions,turn)=>{
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
        return 0;
    }
}

class Bishop extends Piece{
    checkValidMove = (id,selectedLocation,positions,turn)=>{
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
        return 0;
    }
}

export {
    King,Queen,Rook,Bishop,Pawn,Knight
}