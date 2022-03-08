import jwtDecode from "jwt-decode";
import React from "react";
import { Navigate,useNavigate,useParams } from "react-router";
import Game from "./game";
import {Loading} from "./loading";
import { getGame } from "./tools/urls";

const GameWrapper = (props) =>{
    const {token} = props;
    const {gameId} = useParams();
    const history = useNavigate();
    const [error,setError] = React.useState(false)
    const [game,setGame] = React.useState({});
    const [loading,setLoading] = React.useState(true);
    const [gameWithAI,setgameWithAI] = React.useState(false);

    React.useEffect(()=>{
        if(token==null){
            history('/');
            return;
        }
        getGame(gameId,token)
        .then(response=>{
            const user_id = jwtDecode(token)._id
            if(
                user_id===response.data.message.participant1._id ||
                user_id===response.data.message.participant2._id
            ){
                setGame({...response.data.message})
                if(response.data.message.participant2.userName==='AI'){
                    setgameWithAI(true);
                }
            } else{
                setError(true)
            }
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            window.alert(error)
            console.log(error)
            setError(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    if(loading===true){
        return <Loading message={'Setting up game...'}/>
    }

    if(error===true){
        return <Navigate to='/home'/>
    }

    return <Game game={game} 
                token={token} 
                history={history} 
                gameWithAI={gameWithAI}/>
}

export default GameWrapper;