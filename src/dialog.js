import React from 'react';
import { getFromServer,GET_GAME_URL,GET_USERS_URL } from "./tools/urls";
import jwt_decode from "jwt-decode";

const styles = {
    root : {
       margin : 10,
       borderRadius : 10
    },
    header : {
        display : 'flex',
        backgroundColor : 'brown',
        borderRadius : 10,
        alignItems : 'center',
        textAlign : 'center',
        overflow : 'hidden',
        padding:5,
        justifyContent : 'space-between'
    },
    refresh : {
        padding : 5,
        borderRadius : 10,
        backgroundColor : 'brown',
        color : 'white'
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
        backgroundColor : '#c8cfca',
        border: 'solid #000',
        borderWidth: '1px',
        color : 'black',
        alignItems : 'center',
        textAlign : 'center',
        padding:5,
        justifyContent : 'space-between'
    },
    selected : {
        alignItems : 'center',
        textAlign : 'center',
        padding:5
    },
    play : {
        padding : 5,
        borderRadius : 10,
        backgroundColor : 'brown'
    },
    list : {
        maxHeight : '150px',
        overflow : 'auto'
    },
    listItem : {
        display : 'flex',
        alignItems : 'center',
        borderRadius : 10,
        backgroundColor : '#c8cfca',
        textAlign : 'center',
        padding:5,
        justifyContent : 'space-between',
        marginTop : 10
    },
    button : {
        borderRadius : 10,
        backgroundColor : 'yellow',
        padding : 10,
        color : 'black',
        fontSize : 10
    }
}

const Dialog = props =>{
    const {setShowDialog,showDialog} = props
    const token = localStorage.getItem('token')
    const [onlineUsers,setOnlineUsers] = React.useState([]);
    const [url,setUrl] = React.useState(null);
    const [user,setUser] = React.useState(null);
    const [query,setQuery] = React.useState("");
    const [turn,setTurn] = React.useState(null);

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
        const game = {
            "participant2" : user._id,
            "initialTurn" : turn,
        }
        try {
            const response = await getFromServer(
                GET_GAME_URL,
                game,
                'GET',
                token,
                true
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
                <div><h3>Find users</h3></div>
                <div>
                    <button style={styles.button} onClick={onRefresh}>Refresh</button>
                    <span style={{width : 10,color : 'white',margin:5}} onClick={()=>setShowDialog(false)}>&times;</span>
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
                        <div style={styles.listItem} key={users._id}>
                            <h4>{users.userName}</h4>
                            <div><button style={styles.refresh} onClick={()=>setUser(users)}>Select</button></div>
                        </div>
                        )
                    }
                    </div> : 
                    <div style={styles.selected}>
                        <h4>{`You vs ${user.userName}`}</h4>
                        <div>
                            <p>Choose your turn...after discussion with your opponent ofcourse :)</p>
                            <br/>
                            <div style={{
                                display:'flex',
                                overflow:'hidden',
                                borderRadius:10,
                                border: 'solid #000',
                                borderWidth: '1px'
                            }}>
                                <div style={{
                                    backgroundColor : turn==='white' ? 'grey' : 'white',
                                    width : '100%',
                                    padding : 10,
                                    fontSize:10
                                }} onClick={()=>setTurn('white')}>White</div>
                                <div style={{
                                    backgroundColor : turn==='black' ? 'grey' : 'black',
                                    width : '100%',
                                    color : 'white',
                                    padding : 10,
                                    fontSize : 10
                                }}onClick={()=>setTurn('black')}>Black</div>
                            </div>
                        </div>
                        <div style={{display:'flex',margin:10,justifyContent:'space-around'}}>
                            <button style={styles.refresh} onClick={onSubmit}>Play</button>
                            <button style={styles.refresh} onClick={()=>setUser(null)}>Cancel</button>
                        </div>
                    </div>
                }
            </div>
            {url!==null ?
                <div>
                    <h5>Share the below link</h5>
                    <br/>
                    <div style={styles.link}>
                        <h5>{url}</h5>
                        <button style={styles.refresh} onClick={()=>navigator.clipboard.writeText(url)}>Copy</button>
                    </div>
                </div> : null}
        </div>
    )
}
//http://localhost:3000/game/620647edc56dfcf217243051
export default Dialog;