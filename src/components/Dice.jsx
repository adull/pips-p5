import { motion } from "motion/react"
import { Drag } from './Drag'
import Pip from './Pip'
import { useRef } from "react"

const Dice = ({ dice, height, width, parent }) => {
    console.log({ dice })
    // return ( 
        
    // )
    // console.log(Array.from(dice, x => null))
    const diceRefs = useRef(Array.from(dice, _ => null))
    console.log(diceRefs)
    const mouseUp = (e) => {
        console.log(e)
        console.log(diceRefs)
    }

    const rotate = (target) => {
        console.log(target)
        // dice.find()
    }
    return (
        <div className="flex flex-wrap justify-center items-center space-between" style={{height, width}}>
            {dice.map((die, index) => {
                console.log(diceRefs)
                return (
                    <Drag dragConstraints={parent} onDragEnd={mouseUp} rotate={rotate}>
                        <div className="flex justify-center bg-white ml-2 border b-1"
                             ref={el => {diceRefs.current[index] = el}}
                             style={{width: 200, height: 100}}
                        >
                            <Pip first={true} val={die[0]} />
                            <Pip first={false} val={die[1]} />
                        </div>
                    </Drag>
                )
            })}
        </div>
    )
}

export default Dice