import React from "react";
import { 
    getCompressedObject,
    getInitialPositions
} from "./initials";
import {isinCheck,isCheckmated} from './util';
import './App.css'
import Timer from "./timer";
import jwtDecode from "jwt-decode";
import {  getMovefromAI,updateGameMoves } from "./tools/urls";

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

const Game = ({game,socket,token,history,gameWithAI})=>{
    const user_id = jwtDecode(token)._id;
    const initialTurn = user_id===game.participant1._id ? game.initialTurn : (
        game.initialTurn==='white' ? 'black' : 'white'
    );
    const initialPositions = getInitialPositions(initialTurn);
    const [positions,setPositions] = React.useState(initialPositions.positions);
    const [turn,setTurn] = React.useState(initialTurn);
    const [selectedLocation,setSelectedLocation] = React.useState(null);
    const [moves,setMoves] = React.useState([]);
    const [gameOver,setGameOver] = React.useState(null);
    const [check,setCheck] = React.useState(null);

    const quitGame = (result)=>{
        let resultData={
            moves : moves,
            result : result
        }

        updateGameMoves(game._id,resultData,token).then(
            response=>{
                console.log(response)
                if(gameWithAI===false)
                    socket.emit("abandon",{room : game._id});
                history('/home');
            }
        ).catch(
            error=>{
                console.log(error)
                window.alert("failed to update game")
            }
        )
    }
       
    const playMove = (flag,selectedLocation,id,piece)=>{
        if(flag!==0){
            setSelectedLocation(null);                
            moves.push([selectedLocation,id,turn,piece])
            setMoves(moves);
            setPositions(prevPositions=>
                {
                   let piece = prevPositions[selectedLocation]
                   return {
                    ...prevPositions,
                    [selectedLocation] : undefined,
                    [id] : piece
                   }
                }
            );
        }
    }

    
    const onClickHandler = (id)=>{
        if(gameOver!==null){
            return;
        }
        if(selectedLocation===null && initialTurn!==turn){
            return;
        }
        if(isinCheck(turn,{...positions})){
            setGameOver(turn);
            return;
        } else {
            setCheck(null);
        } 
        if(selectedLocation!==null){
            const type = positions[selectedLocation].getType();
            if(positions[id]!==undefined && turn===positions[id].getColor()){
                setSelectedLocation(id);
            } else {

                if(type==='king'){
                    if(positions[selectedLocation].moved===false){
                        let castling_positions = positions[selectedLocation].checkCastling(id,selectedLocation,{...positions});
                        if(castling_positions.rookPos===null || castling_positions.newRookPos===null){
                            //play two turns
                            playMove(1,selectedLocation,id,null);
                            playMove(1,castling_positions.newRookPos,castling_positions.rookPos,null);
                        }
                    }
                   return;
                }

                let flag = positions[selectedLocation].checkValidMove(id,selectedLocation,{...positions},turn,initialTurn);
                if(flag!==0){
                    if(type==='king' || type==='rook'){
                        positions[selectedLocation].setMoved();
                    }
                    if(type==='pawn'){
                        positions[selectedLocation].promote(turn,initialTurn,id)
                    }
                } 
                
                let piece = positions[id]===undefined ? null : positions[id];
                playMove(flag,selectedLocation,id,piece===null ? piece : piece.getId());
                setTurn(initialTurn==='white' ? 'black' : 'white');
                checkGameOver(turn)

                if(flag!==0 && gameWithAI===false){
                    socket.emit("move",{
                        move : [selectedLocation,id,initialTurn,piece===null ? piece : piece.getId()],
                        flag : flag,
                        room : game._id
                    })
                }

            }
        } else {
            if(positions[id]!==undefined && turn===positions[id].getColor()){
                setSelectedLocation(id);
            }
        }
    }  

    const getFromAI = async ()=>{
        if(gameOver!==null){
            return;
        }
        
        try {
            if(turn!==initialTurn){
                if(isinCheck(turn,{...positions})){
                    setGameOver(turn);
                    return;
                } else {
                    setCheck(null);
                } 
                getMovefromAI(
                    {
                        positions : getCompressedObject({...positions}),
                        turn : turn
                    },
                    token
                )
                .then(response=>{
                    let move = response.data.message;
                    playMove(1,move.selectedLocation,move.id,move.piece);
                    setTurn(initialTurn);
                    checkGameOver(turn)
                })
            }
        } catch (error) {
            window.alert(error)
            console.error(error)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    const registerSocketListeners = ()=>{
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
            socket.emit("join-room",{roomId : game._id});
            socket.on("move",function(args){
                if(initialTurn!==args.move[2]){
                    let selectedLocation = args.move[0];
                    let id = args.move[1]
                    playMove(args.flag,selectedLocation,id,args.move[3]);
                    setTurn(initialTurn);
                }
            })
            socket.on("disconnect", () =>console.log(socket.id));
            socket.on("undo",()=>undoHandler())
            socket.on("abandon",()=>quitGame())
        });

        window.addEventListener('beforeunload',()=>quitGame())
        
        return ()=>{
            socket.off("move",()=>console.log("move listener removed"))
            socket.off("undo",()=>console.log("undo listener removed"))
            socket.off("abandon",()=>console.log("abandon listener removed"))
            window.removeEventListener("beforeunload",null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }
   
    const getDependencyArray = ()=>{
        if(gameWithAI===false){
            return [gameOver]
        }
        return [gameOver,turn]
    }

    React.useEffect(()=>{
        if(gameOver!==null){
            setTimeout(()=>{
                quitGame(gameOver)
            },2000)
            return;
        }
        if(gameWithAI===false){
            registerSocketListeners();
        } else{
            getFromAI()
        }
    },getDependencyArray())
    
    const checkGameOver = (turn)=>{
        const isCheck = isinCheck(turn,{...positions});
        if(isCheck===true){
            setCheck(turn==='white' ? 'black' : 'white')
            const over = isCheckmated(turn,{...positions});
            if(over===true){
                setGameOver(turn);
            } 
        }else{
            setCheck(null)
        }
    }
   
    const undoHandler = ()=>{
        if(moves.length===0 || gameOver===true){
            return;
        }
        setSelectedLocation(null)
        let move = moves[moves.length-1];
        let selectedLocation = move[1];
        let id = move[0];
        setPositions(prevPositions=>
            {
               let piece = prevPositions[selectedLocation]
               if(piece.getType()==='pawn'){
                    piece.demote();
                }
               return {
                ...prevPositions,
                [id] : piece,
                [selectedLocation] : move[3]!==null ?  initialPositions.mappedObject[move[3]] : undefined
               }
            }
        );
        moves.pop();
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
                            positions[`${cell.row}+${cell.col}`]!==undefined  ?
                            <div id={`${cell.row}+${cell.col}`} style={{textAlign : 'center'}}>
                                <img 
                                     className="square-image"
                                     alt={`${cell.row}+${cell.col}`} 
                                     src={
                                        positions[`${cell.row}+${cell.col}`].getType()==='pawn' && 
                                        positions[`${cell.row}+${cell.col}`].is_promoted===true  ?
                                        positions[`${cell.row}+${cell.col}`].promotion.getImage() : positions[`${cell.row}+${cell.col}`].getImage()
                                    }
                                />
                            </div> : null
                        }
                    </div>}
                )
            }
        </div>
        
    }

    const displayMessage = ()=>{
        if(gameOver!==null){
            return (
                gameOver==='ab' ?
                <h4 style={{color : 'brown'}}>{`Game abandoned`}</h4>
                : <h4 style={{color : gameOver}}>{`${gameOver} wins!!`}</h4>
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
    
    const getUserInfo = (check)=>{
        if((user_id===game.participant1._id)===check){
            return {...game.participant1};
        }
        return {...game.participant2};
    }

    return (
        <div className="container">
        <div className="left-pane">
            <div style={styles.info}>
                <h3>{getUserInfo(false).userName}</h3>
                { turn!==initialTurn ? <h5>Playing...</h5> : null }
            </div>
            { getBoard().map((row,index)=>getRowRendering(row,index)) }
            <div style={styles.info}>
                <h3>{getUserInfo(true).userName}</h3>
                { turn===initialTurn ? <h5>Playing...</h5>: null }
            </div>
        </div>
        <div className="right-pane">
            <div style={styles.timer}>
                <div><Timer quitGame={quitGame} turn={turn}/></div>
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
                                src = {initialPositions.mappedObject[move[3]].getImage()}
                                alt={'move'}/>
                            <p> captured</p>
                        </div>
                        )}
                    </div> 
                ))}
            </div>
            <div className="actions">
                <div style={styles.undo} onClick={()=>{
                    undoHandler()
                    if(gameWithAI===true)
                        undoHandler()
                    else
                        socket.emit("undo",{room : game._id});
                }}>Undo</div>
                <div style={styles.abandon} onClick={()=>setGameOver('ab')}>Abandon</div>
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