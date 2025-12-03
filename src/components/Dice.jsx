import { motion } from "motion/react"
import { Drag } from './Drag'
import Pip from './Pip'

const Dice = ({ dice, height, width, parent }) => {
    console.log({ parent })
    // return ( 
        
    // )
    return (
        <div className="flex flex-wrap justify-center items-center space-between" style={{height, width}}>
            {dice.map((die, index) => {
                console.log(die)
                return (
                    <Drag>
                        <div className="flex justify-center  border b-1" style={{width: 200, height: 100}}>
                            <Pip first={true} val={die.val[0]} />
                            <Pip first={false} val={die.val[1]} />
                        </div>
                    </Drag>
                )
            })}
        </div>
    )
}

export default Dice