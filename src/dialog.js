import React from 'react';
import { GAME_BASE_URL, getFromServer,GET_GAME_URL,GET_USERS_URL } from "./tools/urls";
import jwt_decode from "jwt-decode";
import jwtDecode from 'jwt-decode';

const styles = {
    root : {
       margin : 10,
       borderRadius : 10
    },
    header : {
        display : 'flex',
        backgroundColor : 'brown',
        alignItems : 'center',
        textAlign : 'center',
        padding:5,
        justifyContent : 'space-between'
    },
    refresh : {
        padding : 5,
        borderRadius : 10,
        backgroundColor : 'brown'
    },
    users : {
       padding : 5 
    },
    temp : {
        textAlign : 'center'
    },
    textField : {
        padding:10,
        borderRadius : 10,
    },
    link : {
        display : 'flex',
        margin : 5,
        backgroundColor : 'grey',
        color : 'black',
        alignItems : 'center',
        textAlign : 'center',
        padding:5,
        justifyContent : 'space-between'
    },
    copy : {
        padding : 5,
        borderRadius : 10,
        backgroundColor : 'brown'
    },
    selected : {
        display : 'flex',
        alignItems : 'center',
        textAlign : 'center',
        padding:5,
        justifyContent : 'space-between'
    },
    play : {
        padding : 5,
        borderRadius : 10,
        backgroundColor : 'brown'
    }
}

const Dialog = props =>{
    const {setShowDialog,showDialog} = props
    const token = localStorage.getItem('token')
    const [onlineUsers,setOnlineUsers] = React.useState([]);
    const [url,setUrl] = React.useState(null);
    const [user,setUser] = React.useState(null);
    const [query,setQuery] = React.useState("");

    React.useEffect(()=>{
        console.log(showDialog)
        if(showDialog===true){
            getFromServer(GET_USERS_URL,null,'GET',token).then(response=>{
                console.log(response)
                if(response.status!==200){
                    window.alert(response.data.message)
                }
                if(response.error===true){
                    window.alert(response.data.message)
                }
                setOnlineUsers(response.data.message)
            }).catch (error=>{
                window.alert(error)
            })
        }
    },[showDialog])

    const onSubmit = async ()=>{
        if(token===null){
            return;
        }
        const date  = new Date()
        const game = {
            "participant1" : jwt_decode(token)._id,
            "participant2" : user._id,
            "played_on" : `${date.getDay()} ${date.getMonth()} ${date.getFullYear()}`,
            "moves" : [],
            "result" : "null"
        }
        try {
            const response = await getFromServer(
                GET_GAME_URL,
                game,
                'GET',
                token
            );
            if(response.status!==200){
                window.alert(response.data.message)
            }
            if(response.error===true){
                window.alert(response.data.message)
            }
            setUrl(`http://localhost:3000/game/${response.data.message}`)
        } catch (error) {
            window.alert(error)
        }
    }
    const onChangeText = (event)=>{
        event.preventDefault();
        setQuery(event.target.value)
        setOnlineUsers(
            onlineUsers.filter(
                user=>user.userName.toLowerCase().includes(event.target.value.toLowerCase())
            )
        )
    }

    const onRefresh = ()=>{
        getFromServer(GET_USERS_URL,null,'GET',token).then(response=>{
            console.log(response)
            if(response.status!==200){
                window.alert(response.data.message)
            }
            if(response.error===true){
                window.alert(response.data.message)
            }
            setOnlineUsers(response.data.message)
            console.log(response.data.message)
        }).catch (error=>{
            window.alert(error)
        })
    }

    return (
        <div style={styles.root}>
            <div style={styles.header}>
                <div><h3>Find online users</h3></div>
                <div style={styles.refresh}>
                    <button onClick={onRefresh}>Refresh</button>
                    <span onClick={()=>setShowDialog(false)}>&times;</span>
                </div>
            </div>
            <div style={styles.users}>
                <div style={styles.temp}>
                    <input type='search' 
                        placeholder='Enter User Name' 
                        name='user-name'
                        style={styles.textField} 
                        value={query}
                        onChange={onChangeText}/>
                </div>
                { user===null ? <div style={styles.list}>{
                    onlineUsers.map(users=>
                        <div style={styles.listItem}>
                            <h4>{users.userName}</h4>
                            <div style={styles.refresh}><button onClick={()=>setUser(users)}>Select</button></div>
                        </div>
                        )
                    }
                    </div> : 
                    <div style={styles.selected}>
                        <h4>{user.userName}</h4>
                        <div style={styles.play}>
                            <button onClick={onSubmit}>Play</button>
                        </div>
                        <div style={styles.refresh}>
                            <button onClick={()=>setUser(null)}>Cancel</button>
                        </div>
                    </div>
                }
            </div>
            {url!==null ?
                <div>
                    <h5>Share the below link</h5>
                    <br/>
                    <div style={styles.link}>
                        <h4>{url}</h4>
                        <div style={styles.copy}>
                            <button onClick={()=>navigator.clipboard.writeText(url)}>Copy</button>
                        </div>
                    </div>
                </div> : null}
        </div>
    )
}

export default Dialog;