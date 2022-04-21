import { checkValidMove } from "./minimax";

const getMoves =(positions,turn,initialTurn)=>({
    'king': (row,col)=>{
        const res=[];
        let selectedLocation = `${row}+${col}`;
        let possible_moves = {
            [`${row+1}+${col}`] : true,
            [`${row-1}+${col}`] : true,
            [`${row}+${col+1}`] : true,
            [`${row}+${col-1}`] : true,
            [`${row+1}+${col+1}`] : true,
            [`${row+1}+${col-1}`] : true,
            [`${row-1}+${col+1}`] : true,
            [`${row-1}+${col-1}`] : true
        }
        Object.keys(possible_moves).forEach(
            element => {
                if(checkValidMove(element,selectedLocation,positions,turn,initialTurn)===1){
                    res.push(element);
                }
            }
        );
        return res;
    },
    'queen': (row,col)=>{
        const res=[];
        let n = Math.max([7-row,7-col,row,col])
        let selectedLocation = `${row}+${col}`;
        for(let i=0;i<=n;i++){
            let possible_moves = {
                [`${row+1}+${col}`] : true,
                [`${row-1}+${col}`] : true,
                [`${row}+${col+1}`] : true,
                [`${row}+${col-1}`] : true,
                [`${row+1}+${col+1}`] : true,
                [`${row+1}+${col-1}`] : true,
                [`${row-1}+${col+1}`] : true,
                [`${row-1}+${col-1}`] : true
            }
            Object.keys(possible_moves).forEach(
                element => {
                    if(checkValidMove(element,selectedLocation,positions,turn,initialTurn)===1){
                        res.push(element);
                    }
                }
            );
        }
        return res;
    },
    'pawn': (row,col)=>{
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
        const res=[];
        let selectedLocation = `${row}+${col}`;
        Object.keys(plainMoves).forEach(
            element => {
                if(checkValidMove(element,selectedLocation,positions,turn,initialTurn)===1){
                    res.push(element);
                }
            }
        );
        Object.keys(attackMoves).forEach(
            element => {
                if(checkValidMove(element,selectedLocation,positions,turn,initialTurn)===1){
                    res.push(element);
                }
            }
        );
        return res;
    },
    'rook': (row,col)=>{
        const res=[];
        let n = Math.max([7-row,7-col,row,col])
        let selectedLocation = `${row}+${col}`;
        for(let i=0;i<=n;i++){
            let possible_moves = {
                [`${row+1}+${col}`] : true,
                [`${row-1}+${col}`] : true,
                [`${row}+${col+1}`] : true,
                [`${row}+${col-1}`] : true
            }
            Object.keys(possible_moves).forEach(
                element => {
                    if(checkValidMove(element,selectedLocation,positions,turn,initialTurn)===1){
                        res.push(element);
                    }
                }
            );
        }
        return res;
    },
    'knight': (row,col)=>{
        let possible_moves={
            [`${row+2}+${col+1}`] : true,
            [`${row-2}+${col+1}`] : true,
            [`${row+1}+${col+2}`] : true,
            [`${row+1}+${col-2}`] : true,
            [`${row+2}+${col-1}`] : true,
            [`${row-2}+${col-1}`] : true,
            [`${row-1}+${col+2}`] : true,
            [`${row-1}+${col-2}`] : true,
        }
        const res=[];
        let selectedLocation = `${row}+${col}`;
        Object.keys(possible_moves).forEach(
            element => {
                if(checkValidMove(element,selectedLocation,positions,turn,initialTurn)===1){
                    res.push(element);
                }
            }
        );
        return res;
    },
    'bishop': (row,col)=>{
        const res=[];
        let n = Math.max([7-row,7-col,row,col])
        let selectedLocation = `${row}+${col}`;
        for(let i=0;i<=n;i++){
            let possible_moves = {
                [`${row+1}+${col+1}`] : true,
                [`${row+1}+${col-1}`] : true,
                [`${row-1}+${col+1}`] : true,
                [`${row-1}+${col-1}`] : true
            }
            Object.keys(possible_moves).forEach(
                element => {
                    if(checkValidMove(element,selectedLocation,positions,turn,initialTurn)===1){
                        res.push(element);
                    }
                }
            );
        }
        return res;
    }
})

export const getAllMoves = (positions,turn,initialTurn)=>{
    let moves = [];
    Object.keys(positions).forEach(
        position=>{
            moves = [...moves,getMoves(positions,turn,initialTurn)[position.type](row,col)]
        }
    )
    return moves;
}