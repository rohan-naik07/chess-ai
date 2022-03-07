import React from "react";
import { getInitialPositions} from "./initials";
import {isinCheck,isCheckmated} from './util';
import './App.css'
import { useNavigate,Navigate } from "react-router";
import { getGame } from "./tools/urls";
import jwtDecode from "jwt-decode";
import { useSearchParams } from "react-router-dom";

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

const ViewGame = ({token})=>{
    const [searchParams, setSearchParams] = useSearchParams();
    let gameId = searchParams.get('gameId')
    let initialTurn = searchParams.get('initialTurn')
    const user_id = jwtDecode(token)._id;
    const initialPositions = getInitialPositions(initialTurn);
    const [positions,setPositions] = React.useState(initialPositions.positions);
    const [gameOver,setGameOver] = React.useState(null);
    const [check,setCheck] = React.useState(null);
    const [moveIndex,setMoveIndex] = React.useState(0);
    const [error,setError] = React.useState(false)
    const [game,setGame] = React.useState({});
    const [loading,setLoading] = React.useState(true);
    const history = useNavigate()

    const nextHandler = ()=>{
        if(moveIndex+1<game.moves.length){
            let move = game.moves[moveIndex+1];
            checkGameOver(move[2])
            playMove(move[0],move[1],null)
            setMoveIndex(moveIndex+1)
        }
    }

    const backHandler = ()=>{
        if(moveIndex-1>=0){
            let move = game.moves[moveIndex];
            checkGameOver(move[2])
            playMove(move[1],move[0],move[3])
            setMoveIndex(moveIndex-1)
        }
    }


    const quitGame = ()=>{
        history('/home');
    }
       
    const playMove = (selectedLocation,id,piece)=>{
        positions[id] = positions[selectedLocation]
        if(piece!==null){
            positions[selectedLocation] = initialPositions.mappedObject[piece]
        } else {
            delete positions[selectedLocation]
        }
        setPositions({...positions});
    }  

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

    React.useEffect(()=>{
        if(token==null){
            history('/');
            return;
        }
        getGame(gameId,token).then(response=>{
            let game = {...response.data.message}
            setGame(game)
            console.log(game.moves)
            setLoading(false)
            playMove(game.moves[0][0],game.moves[0][1],null)
        }).catch(error=>{
            setLoading(false)
            window.alert(error)
            console.log(error)
            setError(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    if(loading===true){
        return <div>Loading...</div>
    }

    if(error===true){
        return <Navigate to='/home'/>
    }

    const getRowRendering = (row,index)=>{
        return <div style={styles.rowRender} key={index}>
            {
                row.map(cell=>{
                    return <div id={`${cell.row}+${cell.col}`} key={`${cell.row}+${cell.col}`} 
                        style={{backgroundColor: cell.color}} 
                        className="square">
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
                <div/>
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
            </div>
            { getBoard().map((row,index)=>getRowRendering(row,index)) }
            <div style={styles.info}>
                <h3>{getUserInfo(true).userName}</h3>
            </div>
        </div>
        <div className="right-pane">
            <div style={styles.timer}>
                <div><h2>Game Viewer</h2></div>
                <div style={{padding:10}}>{displayMessage()}</div>
            </div>
            <div style={styles.moveList}>
                {game.moves.map((move,index)=>(
                    <div style={
                        {
                            ...styles.move,
                            backgroundColor : moveIndex===index ? 'grey' : '#c8cfca'
                        }
                    } key={`${move[0]}->${move[1]}->${index}`}>
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
                <div style={{
                    display : 'flex',
                    justifyContent : 'space-around',
                    alignItems : 'center'
                }}>
                    <div style={styles.undo} onClick={()=>backHandler()}>Back</div>
                    <div style={styles.undo} onClick={()=>nextHandler()}>Next</div>
                </div>
                <div style={styles.abandon} onClick={()=>quitGame()}>Exit</div>
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

export default ViewGame;