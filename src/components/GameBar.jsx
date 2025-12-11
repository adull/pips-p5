import { useEffect, useState } from 'react';
import { bak } from '../helpers/img';
import WinnerModal from './WinnerModal'


const GameBar = ({ style, isSolved, setMode, newPuzzle }) => {
    const [time, setTime] = useState(0)

    const formatSeconds = seconds => {
        if (isNaN(seconds) || seconds < 0) return "-1";
      
        let secondTime = Math.floor(seconds);
        let minuteTime = Math.floor(secondTime / 60);
      
        secondTime %= 60;
        minuteTime %= 60;
      
        return (
          `${minuteTime.toString().padStart(2, "0")}:${secondTime.toString().padStart(2, "0")}`
        );
    };


    useEffect(() => {
        
        const interval = setInterval(() => {
            if(!isSolved) {
                setTime(prev => prev + 1)
            }
        }, 1000)


        return () => clearInterval(interval);
    }, [isSolved])

    const newPuzzleResetTime = () => {
        setTime(0)
        newPuzzle()
    }

    return (
        <>
            <div className="flex" style={{ width: style.width }}>
                <div className="container mx-auto p-6" style={{ width: style.width, height: '50px'}}>
                    <img src={bak} className="cursor-pointer w-30" onClick={() => setMode('home')} /> 
                </div>
                <div>{formatSeconds(time)}</div>
                <button onClick={newPuzzleResetTime}>new puz</button>
            </div>
            {isSolved ? <WinnerModal time={formatSeconds(time)} style={style} newPuzzle={newPuzzleResetTime} /> : <></>}
        </>
        
    );
}

export default GameBar;
