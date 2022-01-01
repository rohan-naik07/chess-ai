import React from "react";
import { initialPositionsWhite,initialPositionsBlack,pieces,checkifMoved } from "./initials";
import Utils from "./util";

const Game = ({board,initialTurn})=>{
    const [positions,setPositions] = React.useState(
        initialTurn==='white' ?  initialPositionsWhite : initialPositionsBlack
    );
    const [turn,setTurn] = React.useState(initialTurn);
    const [selectedLocation,setSelectedLocation] = React.useState(null);
    const [history,setHistory] = React.useState([]);
    const [destroyed,setDestroyed] = React.useState([]);
    const [moved,setMoved] = React.useState(checkifMoved);
    const utils = new Utils();

    const playMove = (flag,id)=>{
        if(flag!==0){
            if(flag===2){
                pieces[positions[id]].destroyed_flag = true;
                destroyed.push(id);
                setDestroyed(destroyed);
            }
            if(moved[positions[selectedLocation]]!==undefined){
                moved[positions[selectedLocation]] = true;
            }
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            history.push({...positions});
            setSelectedLocation(null);
            setPositions({...positions});
            setMoved(moved);
            setHistory(history);
            setTurn(turn==='white' ? 'black' : 'white');
        }
    }
    const checkCastling = (id)=>{
        const newCol = Number(id.split('+')[1]);
        const row = Number(selectedLocation.split('+')[0]);
        const col = Number(selectedLocation.split('+')[1]);
        if(newCol > col){
            let rookPos = null;
            for(let i=col;i<=7;i++){
                if(positions[`${row}+${i}`]!==undefined && positions[`${row}+${i}`].substring(6)==='rook' && moved[positions[`${row}+${i}`]]===false){
                    rookPos = `${row}+${i}`;
                }
            }
            if(rookPos===null){
                return;
            }
            let flag = utils.isinCheck(turn,{...positions})===true;
            let temp_positions = {...positions};
            for(let i = col+1;i<=newCol;i++){
                if(i!==newCol && positions[`${row}+${i}`]!==undefined){
                    return;
                } else {
                    temp_positions[`${row}+${i}`] = temp_positions[selectedLocation];
                    if(utils.isinCheck(turn,temp_positions)===true){
                        return;
                    }
                }
            }
            if(flag===false){
                positions[id] = positions[selectedLocation];
                delete positions[selectedLocation];
                positions[`${row}+${newCol-1}`] = positions[rookPos];
                delete positions[rookPos];
                setSelectedLocation(null);
                setPositions({...positions});
                history.push({...positions});
                setHistory(history);
                setTurn(turn==='white' ? 'black' : 'white');
            }
        }
        if(newCol < col){
            let rookPos = null;
            for(let i=col;i>=0;i--){
                if(positions[`${row}+${i}`]!==undefined && positions[`${row}+${i}`].substring(6)==='rook' && moved[positions[`${row}+${i}`]]===false){
                    rookPos = `${row}+${i}`;
                }
            }
            if(rookPos===null){
                return;
            }
            let flag = utils.isinCheck(turn,{...positions})===true;
            let temp_positions = {...positions};
        
            for(let i = col-1;i>=newCol;i--){
                if(i!==newCol && positions[`${row}+${i}`]!==undefined){
                    return;
                } else {
                    temp_positions[`${row}+${i}`] = temp_positions[selectedLocation];
                    if(utils.isinCheck(turn,{...temp_positions})===true){
                        return;
                    }
                }
            }
            if(flag===false){
                positions[id] = positions[selectedLocation];
                delete positions[selectedLocation];
                positions[`${row}+${newCol+1}`] = positions[rookPos];
                delete positions[rookPos];
                setSelectedLocation(null);
                setPositions({...positions});
                history.push({...positions});
                setHistory(history);
                setTurn(turn==='white' ? 'black' : 'white');
            }
        }
    }
   
    const onClickHandler = (id)=>{
        if(selectedLocation!==null){
            const type = positions[selectedLocation].substring(6);
            const newRow = Number(id.split('+')[0]);
            const newCol = Number(id.split('+')[1]);
            const row = Number(selectedLocation.split('+')[0]);
            const col = Number(selectedLocation.split('+')[1]);
            if(positions[id]!==undefined && turn===positions[id].substring(0,5)){
                setSelectedLocation(id);
            } else {
                if(type==='king' && Math.abs(newCol-col)>=2 && row===newRow){
                    if(moved[positions[selectedLocation]]===false)
                        checkCastling(id);
                   return;
                }
                let flag = utils.checkValidMove(id,selectedLocation,positions,turn);
                playMove(flag,id);
                if(utils.isinCheck(turn,positions)===true){
                    console.log(utils.isCheckmated(turn,positions))
                }
            }
        } else {
            if(positions[id]!==undefined && turn===positions[id].substring(0,5)){
                setSelectedLocation(id);
            }
        }
    }    

    const undoHandler = ()=>{
        console.log(history.length)
        if(history.length===0){
            return;
        }
        if(history.length-1===0){
            let pos = initialTurn==='white' ?  {...initialPositionsWhite} : {...initialPositionsBlack};
            setPositions(pos);
            history.pop();
            setHistory(history)
            setTurn(turn==='white' ? 'black' : 'white');
            return;
        }
        if(history.length-2>=0){
            let prev = history[history.length-2];
            setPositions(history[history.length-2]);
            if(destroyed[destroyed.length-1]!==undefined){
                pieces[prev[destroyed[destroyed.length-1]]].destroyed_flag = false;
                if(moved[pieces[prev[destroyed[destroyed.length-1]]]]===true){
                    moved[pieces[prev[destroyed[destroyed.length-1]]]] = false;
                }
            }  
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