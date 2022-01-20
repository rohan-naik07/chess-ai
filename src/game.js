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
import Timer from "./timer";

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
        initialTurn==='white' ?  initialPositionsWhite : initialPositionsBlack
    );
    const [turn,setTurn] = React.useState(initialTurn);
    const [selectedLocation,setSelectedLocation] = React.useState(null);
    const [moves,setMoves] = React.useState([]);
    const [moved,setMoved] = React.useState(checkifMoved);
    const [gameOver,setGameOver] = React.useState(false);
    const [pawnPromotions,setPawnPromotions] = React.useState({});
    const [isPlaying,setisPlaying] = React.useState('y');
    const [check,setCheck] = React.useState(null);
    const utils = new Utils();
    let minimax = new MiniMax();

    const quitGame = ()=>{
        setPositions(initialTurn==='white' ?  initialPositionsWhite : initialPositionsBlack)
        setTurn(initialTurn);
        setSelectedLocation(null);
        setMoves([]);
        setMoved(checkifMoved);
        setGameOver(false);
        setPawnPromotions({});
        setisPlaying('y');
        setGameOver(true)
        setDisplay(0);
    }

    const playMove = (flag,id)=>{
        let attacked=null;
        if(flag!==0){
            if(flag===2){
                pieces[positions[id]].destroyed_flag = true;
                attacked = positions[id];
            }
            if(moved[positions[selectedLocation]]!==undefined){
                moved[positions[selectedLocation]] = true;
            }
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            setSelectedLocation(null);
            setPositions({...positions});
            setMoved(moved);
            setTurn(turn==='white' ? 'black' : 'white');
        }
        return attacked;
    }

    const playPassantMove = (flag,id)=>{
            pieces[positions[flag]].destroyed_flag = true;
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            setSelectedLocation(null);
            setPositions({...positions});
            setMoved(moved);
            setTurn(turn==='white' ? 'black' : 'white');
            return positions[flag]
    }

    const checkCastling = (id)=>{
        const newCol = Number(id.split('+')[1]);
        const row = Number(selectedLocation.split('+')[0]);
        const col = Number(selectedLocation.split('+')[1]);
        if(newCol > col){
            let rookPos = null;
            for(let i=col;i<=7;i++){
                if(
                    positions[`${row}+${i}`]!==undefined 
                    && positions[`${row}+${i}`].substring(6)==='rook' 
                    && moved[positions[`${row}+${i}`]]===false
                ){
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
                moves.push([selectedLocation,id,turn,null,0])
                moves.push([rookPos,`${row}+${newCol-1}`,turn,null])
                setMoves(moves)
                setSelectedLocation(null);
                setPositions({...positions});
                setTurn(turn==='white' ? 'black' : 'white');
            }
        }
        if(newCol < col){
            let rookPos = null;
            for(let i=col;i>=0;i--){
                if(
                    positions[`${row}+${i}`]!==undefined && 
                    positions[`${row}+${i}`].substring(6)==='rook' && 
                    moved[positions[`${row}+${i}`]]===false
                ){
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
                moves.push([selectedLocation,id,turn,null])
                moves.push([rookPos,`${row}+${newCol+1}`,turn,null])
                setMoves(moves)
                setSelectedLocation(null);
                setPositions({...positions});
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
        pawnPromotions[moves.length] = {
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
        }
        if(positions[id]!==undefined){
            move.push(positions[id])
        } else {
            move.push(null);
        }
        if(moved[positions[selectedLocation]]!==undefined){
            moved[positions[selectedLocation]] = true;
        }
        positions[id] = positions[selectedLocation];
        delete positions[selectedLocation];
        setSelectedLocation(null);
        setPositions({...positions});
        setMoved(moved);
        return move;
    }

    const onClickHandler = (id)=>{
        if(gameOver===true){
            return;
        }
        if(utils.isinCheck(turn,{...positions})===true){
            setGameOver(true);
            return;
        } else {
            setCheck(null);
        } 
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
                let piece;
                if(typeof(flag)==="string"){
                    piece = playPassantMove(flag,id);
                } else piece = playMove(flag,id);

                setisPlaying('a');
                if(flag!==0){
                    moves.push([selectedLocation,id,initialTurn,piece])
                    setMoves(moves);
                }
                let isCheck = utils.isinCheck(turn,{...positions});
                let over;
                if(isCheck===true){
                    setCheck(turn==='white' ? 'black' : 'white' )
                    over = utils.isCheckmated(turn,{...positions});
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
        if(gameOver===true){
            return;
        }
        try {
            if(turn!==initialTurn){
                if(utils.isinCheck(turn,{...positions})){
                    setGameOver(true);
                    return;
                } else {
                    setCheck(null);
                } 
    
                let move = playAI(initialTurn);
                let selectedLocation = move[0];
                let id = move[1];
                setTurn(initialTurn)
                setisPlaying('y');
                moves.push([selectedLocation,id,turn,move[2]])
                setMoves(moves);
    
                let isCheck = utils.isinCheck(turn,{...positions});
                let over;
                if(isCheck===true){
                    setCheck(turn==='white' ? 'black' : 'white' )
                    over = utils.isCheckmated(turn,{...positions});
                    if(over===true){
                        setGameOver(over);
                    } 
                } 
            }
        } catch (error) {
            window.alert(error)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[turn])

    const undoHandler = ()=>{
        if(moves.length===0 || gameOver===true){
            return;
        }
        let key;
        let opponentMove = moves[moves.length-1];
        let selectedLocation = opponentMove[1];
        let id = opponentMove[0];
        positions[id] = positions[selectedLocation];
        delete positions[selectedLocation];
        if(opponentMove[3]!==null){
            positions[selectedLocation] = opponentMove[3];
            pieces[opponentMove[3]].destroyed_flag = false;
            if(moved[pieces[opponentMove[3]]]===true){
                moved[pieces[opponentMove[3]]] = false;
            }
        }

        if(pawnPromotions[moves.length]!==undefined){
            key = Object.keys(pawnPromotions[moves.length])[0];
            delete pieces[key];
            positions[pawnPromotions[moves.length][key]] = key;
            delete pawnPromotions[moves.length];
            setPawnPromotions(pawnPromotions);
        }

        moves.pop();
        let yourMove = moves[moves.length-1];
        selectedLocation = yourMove[1];
        id = yourMove[0];
        positions[id] = positions[selectedLocation];
        delete positions[selectedLocation];
        if(yourMove[3]!==null){
            positions[selectedLocation] = yourMove[3];
            pieces[yourMove[3]].destroyed_flag = false;
            if(moved[pieces[yourMove[3]]]===true){
                moved[pieces[yourMove[3]]] = false;
            }
        }

        if(pawnPromotions[moves.length]!==undefined){
            key = Object.keys(pawnPromotions[moves.length])[0];
            delete pieces[key];
            positions[pawnPromotions[moves.length][key]] = key;
            delete pawnPromotions[moves.length];
            setPawnPromotions(pawnPromotions);
        }

        moves.pop();
        setPositions({...positions});
        setMoves(moves);

        if(yourMove[4]===0){
            yourMove = moves[moves.length-1];
            selectedLocation = yourMove[1];
            id = yourMove[0];
            positions[id] = positions[selectedLocation];
            delete positions[selectedLocation];
            moves.pop();
            setPositions({...positions});
            setMoves(moves);
        }

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
                            }
                        }}>
                        {
                            positions[`${cell.row}+${cell.col}`]!==undefined && 
                            pieces[positions[`${cell.row}+${cell.col}`]].destroyed_flag===false ?
                            <div id={`${cell.row}+${cell.col}`} style={{textAlign : 'center'}}>
                                <img 
                                     className="square-image"
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
                { isPlaying!==null && isPlaying==='a' ? <h5>Playing...</h5> : null }
            </div>
            { getBoard().map((row,index)=>getRowRendering(row,index)) }
            <div style={styles.info}>
                <h3>{name}</h3>
                { isPlaying!==null && isPlaying==='y' ? <h5>Playing...</h5>: null }
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
                                src = {pieces[move[3]].image}
                                alt={'move'}/>
                            <p> captured</p>
                        </div>
                        )}
                    </div> 
                ))}
            </div>
            <div className="actions">
                <div style={styles.undo} onClick={()=>undoHandler()}>Undo</div>
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