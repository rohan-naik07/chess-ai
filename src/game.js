import React from "react";
import { 
    initialPositionsWhite,
    initialPositionsBlack
} from "./initials";
import MiniMax from "./minimax";
import './App.css'
import Timer from "./timer";
import {isinCheck,isCheckmated} from './util';

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

const Game = ({initialTurn,name,setDisplay})=>{
    const [positions,setPositions] = React.useState(
        initialTurn==='white' ?  {...initialPositionsWhite} : {...initialPositionsBlack}
    );
    const [turn,setTurn] = React.useState(initialTurn);
    const [selectedLocation,setSelectedLocation] = React.useState(null);
    const [moves,setMoves] = React.useState([]);
    const [gameOver,setGameOver] = React.useState(false);
    const [check,setCheck] = React.useState(null);
    let minimax = new MiniMax(initialTurn);

    const quitGame = ()=>{
        setPositions(initialTurn==='white' ?  {...initialPositionsWhite} : {...initialPositionsBlack})
        setTurn(initialTurn);
        setSelectedLocation(null);
        setMoves([]);
        setGameOver(true)
        setDisplay(0);
    }

    const playMove = (flag,selectedLocation,id)=>{
        let attacked=null;
        if(flag!==0){
            if(flag===2){
                positions[id].setDestroyed(true);
                attacked = positions[id];
            }
            if(positions[selectedLocation].getType()==='king' || positions[selectedLocation].getType()==='rook'){
                positions[selectedLocation].setMoved();
            }
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            setSelectedLocation(null);
            setPositions({...positions});
            setTurn(turn==='white' ? 'black' : 'white');
        }
        return attacked;
    }

    const playPassantMove = (flag,selectedLocation,id)=>{
            positions[flag].setDestroyed(true);
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            setSelectedLocation(null);
            setPositions({...positions});
            setTurn(turn==='white' ? 'black' : 'white');
            return positions[flag]
    }

    
    const playAI = (turn)=>{
        let move = minimax.minimaxRoot(3,true, turn==='white' ? 'black' : 'white',{...positions});
        let selectedLocation = move[0];
        let id = move[1];

        if(positions[id]!==undefined){
            positions[id].setDestroyed(true);
        }

        if(positions[id]!==undefined){
            move.push(positions[id])
        } else {
            move.push(null);
        }
       
        positions[id] = positions[selectedLocation];
        delete positions[selectedLocation];
        setSelectedLocation(null);
        setPositions({...positions});
        return move;
    }

    const onClickHandler = (id)=>{
        if(gameOver===true){
            return;
        }
        if(selectedLocation!==null){
            const type = positions[selectedLocation].getType();
            if(positions[id]!==undefined && turn===positions[id].getColor()){
                setSelectedLocation(id);
            } else {
                if(type==='king'){
                    if(positions[selectedLocation].moved===false){
                        let castling_positions = positions[selectedLocation].checkCastling(id,selectedLocation,positions);
                        if(castling_positions.rookPos===null || castling_positions.newRookPos===null){
                            //play two turns
                            playMove(1,selectedLocation,id);
                            playMove(1,castling_positions.newRookPos,castling_positions.rookPos);
                        }
                    }
                   return;
                }
                
                let flag = positions[selectedLocation].checkValidMove(id,selectedLocation,positions,turn);
                const newRow = Number(id.split('+')[0]);
                if(type==='pawn'){
                    if(initialTurn==='white'){
                        if(turn==='white' && newRow===0){
                            if(flag!==0){
                                positions[selectedLocation].promote(turn);
                                return;
                            }
                        }
                        if(turn==='black' && newRow===7){
                            if(flag!==0){
                                positions[selectedLocation].promote(turn);
                                return;
                            }
                        }
                    } else {
                        if(turn==='white' && newRow===7){
                            if(flag!==0){
                                positions[selectedLocation].promote(turn);
                                return;
                            }
                        }
                        if(turn==='black' && newRow===0){
                            if(flag!==0){
                                positions[selectedLocation].promote(turn);
                                return;
                            }
                        }
                    }
                }
                
                let piece;
                if(typeof(flag)==="string"){
                    piece = playPassantMove(flag,selectedLocation,id);
                } else {
                    piece = playMove(flag,selectedLocation,id);
                }

                let isCheck = isinCheck('white',{...positions});
                let over;
                if(isCheck===true){
                    setCheck('black')
                    over = isCheckmated('white',{...positions});
                    if(over===true){
                        setGameOver(over);
                    } 
                }
                isCheck = isinCheck('black',{...positions});
                if(isCheck===true){
                    setCheck('white')
                    over = isCheckmated('black',{...positions});
                    if(over===true){
                        setGameOver(over);
                    } 
                }


                if(flag!==0){
                    moves.push([selectedLocation,id,initialTurn,piece])
                    setMoves(moves);
                }

            }
        } else {
            if(positions[id]!==undefined && turn===positions[id].getColor()){
                setSelectedLocation(id);
            }
        }
    } 
    
    
    React.useEffect(()=>{
        if(gameOver===true){
            return;
        }
        
        try {
            if(turn!==initialTurn){
                let move = playAI(initialTurn);
                let selectedLocation = move[0];
                let id = move[1];
                setTurn(initialTurn)
                moves.push([selectedLocation,id,turn,move[2]])
                setMoves(moves);
            }
        } catch (error) {
            window.alert(error)
            console.error(error)
        }

        let isCheck = isinCheck('white',{...positions});
        let over;
        if(isCheck===true){
            setCheck('black')
            over = isCheckmated('white',{...positions});
            if(over===true){
                setGameOver(over);
            } 
        }
        isCheck = isinCheck('black',{...positions});
        if(isCheck===true){
            setCheck('white')
            over = isCheckmated('black',{...positions});
            if(over===true){
                setGameOver(over);
            } 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[turn])

    const undoHandler = ()=>{
        if(moves.length===0 || gameOver===true){
            return;
        }
        
        let move = moves[moves.length-1];
        let selectedLocation = move[1];
        let id = move[0];
        positions[id] = positions[selectedLocation];
        delete positions[selectedLocation];
        if(move[3]!==null){
            positions[selectedLocation] = move[3];
            move[3].setDestroyed(false);
        }
        if(move[3]!==null && move[3].getType()==='pawn'){
            move[3].demote();
        }
        moves.pop();
        setPositions({...positions});
        setMoves(moves);
        setTurn(initialTurn);
    }

    const getRowRendering = (row,index)=>{
        return <div style={styles.rowRender} key={index}>
            {
                row.map(cell=>{
                    return <div id={`${cell.row}+${cell.col}`} key={`${cell.row}+${cell.col}`} 
                        style={{backgroundColor: selectedLocation===`${cell.row}+${cell.col}` ? 'grey' : cell.color}} 
                        className="square" 
                        onClick={()=>{
                            try {
                                onClickHandler(`${cell.row}+${cell.col}`)
                            } catch (error) {
                                window.alert(error)
                                console.error(error)
                            }
                        }}>
                        {
                            positions[`${cell.row}+${cell.col}`]!==undefined && 
                            positions[`${cell.row}+${cell.col}`].destroyed===false ?
                            <div id={`${cell.row}+${cell.col}`} style={{textAlign : 'center'}}>
                                <img 
                                     className="square-image"
                                     alt={`${cell.row}+${cell.col}`} 
                                     src={positions[`${cell.row}+${cell.col}`].getImage()}
                                />
                            </div> : null
                        }
                    </div>}
                )
            }
        </div>
        
    }

    const displayMessage = ()=>{
        if(gameOver===true){
            return (
                <h4 style={{color : 'yellow'}}>Checkmate!!</h4>
            )
        }
        if(check===null){
            return (
                <h5>Your have 5 minutes to decide a move. After that,game will be over.</h5>
            )
        }
        return (
            <h4 style={{color : check}}>Check!!</h4>
        )
    }
    return (
    <div className="container">
        <div className="left-pane">
            <div style={styles.info}>
                <h3>AI</h3>
                { turn!==initialTurn ? <h5>Playing...</h5> : null }
            </div>
            { getBoard().map((row,index)=>getRowRendering(row,index)) }
            <div style={styles.info}>
                <h3>{name}</h3>
                { turn===initialTurn ? <h5>Playing...</h5>: null }
            </div>
        </div>
        <div className="right-pane">
            <div style={styles.timer}>
                <div>
                    <Timer quitGame={quitGame}
                        turn={turn}
                /></div>
                <div style={{padding:10}}>{displayMessage()}</div>
            </div>
            <div style={styles.moveList}>
                {moves.map((move,index)=>(
                    <div style={styles.move} key={`${move[0]}->${move[1]}->${index}`}>
                        <div style={styles.moveItem}>
                            <div style={
                                {
                                    width:10,
                                    height:10,
                                    borderRadius : 50,
                                    margin : 5,
                                    backgroundColor : move[2]
                                }
                            }/>
                            <p>{`${move[0]} -> ${move[1]}`}</p>
                        </div>
                        {move[3]===null ? null : (
                            <div style={styles.destroyed_image}>
                            <img width='20px'
                                height={'20px'}
                                src = {move[3].getImage()}
                                alt={'move'}/>
                            <p> captured</p>
                        </div>
                        )}
                    </div> 
                ))}
            </div>
            <div className="actions">
                <div style={styles.undo} onClick={()=>{
                    undoHandler();
                    undoHandler();
                }}>Undo</div>
                <div style={styles.abandon} onClick={quitGame}>Abandon</div>
            </div>
        </div>
    </div>
    )
}

const styles = {
    rowRender : {
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    info : {
        borderRadius : 10,
        border: 'solid #000',
        borderWidth: '1px',
        borderColor : 'brown',
        margin : 10,
        padding : 5,
        display:'flex',
        justifyContent : 'space-between'
    },
    abandon : {
        padding : 10,
        textAlign:'center',
        borderRadius : 10,
        border: 'solid #000',
        borderWidth: '1px',
        borderColor : 'brown',
        margin : 10
    },
    undo : {
        padding : 10,
        textAlign:'center',
        borderRadius : 10,
        border: 'solid #000',
        borderWidth: '1px',
        margin : 10
    },
    destroyed_image : {
        display : 'flex',
        alignItems : 'center',
    },
    moveItem : {
        display : 'flex',
        alignItems : 'center',
        textAlign : 'center'
    },
    move : {
        display : 'flex',
        alignItems : 'center',
        textAlign : 'center',
        justifyContent : 'space-between',
        borderRadius : 10,
        backgroundColor : '#c8cfca',
        padding : 10,
        margin : 10
    },
    moveList : {
        maxHeight : '520px',
        overflow : 'auto'
    },
    timer : {
        display : 'flex',
        justifyContent : 'space-between',
        borderRadius : 10,
        backgroundColor : 'brown',
        padding : 20,
        textAlign : 'center',
        alignItems : 'center',
        margin : 10,
        color : 'white'
    }
}

export default Game;