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
    const utils = new Utils();
    let minimax = new MiniMax();

    const quitGame = ()=>{
        setPositions(initialTurn==='white' ?  {...initialPositionsWhite} : {...initialPositionsBlack})
        setTurn(initialTurn);
        setSelectedLocation(null);
        setMoves([]);
        setMoved(checkifMoved);
        setGameOver(false);
        setPawnPromotions({});
        setisPlaying('y');
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
                moves.push([selectedLocation,id,initialTurn,piece])
                setMoves(moves);
            }
        } else {
            if(positions[id]!==undefined && turn===positions[id].substring(0,5)){
                setSelectedLocation(id);
            }
        }
    } 
    
    
    React.useEffect(()=>{
        if(turn!==initialTurn){
            let move = playAI(initialTurn);
            let selectedLocation = move[0];
            let id = move[1];
            setTurn(initialTurn)
            setisPlaying('y');
            moves.push([selectedLocation,id,turn,move[2]])
            setMoves(moves);
        }
        let isCheckWhite = utils.isinCheck('white',{...positions});
        let isCheckBlack = utils.isinCheck('black',{...positions});
        console.log(isCheckWhite)
        console.log(isCheckBlack)
        let over;
        if(isCheckWhite===true){
            over = utils.isCheckmated('white',{...positions});
            console.log(over)
            if(over===true){
                setGameOver(over);
            } 
        }

        if(isCheckBlack===true){
            over = utils.isCheckmated('black',{...positions});
            console.log(over)
            if(over===true){
                setGameOver(over);
            } 
        }
    },[turn])

    const undoHandler = ()=>{
        console.log(moves)
        if(moves.length===0){
            return;
        }
        moves.pop();
        moves.pop();
        console.log(moves)
        if(moves.length===0){
            let pos = initialTurn==='white' ?  {...initialPositionsWhite} : {...initialPositionsBlack};
            setPositions(pos);
            setTurn(initialTurn);
            return;
        }

        let opponentMove = moves[moves.length-1];
        let selectedLocation = opponentMove[1];
        let id = opponentMove[0];
        positions[id] = positions[selectedLocation];
        delete positions[selectedLocation];
        
        if(opponentMove[3]!==null){
            pieces[opponentMove[3]].destroyed_flag = false;
            if(moved[pieces[opponentMove[3]]]===true){
                moved[pieces[opponentMove[3]]] = false;
            }
        }

        if(pawnPromotions[moves.length]!==undefined){
            const key = Object.keys(pawnPromotions[moves.length])[0];
            delete pieces[key];
            positions[pawnPromotions[moves.length][key]] = key;
            delete pawnPromotions[moves.length];
            setPawnPromotions(pawnPromotions);
        }

        let yourMove = moves[moves.length-2];
        selectedLocation = yourMove[1];
        id = yourMove[0];
        positions[id] = positions[selectedLocation];
        delete positions[selectedLocation];
        
        if(yourMove[3]!==null){
            pieces[yourMove[3]].destroyed_flag = false;
            if(moved[pieces[yourMove[3]]]===true){
                moved[pieces[yourMove[3]]] = false;
            }
        }

        if(pawnPromotions[moves.length-1]!==undefined){
            const key = Object.keys(pawnPromotions[moves.length-1])[0];
            delete pieces[key];
            positions[pawnPromotions[moves.length-1][key]] = key;
            delete pawnPromotions[moves.length];
            setPawnPromotions(pawnPromotions);
        }

        
        setPositions(positions);
        setMoves(moves);
        setTurn(initialTurn);
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
        <div style={{width : '60%',margin:10}}>
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
        <div style={{width : '40%',position:'relative'}}>
            <div style={{
                display : 'flex',
                justifyContent : 'space-between',
                borderRadius : 10,
                backgroundColor : 'brown',
                padding : 20,
                textAlign : 'center',
                alignItems : 'center',
                margin : 10,
                color : 'white'
            }}>
                <div>
                    <Timer setDisplay={setDisplay} 
                        setGameOver={setGameOver}
                        turn={turn}
                /></div>
                <h5>Your have 5 minutes to decide a move. After that,game will be over.</h5>
            </div>
            
            <div style={{
                maxHeight : '520px',
                overflow : 'auto'
            }}>
                {moves.map(move=>(
                    <div style={{
                        display : 'flex',
                        alignItems : 'center',
                        textAlign : 'center',
                        justifyContent : 'space-between',
                        borderRadius : 10,
                        backgroundColor : '#c8cfca',
                        padding : 10,
                        margin : 10
                    }} key={move[0]}>
                        <div style={{
                            display : 'flex',
                            alignItems : 'center',
                            textAlign : 'center'
                        }}>
                            <div style={{
                                width:10,
                                height:10,
                                borderRadius : 50,
                                margin : 5,
                                backgroundColor : move[2]
                            }}/>
                            <p>{`${move[0]} -> ${move[1]}`}</p>
                        </div>
                        {move[3]===null ? null : (
                            <div style={{
                                display : 'flex',
                                alignItems : 'center',
                            }}>
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
            <div style={{
                position : 'absolute',
                bottom : 0,
                right : 0,
                left:0
            }}>
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
                    border: 'solid #000',
                    borderWidth: '1px',
                    borderColor : 'brown',
                    margin : 10
                }} onClick={quitGame}>Abandon</div>
            </div>
        </div>
    </div>
    )
}

const styles = {
    info : {
        borderRadius : 10,
        border: 'solid #000',
        borderWidth: '1px',
        borderColor : 'brown',
        marginLeft : 20,
        marginRight : 20,
        padding : 5,
        display:'flex',
        justifyContent : 'space-between'
    }
}

export default Game;
// check and checkmate