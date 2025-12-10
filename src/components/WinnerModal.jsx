import { useEffect, useState } from 'react';


const WinnerModal = ({ time, style, newPuzzle }) => {
    return (
        <div className="absolute top-0 left-0" style={style}>
            <div className="relative" style={{top: '50%', left: '50%', transform: `translate(-50%, -50%)` }}>
                <div>Winner!!</div>
                <div>Finished in {time}</div>
                <button className="border b-1" onClick={newPuzzle}>New puzzle</button>
            </div>
        </div>
        
    );
}

export default WinnerModal;
