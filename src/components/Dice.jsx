import { motion } from "motion/react"
import { Drag } from './Drag'
import Pip from './Pip'
import { useEffect, useRef } from "react"
import { pushToOriginalDicePos } from '../helpers/dice'

const Dice = ({ dice, setDice, id, height, width, parent }) => {
    // console.log({ dice })
    // return ( 
        
    // )
    // console.log(Array.from(dice, x => null))
    const diceRefs = useRef(Array.from(dice, _ => null))
    // console.log(diceRefs)
    const mouseUp = (e, index) => {
        // console.log(e)
        // console.log(diceRefs)
        // console.log(diceRefs.current[index])
        console.log(dice[index])
        const item = diceRefs.current[index]
        console.log({item: item.getBoundingClientRect() })
        // const pos = {x: item.cl}
        
    }

    useEffect(() => {
        console.log({dice})
    }, [dice])

    const rotate = (e, index) => {
        setDice(prev => {
            return prev.map((item, i) => {
                if(i === index) {
                    const nextRotation = item.rotation + 1 % 4
                    return { ...item, rotation: nextRotation }
                }
                return item
            })
        })
    }

    const initRef = (el, index) => {
        diceRefs.current[index] = el
        if(el) {
            const rect =  el.getBoundingClientRect()
            pushToOriginalDicePos({ id: index, rect })
        }
    }
    return (
        <div className="flex flex-wrap justify-around items-center space-around flex-wrap" style={{height, width}}>
            {dice.map((die, index) => {
                console.log(die)
                const style = {
                    transform: `rotate(${die.rotation * 90}deg)`,
                    transformOrigin: `50px 50px 0px`,
                    left: die.rotation % 4 === 2 ? 100 : 0,
                    position: `relative`
                }
                return (
                    <div ref={el => { initRef(el, index) }} key={index}>
                    <Drag style={style} id={die.index} dragConstraints={parent} onDragEnd={(e) => mouseUp(e, index)} rotate={(e) => rotate(e, index)}>
                        <div className="flex justify-center bg-white border b-1"
                             style={{width: 200, height: 100}}
                        >
                            <Pip first={true} val={die.val[0]} />
                            <Pip first={false} val={die.val[1]} />
                        </div>
                    </Drag>
                    </div>
                )
            })}
        </div>
    )
}

export default Dice