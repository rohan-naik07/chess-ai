import axios from "axios"
const { io } = require("socket.io-client");

const BASE_URL = 'https://frozen-bastion-55265.herokuapp.com'
const LOGIN_URL = `${BASE_URL}/users/login`
const REGISTER_URL = `${BASE_URL}/users/register`
const GET_USERS_URL = `${BASE_URL}/users/`
const GET_GAME_URL = `${BASE_URL}/game/`
const GET_AI_URL = `${BASE_URL}/game/ai`
const GAME_BASE_URL = `${BASE_URL}/game/user/`

export const loginUser = (data)=>{
    return new Promise((resolve,reject)=>{
        axios.post(LOGIN_URL,data).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                if(response.error===true){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const registerUser = (data)=>{
    return new Promise((resolve,reject)=>{
        axios.post(REGISTER_URL,data).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                if(response.error===true){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const getUserGames = (_id,token)=>{
    return new Promise((resolve,reject)=>{
        let config = {
            headers: { 
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        };
        axios.get(GAME_BASE_URL + _id,config).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const getUsers = (token)=>{
    return new Promise((resolve,reject)=>{
        let config = {
            headers: { 
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        };
        axios.get(GET_USERS_URL,config).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const getGameId = (game,token)=>{
    return new Promise((resolve,reject)=>{
        let config = {
            headers: { 
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            params : {
                'body' : JSON.stringify(game)
            }
        };
        axios.get(GET_GAME_URL,config).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const getGame = (gameId,token)=>{
    return new Promise((resolve,reject)=>{
        let config = {
            headers: { 
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        };
        axios.get(GET_GAME_URL+gameId,config).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const updateGameMoves = (gameId,moves,token)=>{
    return new Promise((resolve,reject)=>{
        console.log(token)
        let config = {
            headers: { 
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        };
        axios.put(GET_GAME_URL+gameId,moves,config).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const deleteGame = (gameId,token)=>{
    return new Promise((resolve,reject)=>{
        let config = {
            headers: { 
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        };
        axios.delete(GET_GAME_URL+gameId,config).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}

export const getMovefromAI = (data,token)=>{
    return new Promise((resolve,reject)=>{
        let config = {
            headers: { 
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        };
        axios.post(GET_AI_URL,data,config).then(
            response=>{
                if(response.status!==200){
                    reject(response.data.message)
                }
                resolve(response)
            }
        ).catch(
            error=>{
                reject(error)
            }
        )
    })
}


export const getSocket = ()=>{
    return io(BASE_URL)
}