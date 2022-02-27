import axios from "axios"
const { io } = require("socket.io-client");
const BASE_URL = 'http://localhost:7000'
export const LOGIN_URL = `${BASE_URL}/users/login`
export const REGISTER_URL = `${BASE_URL}/users/register`
export const GET_USERS_URL = `${BASE_URL}/users/`
export const GET_GAME_URL = `${BASE_URL}/game/`
export const GET_AI_URL = `${BASE_URL}/game/ai`
export const GAME_BASE_URL = `${BASE_URL}/game/user/`

export const getFromServer = async (
    url,
    body,
    method,
    token,
    putinParams
)=>{
    let response;
    let config;
    switch(method){
        case 'GET' :
            if(putinParams===true){
                config = {
                    headers: { authorization: `Bearer ${token}`,'Content-Type': 'application/json' },
                    params : {
                        'body' : JSON.stringify(body)
                    }
                };
                response = await axios.get(url,config);
            } else {
                config = {
                    data : body,
                    headers: { authorization: `Bearer ${token}`,'Content-Type': 'application/json' }
                };
                response = await axios.get(url,config);
            }
            break;
        case 'PUT' :
            config = {
                data : body,
                headers: { authorization: `Bearer ${token}`,'Content-Type': 'application/x-www-form-urlencoded' }
            };
            response = await axios.put(url,config);
            break;
        case 'POST' :
            config = {
                headers: { authorization: `Bearer ${token}` }
            };
            response = await axios.post(url,body,config);
            break;
        case 'DELETE' :
            config = {
                data : body,
                headers: { authorization: `Bearer ${token}`,'Content-Type': 'application/x-www-form-urlencoded' }
            };
            response = await axios.delete(url,config);
            break;
        default : break;
    }
    return response;
}


export const getSocket = ()=>{
    return io(BASE_URL)
}