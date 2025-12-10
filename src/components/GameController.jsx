import { useState } from 'react'

import Home from './Home'
import Instructions from './Instructions'
import GameBar from './GameBar'

const GameController = ({ style, isSolved, setIsSolved, newPuzzle }) => {
    const [mode, setMode] = useState('home')

    const modeMap = {
        'home': Home,
        'instructions': Instructions,
        'game': GameBar
    }

    const ActiveComponent = modeMap[mode]
    return (
        <>
            <ActiveComponent style={style} isSolved={isSolved} setIsSolved={setIsSolved} 
                             setMode={setMode} newPuzzle={newPuzzle} 
            />
        </>
    )
}

export default GameController;
