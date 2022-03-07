import jwtDecode from "jwt-decode";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import Dialog from "./dialog";
import image from './pieces/ChessPiecesArray.png';
import { getUserGames,deleteGame,getUsers } from "./tools/urls";

const styles = {
    top : {
        display : 'flex',
        justifyContent : 'space-between',
        padding : 20,
        textAlign : 'center',
        alignItems : 'center',
    },
    left : {
        padding : 10,
        textAlign : 'center',
        alignItems : 'center',
        justifyContent : 'center',
        height:'100%'
    },
    right : {
        padding : 10,
        alignItems : 'center',
        justifyContent : 'center'
    },
    button : {
        borderRadius : 10,
        backgroundColor : 'brown',
        padding : 10,
        border: 'solid #000',
        borderWidth: '1px',
        color : 'white',
        margin : 10,
        fontSize : 20
    },
    statsButton : {
        borderRadius : 10,
        padding : 5,
        color : 'white',
        fontSize : 15
    },
}

const Home = (props)=>{
    const [userGames,setUserGames] = React.useState([]);
    const [onlineUsers,setOnlineUsers] = React.useState([]);
    const [userName,setUserName] = React.useState("")
    const {token,setToken} = props
    const user_id = jwtDecode(token)._id
    const history = useNavigate()

    const deleteGameHandler = (gameId)=>{
        deleteGame(gameId,token).then(
            response=>{
                console.log(response)
                setUserGames(userGames.filter(game=>game._id!==gameId))
            }
        ).catch(
            error=>{
                console.log(error);
                window.alert('Failed to delete game')
            }
        )
    }

    const getInitialTurnDiv = (initialTurn)=>(
        <div style={{
            margin:5,
            padding:5,
            borderRadius : 10,
            backgroundColor : initialTurn,
            color : initialTurn==='white' ? 'black' : 'white',
            border: 'solid #000',
            borderWidth: '1px',
            textAlign : "center"
        }}>Initial Turn</div>
    )

    const getResultDiv = (result)=>{
        if(result==='ab'){
            return (
                <div style={{
                    margin:5,
                    padding:5,
                    borderRadius : 10,
                    backgroundColor : 'brown',
                    color : 'white',
                    border: 'solid #000',
                    borderWidth: '1px',
                    textAlign : "center"
                }}>Abandoned</div>
            )
        }
        return (
            <div style={{
                margin:5,
                padding:5,
                borderRadius : 10,
                border: 'solid #000',
                borderWidth: '1px',
                backgroundColor : result,
                color : result==='white' ? 'black' : 'white',
                textAlign : "center"
            }}>Winner</div>
        )
    }
    

    const renderGame = (game)=>(
        <div key={game._id}  style={{
            margin:10,
            backgroundColor : '#c8cfca',
            overflow:'hidden',
            borderRadius : 10
        }}>
            <div style={{
                display : 'flex',
                alignItems : 'center',
                justifyContent : 'space-between',
                padding:5,
                backgroundColor:'brown',
                color:'white'
            }}>
                <h3>{
                    game.participant1._id===user_id ? 
                    `You VS ${game.participant2.userName}` : `${game.participant2.userName} VS You`
                }</h3>
                <div style={{width:'50px'}}/>
                <h6>{game.played_on}</h6>
            </div>
            <div style={{
                display : 'flex',
                alignItems : 'center',
                justifyContent : 'space-between',
                padding:5
            }}>
                <React.Fragment>{getInitialTurnDiv(game.initialTurn)}</React.Fragment>
                <React.Fragment>{getResultDiv(game.result)}</React.Fragment>
            </div>
            <div style={{
                display : 'flex',
                alignItems : 'center',
                justifyContent : 'space-between'
            }}>
                <div><button style={styles.button} onClick={()=>deleteGameHandler(game._id)}>Delete Game</button></div>
                <div><button style={styles.button} onClick={()=>history(`/view-game/?gameId=${game._id}&initialTurn=${game.initialTurn}`)}>View Game</button></div>
            </div>
        </div>
    )
    
    const onLogout = ()=>{
        setToken(null);
        localStorage.removeItem('token')
        history('/')
    }

    React.useEffect(()=>{
        const id = jwtDecode(token)._id
        getUserGames(id,token).then(response=>setUserGames(response.data.message)).then(
            ()=>{
                getUsers(token).then(
                    response=>{
                        let users = response.data.message;
                        setOnlineUsers(users.filter(user=>user._id!==user_id));
                        setUserName(users.filter(user=>user._id===user_id)[0].userName)
                    }
                ).catch (error=>{
                    console.log(error)
                    window.alert("Failed to fetch users")
                })
            }
        ).catch(error=>{
            console.error(error)
            window.alert("Failed to fetch user games")
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    if(token===null){
        return <Navigate to = '/'/>
    }

    const getStats = ()=>{
        let total = userGames.length
        let wonGames = userGames.filter(game=>(game.participant1._id===user_id && game.result===game.initialTurn)).length
        let lostGames = userGames.filter(
            game=>(
                game.participant1._id===user_id &&
                game.result!==game.initialTurn &&
                game.result!=='ab'
            )
        ).length
        
        return (
            <div style={{
                display : 'flex',
                alignItems : 'center',
                justifyContent : 'space-between',
                padding:5
            }}>
                <div style={{...styles.statsButton,backgroundColor:'grey'}}>{`${total} played`}</div>
                <div  style={{...styles.statsButton,backgroundColor:'green'}}>{`${wonGames} won`}</div>
                <div  style={{...styles.statsButton,backgroundColor:'red'}}>{`${lostGames} lost`}</div>
            </div>
        )
    }

    return (
        <div className="home-root">
            <div style={styles.top}>
                <div><h2>Chess.ai</h2></div>
                <div><button style={styles.button} onClick={onLogout}>Logout</button></div>
            </div>
            <div className="home-sub-root">
                <div style={styles.left}>
                    <img width='300px' 
                        height='150px' 
                        alt={`home-image-array`} 
                        src={image}/>
                    <Dialog onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers}/>
                </div>
                <div style={styles.right}>
                    <div style={{...styles.button,backgroundColor : '#c8cfca',color : 'black'}}>
                        <h3>{`${userName}`}</h3>
                        {getStats()}
                    </div>
                    {
                        userGames.length===0 ? 
                        <div style={{
                            padding : 10,
                            borderRadius : 10,
                            margin:10,
                            backgroundColor : '#c8cfca',
                            textAlign : 'center'
                        }}>
                            No games played as of now
                        </div> 
                        : <React.Fragment>
                            {userGames.map(game=>renderGame(game))}
                        </React.Fragment>
                    }
                </div>
            </div>
        </div>
    )
}


export default Home;