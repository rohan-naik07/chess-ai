import jwtDecode from "jwt-decode";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import Dialog from "./dialog";
import image from './pieces/ChessPiecesArray.png';
import { getUserGames,deleteGame } from "./tools/urls";

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
        color : 'white',
        margin : 10,
        fontSize : 20
    }
}

const Home = (props)=>{
    const [userGames,setUserGames] = React.useState([]);
    const [showDialog,setShowDialog] = React.useState(false);
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
            padding:10,
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
                <h6>{`played on ${game.played_on}`}</h6>
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
                justifyContent : 'space-between',
                padding:5
            }}>
                <div><button style={styles.button} onClick={()=>deleteGameHandler(game._id)}>Delete Game</button></div>
                <div><button style={styles.button}>View Game</button></div>
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
        getUserGames(id,token).then(response=>{
            console.log(response)
            setUserGames(response.data.message)
        }).catch(error=>{
            console.error(error)
            window.alert("Failed to fetch user games")
        })
    },[])

    if(token===null){
        return <Navigate to = '/'/>
    }
    
    return (
        <div className="home-root">
            <div style={styles.top}>
                <div><h2>Chess.ai</h2></div>
                <div><button style={styles.button} onClick={onLogout}>Logout</button></div>
            </div>
            <div className="home-sub-root">
                <div style={styles.left}>
                    <div><img width='300px' 
                        height='150px' 
                        alt={`home-image`} 
                        src={image}
                    /></div>
                    {
                        showDialog===false ? 
                        <React.Fragment>
                            <div><button style={styles.button} onClick={()=>setShowDialog(true)}>Play!</button></div>
                        </React.Fragment> : 
                        <Dialog setShowDialog={setShowDialog} showDialog={showDialog}/>
                    }
                </div>
                <div style={styles.right}>
                    <div style={styles.button}><h3>Welcome User</h3></div>
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