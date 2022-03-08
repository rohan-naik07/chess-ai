import jwtDecode from 'jwt-decode';
import React from 'react';
import { LoadingComponent } from './loading';
import { getGameId,getUsers } from "./tools/urls";

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
    AIlistItem : {
        display : 'flex',
        alignItems : 'center',
        borderRadius : 10,
        backgroundColor : 'brown',
        textAlign : 'center',
        padding:5,
        justifyContent : 'space-between',
        marginTop : 10,
        color : 'white'
    },
    button : {
        borderRadius : 10,
        backgroundColor : 'yellow',
        padding : 10,
        color : 'black',
        fontSize : 10
    },
    turn : {
        display:'flex',
        overflow:'hidden',
        borderRadius:10,
        border: 'solid #000',
        borderWidth: '1px'
    }
}

const Dialog = props =>{
    const {onlineUsers,setOnlineUsers} = props
    const token = localStorage.getItem('token')
    const user_id = jwtDecode(token)._id;
    const [url,setUrl] = React.useState(null);
    const [user,setUser] = React.useState(null);
    const [query,setQuery] = React.useState("");
    const [loading,setLoading] = React.useState(false);
    const [turn,setTurn] = React.useState(null);

    const onSubmit = async ()=>{
        if(token===null){
            return;
        }
        if(turn===null){
            return;
        }
        setLoading(true)
        const game = {
            "participant2" : user.userName==='AI' ? null : user._id ,
            "initialTurn" : turn,
        }
        try {
            setLoading(false)
            const response = await getGameId(game,token);
            setUrl(`http://localhost:3000/game/${response.data.message}`)
        } catch (error) {
            setLoading(false)
            console.log(error)
            window.alert("Failed to fetch game id")
        }
    }

    const onChangeText = (event)=>{
        event.preventDefault();
        setQuery(event.target.value)
        if(event.target.value===''){
            setOnlineUsers(onlineUsers);
            return;
        }
        setOnlineUsers(
            onlineUsers.filter(
                user=>user.userName.toLowerCase().includes(event.target.value.toLowerCase())
            )
        )
    }

    const onRefresh = ()=>{
        getUsers(token).then(
            response=>{
                let users = response.data.message;
                setOnlineUsers(users.filter(user=>user._id!==user_id));
            }
        ).catch (error=>{
            console.log(error)
            window.alert("Failed to fetch users on refresh")
        })
    }


    return (
        <div style={styles.root}>
            <div style={styles.header}>
                <div><h3>Find users</h3></div>
                <button style={styles.button} onClick={onRefresh}>Refresh</button>
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
                        <div style={users.userName==='AI' ? styles.AIlistItem : styles.listItem} key={users._id}>
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
                            <div style={styles.turn}>
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
            {
                url===null ? null :(
                    loading===false  ?
                    <div>
                        <h5>Share the below link</h5>
                        <br/>
                        <div style={styles.link}>
                            <h5>{url}</h5>
                            <button style={styles.refresh} onClick={()=>navigator.clipboard.writeText(url)}>Copy</button>
                        </div>
                    </div> : <LoadingComponent message={'Creating a new game....'}/>
                )
            }
        </div>
    )
}

export default Dialog;