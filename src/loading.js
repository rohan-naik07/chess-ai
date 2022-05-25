import React from 'react';

const styles = {
    root : {
        display : 'flex',
        width : '100%',
        marginTop : '20%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    comp : {
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        textAlign : 'center'
    }
}

export const Loading = ({message})=>(
    <div style={styles.root}>
        <div className="loader"></div>
        <div style={{width:'20px'}}/>
        <h2>{message}</h2>
    </div>
)

export const LoadingComponent = ({message})=>(
    <div style={styles.comp}>
        <div className="loader-small"></div>
        <div style={{width:'20px'}}/>
        <h3>{message}</h3>
    </div>
)