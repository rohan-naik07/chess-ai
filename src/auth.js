import React from "react";
import image from './pieces/ChessPiecesArray.png';
import { registerUser, loginUser } from "./tools/urls";
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router";

const styles = {
    root : {
        position : 'fixed',
        display :'flex',
        flexDirection : 'column',
        justifyContent :'center', 
        textAlign : 'center',
        width : '100%',
        height:'100%',
        backgroundColor : 'brown'
    },
    temp : {
        textAlign : 'center'
    },
    textField : {
        padding:10,
        borderRadius : 10,
    },
    sendButton : {
        margin:10,
        padding:10,
        borderRadius : 10,
        width : '100px',
        backgroundColor:'yellow',
        color:'black'
    },
    text : {color:'white',textAlign:'center'}
}

const Auth = (props)=>{
    const {token,setToken} = props
    const [inputData,setInputData] = React.useState({
        userName : '',
        password : '',
        confirm_password : ''
    });
    const [isSignUp,setSignUp] = React.useState(false);
    const history = useNavigate();

    const onSubmit = async (event)=>{
        event.preventDefault();
        if(inputData.userName==='' || inputData.password===''){
            window.alert("Please put all the required values")
            return;
        }
        let data = {
            userName: inputData.userName,
            password : inputData.password
        }
        if(isSignUp===true){
            if(inputData.password!==inputData.confirm_password){
                window.alert("Passwords do not match")
                return;
            }
            try {
                const response = await registerUser(data)
                if(response.data.token===undefined){
                    throw new Error(response.data.message)
                }
                localStorage.setItem('token',response.data.token)
                setToken(response.data.token)
                history('/home')
            } catch (error) {
                window.alert(error)
            }
        } else {
            try {
                const response = await loginUser(data)
                if(response.data.token===undefined){
                    throw new Error(response.data.message)
                }
                console.log(response)
                localStorage.setItem('token',response.data.token)
                setToken(response.data.token)
                history('/home')
            } catch (error) {
                window.alert(error)
            }
        }
    }

    const onClickh5 = ()=>setSignUp(!isSignUp)
    
    if(token){
        return <Navigate to='/home'/>
    }

    return (
        <div style={styles.root}>
            <div><img width='250px' 
                height='150px' 
                alt={`array`} 
                src={image}
            /></div>
            <div style={styles.temp}><h1 style={styles.text}>Chess.ai</h1></div>
            <br/>
            <br/>
            <div style={styles.temp}>
                <input type='text' 
                    placeholder='Enter User Name' 
                    name='name'
                    style={styles.textField} 
                    value={inputData.userName}
                    onChange={(event)=>setInputData({
                        ...inputData,
                        userName : event.target.value
                    })}/>
            </div>
            <br/>
            <div style={styles.temp}>
                <input type='password' 
                    placeholder='Enter Password' 
                    name='password'
                    style={styles.textField} 
                    value={inputData.password}
                    onChange={(event)=>setInputData({
                        ...inputData,
                        password : event.target.value
                    })}/>
            </div>
            <br/>
            { isSignUp===true ? (
                <div style={styles.temp}>
                    <input type='password' 
                        placeholder='Reenter Password' 
                        name='confirm_password'
                        style={styles.textField} 
                        value={inputData.confirm_password}
                        onChange={(event)=>setInputData({
                            ...inputData,
                            confirm_password : event.target.value
                        })}/>
                </div>
            ) : null }
            <br/>
            <div style={styles.temp}> 
                <button style={styles.sendButton} onClick={(e)=>onSubmit(e)}>{ isSignUp===true ? 'Sign Up' : 'Login'}</button>
            </div>
            <br/>
            <div onClick={()=>onClickh5()}>
                <h5 style={styles.text}>{ isSignUp===true ? 'Sign In if already registered' : 'Create an account'}</h5>
            </div>  
        </div>
    );
}

export default Auth;