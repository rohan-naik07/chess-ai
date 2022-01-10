import React, { useState, useRef, useEffect } from "react";


const Timer = ({
    setDisplay,
    setGameOver,
    turn
})=>{
    const Ref = useRef(null);
    const [timer,setTimer] = useState('05 : 00');
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total,minutes, seconds
        };
    }
  
  
    const startTimer = (e) => {
        let { total, minutes, seconds } 
                    = getTimeRemaining(e);
        if(minutes===0 && seconds===0){
            setGameOver(true)
            setDisplay(0);
            return;
        }

        if (total >= 0) {
  
            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the begining of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ' : '
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }
    const stopTimer = (e) => {
  
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next    
        setTimer('05 : 00');
  
        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }
  
    const getDeadTime = () => {
        let deadline = new Date();
  
        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setMinutes(deadline.getMinutes() + 5);
        return deadline;
    }
  
    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible
  
    useEffect(() => {
        stopTimer(getDeadTime());
    }, [turn]);

    return (
        <div><h2>{timer}</h2></div>
    )
}

export default Timer;