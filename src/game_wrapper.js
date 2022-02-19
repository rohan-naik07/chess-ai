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
    const [loading,setLoading] = React.useState(true);

    React.useEffect(()=>{
        if(token==null){
            history('/');
            return;
        }
        getFromServer(GET_GAME_URL+gameId,null,'GET',token)
        .then(response=>{
            const user_id = jwtDecode(token)._id
            if(
                user_id===response.data.message.participant1._id ||
                user_id===response.data.message.participant2._id
            ){
                setGame({...response.data.message})
            } else{
                history('/home');
            }
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            window.alert(error)
            history('/home');
        })
        return ()=>{
            socket.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    if(loading===true){
        return <div>Loading...</div>
    }
    return <Game game={game} socket={socket} token={token} history={history}/>
}

export default GameWrapper;