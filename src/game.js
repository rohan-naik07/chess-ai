import React from "react";
import bdt from './pieces/Chess_bdt60.png';
import blt from './pieces/Chess_blt60.png';
import rdt from './pieces/Chess_rdt60.png';
import rlt from './pieces/Chess_rlt60.png';
import kdt from './pieces/Chess_kdt60.png';
import klt from './pieces/Chess_klt60.png';
import qdt from './pieces/Chess_qdt60.png';
import qlt from './pieces/Chess_qlt60.png';
import ndt from './pieces/Chess_ndt60.png';
import nlt from './pieces/Chess_nlt60.png';
import pdt from './pieces/Chess_pdt60.png';
import plt from './pieces/Chess_plt60.png';
import verifyCheckMate from "./checkmate";

const Game = ({board})=>{
    const pieces = {
        'blackbishop' : {
            image : bdt,
            score : 3,
            destroyed_flag : false
        },
        'whitebishop' : {
            image : blt,
            score : 3,
            destroyed_flag : false
        },
        'blackrook' : {
            image : rdt,
            score : 5,
            destroyed_flag : false
        },
        'whiterook' : {
            image : rlt,
            score : 5,
            destroyed_flag : false
        },
        'blackknight' : {
            image : ndt,
            score : 3,
            destroyed_flag : false
        },
        'whiteknight' : {
            image : nlt,
            score : 3,
            destroyed_flag : false
        },
        'blackpawn' : {
            image : pdt,
            score : 1,
            destroyed_flag : false
        },
        'whitepawn' : {
            image : plt,
            score : 1,
            destroyed_flag : false
        },
        'blackqueen' : {
            image : qdt,
            score : 9,
            destroyed_flag : false
        },
        'whitequeen' : {
            image : qlt,
            score : 9,
            destroyed_flag : false
        },
        'blackking' : {
            image : kdt,
            score : 0,
            destroyed_flag : false
        },
        'whiteking' : {
            image : klt,
            score : 0,
            destroyed_flag : false
        }
    }

    const initialPositions = {
        '0+0' : 'blackrook',
        '0+1' : 'blackknight',
        '0+2' : 'blackbishop',
        '0+3' : 'blackqueen',
        '0+4' : 'blackking',
        '0+5' : 'blackbishop',
        '0+6' : 'blackknight',
        '0+7' : 'blackrook',
        '1+0' : 'blackpawn',
        '1+1' : 'blackpawn',
        '1+2' : 'blackpawn',
        '1+3' : 'blackpawn',
        '1+4' : 'blackpawn',
        '1+5' : 'blackpawn',
        '1+6' : 'blackpawn',
        '1+7' : 'blackpawn',
        '6+0' : 'whitepawn',
        '6+1' : 'whitepawn',
        '6+2' : 'whitepawn',
        '6+3' : 'whitepawn',
        '6+4' : 'whitepawn',
        '6+5' : 'whitepawn',
        '6+6' : 'whitepawn',
        '6+7' : 'whitepawn',
        '7+0' : 'whiterook',
        '7+1' : 'whiteknight',
        '7+2' : 'whitebishop',
        '7+3' : 'whitequeen',
        '7+4' : 'whiteking',
        '7+5' : 'whitebishop',
        '7+6' : 'whiteknight',
        '7+7' : 'whiterook'
    }
    const [positions,setPositions] = React.useState(initialPositions);
    const [turn,setTurn] = React.useState('white');
    const [selectedLocation,setSelectedLocation] = React.useState(null);
    const [history,setHistory] = React.useState([]);
    const [destroyed,setDestroyed] = React.useState([]);

    const checkConstraints = position=>{
        return (
            position[0] >= 0 && position[0]<8 &&
            position[1] >= 0 && position[1]<8 
        )};

    const playMove = (flag,id)=>{
        if(flag!==0){
            if(flag===2){
                pieces[positions[id]].destroyed_flag = true;
                destroyed.push(id);
                setDestroyed(destroyed);
            }
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            setSelectedLocation(null);
            setPositions({...positions});
            history.push({...positions});
            setHistory(history);
            setTurn(turn==='white' ? 'black' : 'white');
        }
    }

    const checkValidMove = (id)=>{
        const type = positions[selectedLocation].substring(5);
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
                    if(checkConstraints(position)){
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
                if(
                    (newRow===row && newCol!==col) ||
                    (newRow!==row && newCol===col) ||
                    (newRow + newCol === row + col) ||
                    (newRow - newCol + 7 === row - col + 7)
                ){
                    if(checkConstraints([newRow,newCol])){
                        const overlapping = checkOverlap(id);
                        if(overlapping[0]===true || overlapping[1]===true || overlapping[2]===true || overlapping[3]===true){
                            flag=0;
                            return flag;
                        }
                        if(positions[id]===undefined ||
                        (positions[id]!==undefined && positions[id].substring(0,5)!==turn)){
                            if(positions[id]!==undefined && positions[id].substring(0,5)!==turn){
                               flag=2;
                            } else flag=1;
                        } 
                    }
                }
                break;
            case 'bishop':
                if(
                    (newRow + newCol === row + col) ||
                    (newRow - newCol + 7 === row - col + 7)
                ){
                    if(checkConstraints([newRow,newCol])){
                        const overlapping = checkOverlap(id);
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
                    if(checkConstraints(position)){
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
                    if(checkConstraints([newRow,newCol])){
                        const overlapping = checkOverlap(id);
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
                    row===1 || row===6 ? [(turn==='white' ? row-2 : row+2),col] : [row+10,col+10],
                    [(turn==='white' ? row-1 : row+1),col]
                ]
                const attackMoves = [
                    turn==='white' ? [row-1,col+1] : [row+1,col-1],
                    turn==='white' ? [row-1,col-1] : [row+1,col+1]
                ]
                let done=false;
                attackMoves.forEach(move=>{
                    if(move[0]===newRow && move[1]===newCol){
                        if(checkConstraints(move)){
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
                            if(checkConstraints(move)){
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

    const onClickHandler = (id)=>{
        if(selectedLocation!==null){
            if(positions[id]!==undefined && turn===positions[id].substring(0,5)){
                setSelectedLocation(id);
            } else {
                const flag = checkValidMove(id);
                playMove(flag,id);
            }
        } else {
            if(positions[id]!==undefined && turn===positions[id].substring(0,5)){
                setSelectedLocation(id);
            }
        }
    }

    React.useEffect(()=>{
        try {
            if(selectedLocation===null && history.length!==0)
                console.log(new verifyCheckMate().isCheckmated(2,turn,{...positions}));
        } catch (error) {
            console.log(error)
        }
    },[selectedLocation])

    const checkOverlap = (id)=>{
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

    const undoHandler = ()=>{
        if(history.length===0){
            return;
        }
        if(history.length-1===0){
            setPositions({...initialPositions});
            history.pop();
            setHistory(history)
            setTurn(turn==='white' ? 'black' : 'white');
            return;
        }
        if(history.length-2>=0){
            let prev = history[history.length-2];
            setPositions(history[history.length-2]);
            if(destroyed[destroyed.length-1]!==undefined)
                pieces[prev[destroyed[destroyed.length-1]]].destroyed_flag = false;
            destroyed.pop();
            setDestroyed(destroyed);
            history.pop();
            setHistory(history)
            setTurn(turn==='white' ? 'black' : 'white');
        } 
        
    }

    const getRowRendering = (row,index)=>{
        return <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} key={index}>
            {
                row.map(cell=>{
                    return <div id={`${cell.row}+${cell.col}`} key={`${cell.row}+${cell.col}`} 
                        style={{
                            padding:20,
                            backgroundColor: selectedLocation===`${cell.row}+${cell.col}` ? 'grey' : cell.color,
                            width:50,
                            height:50
                        }}  
                        onClick={()=>onClickHandler(`${cell.row}+${cell.col}`)}>
                        {
                            positions[`${cell.row}+${cell.col}`]!==undefined && 
                            pieces[positions[`${cell.row}+${cell.col}`]].destroyed_flag===false ?
                            <div id={`${cell.row}+${cell.col}`}>
                                <img width='50px' 
                                     height='50px' 
                                     alt={`${cell.row}+${cell.col}`} 
                                     src={pieces[positions[`${cell.row}+${cell.col}`]].image}
                                />
                            </div> : null
                        }
                    </div>}
                )
            }
        </div>
        
    }
    return (
        <div style={{padding : 20}}>
            <div style={{textAlign:'center'}}>
                {turn}
            </div>
            {
                board.map((row,index)=>getRowRendering(row,index))
            }
            <button style={{padding : 10,textAlign:'center'}} onClick={()=>undoHandler()}>Undo</button>
        </div>
    )
}

export default Game;
// check and checkmate