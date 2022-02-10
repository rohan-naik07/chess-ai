import axios from "axios"
const BASE_URL = 'http://localhost:7000'
export const LOGIN_URL = `${BASE_URL}/users/login`
export const REGISTER_URL = `${BASE_URL}/users/register`
export const MARK_ONLINE_URL = `${BASE_URL}/users/online/`
export const MARK_OFFLINE_URL = `${BASE_URL}/users/offline/`
export const GET_ONLINE_USERS_URL = `${BASE_URL}/users/online`
export const GET_GAME_URL = `${BASE_URL}/game`
export const GET_AI_URL = `${BASE_URL}/game/ai`
export const GAME_BASE_URL = `${BASE_URL}/game/`
export const getFromServer = async (
    url,
    body,
    method,
    token
)=>{
    let response;
    switch(method){
        case 'GET' :
            response = await axios.get(url,{
                data:body,
                auth : token
            });
            break;
        case 'PUT' :
            response = await axios.put(url,{
                data:body,
                auth : token
            });
            break;
        case 'POST' :
            response = await axios.post(url,{
                data:body,
                auth : token
            });
            break;
        case 'DELETE' :
            response = await axios.delete(url,{
                data:body,
                auth : token
            });
            break;
    }
    return response;
}


