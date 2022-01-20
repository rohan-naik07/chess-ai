import React from "react";
import image from './pieces/ChessPiecesArray.png';
import Game from './game'
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

const Auth = ()=>{
    const [inputData,setInputData] = React.useState({
        name : '',
        initialTurn : ''
    });
    const [display,setDisplay] = React.useState(0);
    const onSubmit = (event)=>{
        event.preventDefault();
        if(inputData.name==='' || inputData.initialTurn===''){
            return;
        }
        setDisplay(1);
    }
    
    if(display===1){
        return <Game initialTurn={inputData.initialTurn} name={inputData.name} setDisplay={setDisplay}/>
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
                    placeholder='Enter Your Name' 
                    name='name'
                    style={styles.textField} 
                    value={inputData.name}
                    onChange={(event)=>setInputData({
                        ...inputData,
                        name : event.target.value
                    })}/>
            </div>
            <br/>
            <h4>Select your Side</h4>
            <div style={{
                ...styles.temp,
                justifyContent : 'center',
                display : 'flex'
            }}>
                <div style={styles.temp}> 
                    <button style={{
                         margin:10,
                         padding:10,
                         borderRadius : 10,
                         backgroundColor: inputData.initialTurn==='white' ?  'yellow'  : 'white',
                         color:'black'
                    }} 
                        onClick={()=>setInputData({
                            ...inputData,
                            initialTurn : 'white'
                        })}>White</button>
                </div>
                <div style={styles.temp}> 
                    <button style={{
                        margin:10,
                        padding:10,
                        borderRadius : 10,
                        backgroundColor: inputData.initialTurn==='black' ? 'yellow'  : 'black',
                        color:'white'
                    }} 
                        onClick={()=>setInputData({
                            ...inputData,
                            initialTurn : 'black'
                        })}>Black</button>
                </div>    
            </div>
            <div style={styles.temp}> <button style={styles.sendButton} onClick={(e)=>onSubmit(e)}>Play</button></div>  
        </div>
    );
}

export default Auth;