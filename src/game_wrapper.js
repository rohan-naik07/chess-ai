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
        getFromServer(GET_GAME_URL+gameId,null,'GET',token)
        .then(response=>{
            if(
                gameId===response.data.participant1 ||
                gameId===response.data.participant2
            ){
                setGame({...response.data})
                socket.on("disconnect", () => {
                    console.log(socket.id); // undefined
                });
            } else{
                history('/');
            }
        })
        .catch(error=>{
            window.alert(error)
            history('/');
        })
        return ()=>{
            socket.disconnect()
        }
    },[])
    return <Game game={game} socket={socket}/>
}

export default GameWrapper;