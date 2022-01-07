import React from "react";
import { 
    initialPositionsWhite,
    initialPositionsBlack,
    pieces,
    checkifMoved 
} from "./initials";
import Utils from "./util";
import qdt from './pieces/Chess_qdt60.png';
import qlt from './pieces/Chess_qlt60.png';
import MiniMax from "./minimax";
import './App.css'

function getBoard(){
  const board = [];
  let flag = true;
  for(let i=0;i<8;i+=1){
    let row = []
    for(let j=0;j<8;j+=1){
      row.push({
        row : i,
        col : j,
        color : flag===true ? 'white' : 'brown'
      })
      flag = flag===true ? false : true
    }
    board.push(row)
    flag = flag===true ? false : true
  }
  return board;
}

const Game = ({initialTurn,name})=>{
    const [positions,setPositions] = React.useState(
        initialTurn==='white' ?  initialPositionsWhite : initialPositionsBlack
    );
    const [turn,setTurn] = React.useState(initialTurn);
    const [selectedLocation,setSelectedLocation] = React.useState(null);
    const [history,setHistory] = React.useState([]);
    const [destroyed,setDestroyed] = React.useState([]);
    const [moved,setMoved] = React.useState(checkifMoved);
    const [gameOver,setGameOver] = React.useState(false);
    const [pawnPromotions,setPawnPromotions] = React.useState({});
    const [isPlaying,setisPlaying] = React.useState(true);
    const utils = new Utils();
    let minimax = new MiniMax();

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

    const playPassantMove = (flag,id)=>{
            pieces[positions[flag]].destroyed_flag = true;
            destroyed.push(flag);
            setDestroyed(destroyed);
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            history.push({...positions});
            setSelectedLocation(null);
            setPositions({...positions});
            setMoved(moved);
            setHistory(history);
            setTurn(turn==='white' ? 'black' : 'white');
        
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

    const promotePawn = (id,turn,flag)=>{
        pieces[`${turn}1queen`] = {
            image : turn==='white' ? qlt : qdt,
            score : 9,
            destroyed_flag : false
        }
        pawnPromotions[history.size] = {
                [`${turn}1queen`] : positions[selectedLocation]
        }
        setPawnPromotions({...pawnPromotions});
        positions[selectedLocation] = `${turn}1queen`;
        playMove(flag,id);
    }
    const playAI = (turn)=>{
        let move = minimax.minimaxRoot(3,true, turn==='white' ? 'black' : 'white',{...positions});
        let selectedLocation = move[0];
        let id = move[1];
        if(positions[id]!==undefined){
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
    }

    const onClickHandler = (id)=>{
        if(gameOver===true){
            return;
        }
        setisPlaying(true)
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
                
                let flag = utils.checkValidMove(id,selectedLocation,positions,turn,true);
                if(type==='pawn'){
                    if(initialTurn==='white'){
                        if(turn==='white' && newRow===0){
                            if(flag!==0){
                                promotePawn(id,turn,flag)
                                return;
                            }
                        }
                        if(turn==='black' && newRow===7){
                            if(flag!==0){
                                promotePawn(id,turn,flag);
                            }
                        }
                    } else {
                        if(turn==='white' && newRow===7){
                            if(flag!==0){
                                promotePawn(id,turn,flag);
                            }
                        }
                        if(turn==='black' && newRow===0){
                            if(flag!==0){
                                promotePawn(id,turn,flag);
                            }
                        }
                    }
                }
                if(typeof(flag)==="string"){
                    playPassantMove(flag,id);
                } else playMove(flag,id);

                setisPlaying(false);
                if(utils.isinCheck(turn,{...positions})===true){
                    const over = utils.isCheckmated(turn,{...positions});
                    if(over===true){
                        setGameOver(over);
                    }
                }
            }
        } else {
            if(positions[id]!==undefined && turn===positions[id].substring(0,5)){
                setSelectedLocation(id);
            }
        }
    } 
    
    React.useEffect(()=>{
        if(turn!==initialTurn){
            setisPlaying(true);
            playAI(initialTurn);
            setTurn(initialTurn)
            setisPlaying(false);
        }
    },[turn])

    const undoHandler = ()=>{
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
            if(destroyed[destroyed.length-1]!==undefined){
                pieces[prev[destroyed[destroyed.length-1]]].destroyed_flag = false;
                if(moved[pieces[prev[destroyed[destroyed.length-1]]]]===true){
                    moved[pieces[prev[destroyed[destroyed.length-1]]]] = false;
                }
            }

            if(pawnPromotions[history.length]!==undefined){
                const key = Object.keys(pawnPromotions[history.length])[0];
                delete pieces[key];
                history[history.length-2][pawnPromotions[history.length][key]] = key;
                delete pawnPromotions[history.length];
                setPawnPromotions(pawnPromotions);
            }

            setPositions(history[history.length-2]);
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
                            width:40,
                            height:40
                        }}  
                        onClick={()=>onClickHandler(`${cell.row}+${cell.col}`)}>
                        {
                            positions[`${cell.row}+${cell.col}`]!==undefined && 
                            pieces[positions[`${cell.row}+${cell.col}`]].destroyed_flag===false ?
                            <div id={`${cell.row}+${cell.col}`}>
                                <img width='40px' 
                                     height='40px' 
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
    <div style={{display:'flex',justifyContent : 'space-around'}}>
        <div style={{width : '60%'}}>
            <div style={styles.opponentTurn}>
                <h3>AI</h3>
                {
                    isPlaying===true ? <h5>Playing...</h5> : null
                }
            </div>
            {
                getBoard().map((row,index)=>getRowRendering(row,index))
            }
            <div style={styles.yourTurn}>
                <h3>{name}</h3>
                {
                    isPlaying===true ? <h5>Playing...</h5>: null
                }
                </div>
        </div>
        <div style={{width : '40%'}}>
            <div style={{ 
                borderRadius : 10,
                backgroundColor : 'brown',
                padding : 20,
                margin : 10
            }}>Timer</div>
            <div style={{ 
                borderRadius : 10,
                backgroundColor : 'grey',
                padding : 20,
                margin : 10,
                minHeight : '150px',
                overflow : 'auto'
            }}>
                
            </div>
            <div style={{
                padding : 10,
                textAlign:'center',
                borderRadius : 10,
                border: 'solid #000',
                borderWidth: '1px',
                margin : 10
            }} onClick={()=>undoHandler()}>Undo</div>
            <div style={{
                padding : 10,
                textAlign:'center',
                borderRadius : 10,
                backgroundColor : 'brown',
                margin : 10
            }} onClick={null}>Abandon</div>
        </div>
    </div>
    )
}

const styles = {
    yourTurn : {
        borderRadius : 10,
        backgroundColor : 'brown',
        margin : 5,
        padding : 5,
        display:'flex',
        justifyContent : 'space-between'
    },
    opponentTurn : {
        borderRadius : 10,
        border: 'solid #000',
        borderWidth: '1px',
        borderColor : 'brown',
        margin : 10,
        padding : 5,
        display:'flex',
        justifyContent : 'space-between'
    }
}

export default Game;
// check and checkmate