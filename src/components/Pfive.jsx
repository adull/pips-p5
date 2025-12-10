import { useState } from "react";
import PfiveGame from "./PfiveGame";

const Pfive = () => {
    const [gameKey, setGameKey] = useState(0);
  
    const handleNewPuzzle = () => {
      setGameKey(k => k + 1);
    };
  
    return <PfiveGame key={gameKey} onNewPuzzle={handleNewPuzzle} />;
  };
  
export default Pfive