import jwtDecode from "jwt-decode";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import Dialog from "./dialog";
import {Loading} from "./loading";
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
    no_games : {
        padding : 10,
        borderRadius : 10,
        margin:10,
        backgroundColor : '#c8cfca',
        textAlign : 'center'
    },
    stats : {
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding:5
    },
    initial_turn : {
        margin:5,
        padding:5,
        borderRadius : 10,
        border: 'solid #000',
        borderWidth: '1px',
        textAlign : "center"
    },
    result : {
        margin:5,
        padding:5,
        borderRadius : 10,
        border: 'solid #000',
        borderWidth: '1px',
        textAlign : 'center'
    },
    game_item_root : {
        margin:10,
        backgroundColor : '#c8cfca',
        overflow:'hidden',
        borderRadius : 10
    },
    game_item_header : {
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding:5,
        backgroundColor:'brown',
        color:'white'
    },
    game_item_body : {
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding:5
    },
    game_item_foot : {
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between'
    }
}

const Home = (props)=>{
    const [userGames,setUserGames] = React.useState([]);
    const [onlineUsers,setOnlineUsers] = React.useState([]);
    const [userName,setUserName] = React.useState("")
    const [loading,setLoading] = React.useState(true);
    const {token,setToken} = props
    const user_id = jwtDecode(token)._id
    const history = useNavigate()

    const deleteGameHandler = (gameId)=>{
        deleteGame(gameId,token).then(
            ()=>{
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
            ...styles.initial_turn,
            backgroundColor : initialTurn,
            color : initialTurn==='white' ? 'black' : 'white',
        }}>Initial Turn</div>
    )

    const getResultDiv = (result)=>{
        if(result==='ab'){
            return (
                <div style={{
                    ...styles.result,
                    backgroundColor : 'brown',
                    color : 'white',
                }}>Abandoned</div>
            )
        }
        return (
            <div style={{
                ...styles.result,
                backgroundColor : result,
                color : result==='white' ? 'black' : 'white'
            }}>Winner</div>
        )
    }
    

    const renderGame = (game)=>(
        <div key={game._id}  style={styles.game_item_root}>
            <div style={styles.game_item_header}>
                <h3>{
                    game.participant1._id===user_id ? `You VS ${game.participant2.userName}` : `${game.participant2.userName} VS You`
                }</h3>
                <div style={{width:'50px'}}/>
                <h6>{game.played_on}</h6>
            </div>
            <div style={styles.game_item_body}>
                <React.Fragment>{getInitialTurnDiv(game.initialTurn)}</React.Fragment>
                <React.Fragment>{getResultDiv(game.result)}</React.Fragment>
            </div>
            <div style={styles.game_item_foot}>
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
        setLoading(true)
        getUserGames(id,token).then(response=>setUserGames(response.data.message)).then(
            ()=>{
                getUsers(token).then(
                    response=>{
                        setLoading(false)
                        let users = response.data.message;
                        setOnlineUsers(users.filter(user=>user._id!==user_id));
                        setUserName(users.filter(user=>user._id===user_id)[0].userName)
                    }
                ).catch (error=>{
                    setLoading(false)
                    console.log(error)
                    window.alert("Failed to fetch users")
                })
            }
        ).catch(error=>{
            setLoading(false)
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
            <div style={styles.stats}>
                <div style={{...styles.statsButton,backgroundColor:'grey'}}>{`${total} played`}</div>
                <div style={{...styles.statsButton,backgroundColor:'green'}}>{`${wonGames} won`}</div>
                <div style={{...styles.statsButton,backgroundColor:'red'}}>{`${lostGames} lost`}</div>
            </div>
        )
    }

    if(loading===true){
        return <Loading message={'Loading...'}/>
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
                    <Dialog onlineUsers={onlineUsers}/>
                </div>
                <div style={styles.right}>
                    <div style={{...styles.button,backgroundColor : '#c8cfca',color : 'black'}}>
                        <h3>{`${userName}`}</h3>
                        {getStats()}
                    </div>
                    {
                        userGames.length===0 ? 
                        <div style={styles.no_games}>No games played as of now</div> 
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