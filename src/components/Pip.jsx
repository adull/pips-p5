import { motion } from "motion/react"
import { Drag } from './Drag'
import Pip from './Pip'

const Dice = ({ first, val }) => {
    // console.log({ val })
    // return ( 
        
    // )
    return (
        <div className={`flex flex-wrap justify-center items-center ${first ? `border-r-1` : ``}`} >
            {val}
        </div>
    )
}

export default Dice