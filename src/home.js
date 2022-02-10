import jwtDecode from "jwt-decode";
import React from "react";
import { useNavigate } from "react-router";
import Dialog from "./dialog";
import image from './pieces/ChessPiecesArray.png';
import { GAME_BASE_URL, getFromServer } from "./tools/urls";

const styles = {
    top : {
        display : 'flex',
        justifyContent : 'space-between',
        padding : 20,
        textAlign : 'center',
        alignItems : 'center',
    },
    left : {

    },
    right : {

    }
}

const Home = (props)=>{
    const [userGames,setUserGames] = React.useState([]);
    const [showDialog,setShowDialog] = React.useState(false);
    const {token,setToken} = props
    const history = useNavigate()

    const renderGame = (game)=>(
        <div>
            
        </div>
    )
    
    const onLogout = ()=>{
        setToken(null);
        localStorage.removeItem('token')
        history('/')
    }
    React.useEffect(()=>{
        const id = jwtDecode(token)._id
        getFromServer(GAME_BASE_URL + id,null,'GET',token).then(response=>{
            console.log(response)
            if(response.status!==200){
                window.alert(response.data.message)
            }
            if(response.error===true){
                window.alert(response.data.message)
            }
            setUserGames(response.data.message)
        }).catch (error=>{
            window.alert(error)
        })
    },[])
    
    return (
        <div className="home-root">
            <div style={styles.top}>
                <div><h2>Chess.ai</h2></div>
                <div><button onClick={onLogout}>Logout</button></div>
            </div>
            <div className="home-sub-root">
                <div style={styles.left}>
                    <div><img width='200px' 
                        height='100px' 
                        alt={`home-image`} 
                        src={image}
                    /></div>
                    {
                        showDialog===false ? 
                        <React.Fragment>
                            <div><button onClick={()=>setShowDialog(true)}>Play with Friend</button></div>
                            <div><button>Play with AI</button></div>
                        </React.Fragment> : 
                        <Dialog setShowDialog={setShowDialog} showDialog={showDialog}/>
                    }
                </div>
                <div style={styles.right}>
                    {userGames.map(game=>renderGame(game))}
                </div>
            </div>
        </div>
    )
}


export default Home;