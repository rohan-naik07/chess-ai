import jwtDecode from "jwt-decode";
import React from "react";
import { useNavigate, useParams } from "react-router";
import Game from "./game";
import { getFromServer, getSocket, GET_GAME_URL } from "./tools/urls";

const GameWrapper = (props) =>{
    const socket = getSocket();
    const {token} = props;
    const {gameId} = useParams();
    const history = useNavigate();
    const [game,setGame] = React.useState({});
    console.log(gameId);
    React.useEffect(()=>{
        if(token==null){
            history('/');
            return;
        }
        getFromServer(GET_GAME_URL+gameId,null,'GET',token)
        .then(response=>{
            const user_id = jwtDecode(token)._id
            if(
                user_id===response.data.message.participant1 ||
                user_id===response.data.message.participant2
            ){
                setGame({...response.data.message})
            } else{
                history('/home');
            }
        })
        .catch(error=>{
            window.alert(error)
            history('/home');
        })
        return ()=>{
            socket.disconnect()
        }
    },[])
    return <Game game={game} socket={socket} token={token}/>
}

export default GameWrapper;