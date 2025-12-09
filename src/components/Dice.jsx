// import { motion } from "motion/react"
import { Drag } from './Drag'
import Pip from './Pip'
import { useEffect, useLayoutEffect, useRef } from "react"
import { pushToOriginalDicePos, addValToCell } from '../helpers'

const Dice = ({ dice, setDice, height, cellSize, width, parent }) => {
    console.log(cellSize)
    // const cellSize = getCellSize()
    const diceRefs = useRef(Array.from(dice, _ => null))

    const pushToBoard = (ids, die) => {
        const valOne = die.rotation % 4 < 2 ? die.val[0] : die.val[1]
        const valTwo = die.rotation % 4 <  2 ? die.val[1] : die.val[0]

        addValToCell(valOne, ids[0])
        addValToCell(valTwo, ids[1])

    }

    const rotate = (e, index) => {
        setDice(prev => {
            return prev.map((item, i) => {
                if(i === index) {
                    const nextRotation = item.rotation + 1
                    return { ...item, rotation: nextRotation }
                }
                return item
            })
        })
    }

    const initRef = (el, index) => {
        diceRefs.current[index] = el
        if(el) {
            // kind of a hack but it will render in 150ms i promise
            setTimeout(() => {
                const rect =  el.getBoundingClientRect()
                pushToOriginalDicePos({ id: index, rect })
            }, 500)
        }
    }

    return (
        <div className="flex flex-wrap justify-around items-center space-around flex-wrap" style={{height, width}}>
            {console.log(cellSize)}
            {dice.map((die, index) => {
                const style = {
                    transform: `rotate(${die.rotation * 90}deg)`,
                    transformOrigin: `${cellSize.w / 2}px ${cellSize.w / 2}px 0px`,
                    left: die.rotation % 4 === 2 ? cellSize.w : 0,
                    top: die.rotation % 4 === 3 ? cellSize.w : 0,
                    position: `relative`,
                    transition: '0.4s cubic-bezier(0.24, -0.9, 0.59, 1.44) all'
                }
                return (
                    <div ref={el => { initRef(el, index) }} key={index}>
                    <Drag style={style} id={die.index} dragConstraints={parent} pushToBoard={(ids) => pushToBoard(ids, die)} rotate={(e) => rotate(e, index)} vals={die.val}>
                        <div className="flex justify-center bg-white border b-1"
                             style={{width: cellSize.w * 2, height: cellSize.w}}
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