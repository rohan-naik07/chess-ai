import axios from "axios"
const { io } = require("socket.io-client");
const BASE_URL = 'http://localhost:7000'
export const LOGIN_URL = `${BASE_URL}/users/login`
export const REGISTER_URL = `${BASE_URL}/users/register`
export const GET_USERS_URL = `${BASE_URL}/users/`
export const GET_GAME_URL = `${BASE_URL}/game/`
export const GET_AI_URL = `${BASE_URL}/game/ai`
export const GAME_BASE_URL = `${BASE_URL}/game/user/`
const getHeader = (token)=>{
    return token ? {
        "Content-Type": "application/json",
        authorization : "Bearer " + token
    } : {
        "Content-Type": "application/json",
    }
}
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
                data: body,
                headers : getHeader(token)
            });
            break;
        case 'PUT' :
            response = await axios.put(url,{
                data:body,
                headers : getHeader(token)
            });
            break;
        case 'POST' :
            response = await axios.post(url,{
                data:body,
                headers : getHeader(token)
            });
            break;
        case 'DELETE' :
            response = await axios.delete(url,{
                data:body,
                headers : getHeader(token)
            });
            break;
    }
    return response;
}


export const getSocket = ()=>{
    return io(BASE_URL)
}