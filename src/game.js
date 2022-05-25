import React from "react";
import { 
    getCompressedObject,
    getInitialPositions
} from "./initials";
import {isinCheck,isCheckmated} from './util';
import './App.css'
import Timer from "./timer";
import jwtDecode from "jwt-decode";
import {  getMovefromAI,getSocket,updateGameMoves } from "./tools/urls";

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

const Game = ({game,token,history,gameWithAI})=>{
    const user_id = jwtDecode(token)._id;
    const socket = gameWithAI===false ? getSocket() : null;
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

    const quitGame = (result,emit)=>{
        let resultData={
            moves : moves,
            result : result
        }
        if(result==='ab'){
            if(gameWithAI===false && emit===true)
                socket.emit("abandon",{room : game._id,result:result});
            history('/home');
        } else {
            updateGameMoves(game._id,resultData,token).then(
                response=>{
                    if(gameWithAI===false && emit===true)
                        socket.emit("abandon",{room : game._id,result:result});
                    history('/home');
                }
            ).catch(
                error=>{
                    console.log(error)
                    window.alert("failed to update game")
                }
            )
        }  
    }
       
    const playMove = (
        flag,
        selectedLocation,
        id,
        piece,
        isPromoted,
        isCastled,
        rookPos,
        newRookPos
    )=>{
        if(flag!==0){
            setSelectedLocation(null);                
            moves.push({
                from : selectedLocation,
                to : id,
                turn : turn,
                captured : typeof(flag)==='string' ? flag : piece,
                isPromoted : isPromoted,
                isCastled : isCastled,
                rookPos : rookPos,
                newRookPos : newRookPos
            }) 
            setMoves(moves);
            setPositions(prevPositions=>
                {
                   let piece = prevPositions[selectedLocation]
                   if(isCastled===true){
                        return {
                            ...prevPositions,
                            [selectedLocation] : undefined,
                            [id] : piece,
                            [rookPos] : undefined,
                            [newRookPos] : prevPositions[rookPos]
                       }
                   }
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
                let isCastled = false;
                let rookPos = null;
                let newRookPos =  null;
                if(type==='king'){
                    if(positions[selectedLocation].moved===false){
                        let castling_positions = positions[selectedLocation].checkCastling(id,selectedLocation,{...positions});
                        if(castling_positions.rookPos!==null && castling_positions.newRookPos!==null){
                            isCastled = true
                            rookPos = castling_positions.rookPos;
                            newRookPos = castling_positions.newRookPos;
                            playMove(1,selectedLocation,id,null,false,true,rookPos,newRookPos);
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

                if(typeof(flag)==='string'){
                    piece = positions[flag];
                }
                if(flag!==0){
                    playMove(
                        flag,
                        selectedLocation,
                        id,
                        piece===null ? piece : piece.getId(),
                        positions[selectedLocation].is_promoted,
                        false,
                        null,
                        null
                    );
                    setTurn(initialTurn==='white' ? 'black' : 'white');
                    checkGameOver(turn)
                }
                
                if(flag!==0 && gameWithAI===false){
                    socket.emit("move",{
                        move : {
                            from : selectedLocation,
                            to : id,
                            turn : initialTurn,
                            captured : piece===null ? piece : piece.getId(),
                            isPromoted : positions[selectedLocation].is_promoted,
                            isCastled : isCastled,
                            newRookPos : newRookPos,
                            rookPos : rookPos
                        },
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
                    playMove(1,move.selectedLocation,move.id,move.piece,false,false,null,null);
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

    const onEmitMoveHandler = (args)=>{
        if(initialTurn!==args.move.turn){
            let selectedLocation = args.move.from;
            let id = args.move.to
            let turn = args.move.turn
            let flag = args.flag
            moves.push(args.move) 
            setPositions(prevPositions=>
                {
                   let piece = prevPositions[selectedLocation]
                   const type = prevPositions[selectedLocation].getType();
                   if(type==='king' || type==='rook'){
                        piece.setMoved();
                    }
                    if(type==='pawn'){
                        piece.promote(turn,initialTurn,id)
                    }
                    if(typeof(flag)==='string'){
                        return {
                            ...prevPositions,
                            [selectedLocation] : undefined,
                            [id] : piece,
                            [flag] : undefined
                        }
                    }
                    if(args.move.isCastled===true){
                        moves.push({
                            from : args.move.rookPos,
                            to : args.move.newRookPos,
                            turn : args.move.turn,
                            captured : null,
                            isCastled : true,
                            isPromoted : false,
                            newRookPos : args.move.newRookPos,
                            rookPos : args.move.rookPos
                        })
                        return {
                            ...prevPositions,
                            [selectedLocation] : undefined,
                            [id] : piece,
                            [args.move.rookPos] : undefined,
                            [args.move.newRookPos] : prevPositions[args.move.rookPos]
                        }
                    }
                   return {
                    ...prevPositions,
                    [selectedLocation] : undefined,
                    [id] : piece
                   }
                }
            );
            setMoves(moves);
            setTurn(initialTurn);
            checkGameOver(turn)
        }
    }

    const registerSocketListeners = ()=>{
        socket.on("connect", () => {
            socket.emit("join-room",{roomId : game._id});
            socket.on("move",(args)=>onEmitMoveHandler(args))
            socket.on("disconnect", () =>console.log(socket.id));
            socket.on("undo",()=>undoHandler())
            socket.on("abandon",(args)=>quitGame(args.result,false))
        });

        window.addEventListener('beforeunload',()=>quitGame('ab',true))
        
        return ()=>{
            socket.disconnect()
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
                quitGame(gameOver,true)
            },1000)
            return;
        }
        if(gameWithAI===false){
            registerSocketListeners();
        } else{
            getFromAI()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        let selectedLocation = move.to;
        let id = move.from;
        setPositions(prevPositions=>
            {
               let piece = prevPositions[selectedLocation]
               if(piece.getType()==='pawn'){
                    piece.demote();
                }
                if(move.isCastled===true){
                    return {
                        ...prevPositions,
                        [id] : piece,
                        [selectedLocation] : move.captured!==null ?  initialPositions.mappedObject[move.captured] : undefined,
                        [move.newRookPos] : undefined,
                        [move.rookPos] : prevPositions[move.newRookPos]
                    }
                }
               return {
                ...prevPositions,
                [id] : piece,
                [selectedLocation] : move.captured!==null ?  initialPositions.mappedObject[move.captured] : undefined
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
                <div><Timer quitGame={()=>quitGame('ab',true)} turn={turn}/></div>
                <div style={{padding:10}}>{displayMessage()}</div>
            </div>
            <div style={styles.moveList}>
                {moves.map((move,index)=>(
                    <div style={styles.move} key={`${move.to}->${move.from}->${index}`}>
                        <div style={styles.moveItem}>
                            <div style={
                                {
                                    width:10,
                                    height:10,
                                    borderRadius : 50,
                                    margin : 5,
                                    backgroundColor : move.turn
                                }
                            }/>
                            <p>{`${move.from} -> ${move.to}`}</p>
                        </div>
                        <div>
                            <h5>{
                                move.isCastled===true ? "castled" : (move.isPromoted===true ? "promotion" : null)
                            }</h5>
                        </div>
                        {move.captured===null ? null : (
                            <div style={styles.destroyed_image}>
                            <img width='20px'
                                height={'20px'}
                                src = {initialPositions.mappedObject[move.captured].getImage()}
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
        maxHeight : '500px',
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