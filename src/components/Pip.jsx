import { motion } from "motion/react"
import { Drag } from './Drag'
import zero from '../assets/0.png'
import one from '../assets/1.png'
import two from '../assets/2.png'
import three from '../assets/3.png'
import fo from '../assets/4.png'
import five from '../assets/5.png'
import six from '../assets/6.png'

const Pip = ({ first, val }) => {
    console.log({ val })
    // return ( 
        
    // )

    const map = {
        0: zero,
        1: one,
        2: two,
        3: three,
        4: fo,
        5: five,
        6: six
    }
    console.log(val)

    return (
        <div className={`flex flex-wrap justify-center items-center ${first ? `border-r-1` : ``}`} >
            <img className="select-none pointer-events-none p-5" src={map[val]} />
        </div>
    )
}

export default Pip