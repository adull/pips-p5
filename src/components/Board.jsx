import { useEffect, useRef, useState } from "react";
import Cell from './Cell'
import Region from './Region'
import { getCellSize, setCellSize } from '../const'

// import createBoard 

const Board = ({ regions, rows }) => {
    const boardRef = useRef()

    const [cells, setCells] = useState([])

    const createCells = ({size, rows}) => {
        
        if(size.w && size.h && rows.length ) {
            
            /* BELOW IS NEEDED BUT NOT RIGHT NOW */
            // let cellSize = getCellSize()
            // if(size.h / rows.length + 2 < cellSize.h ) {
            //     //resize
            //     const newH = size.h / rows.length + 2
            //     setCellSize(newH)
            // }
            
        }
        // const rows = rows.length
        // const cols = rows[0]?.length
        return []
    }


    
    useEffect(() => {
        // console.log(boardRef.current)
        const size = { w: boardRef.current.clientWidth, h: boardRef.current.clientHeight }
        // const boardSize = boardRef.current
        setCells(createCells({ size, rows }))
        // setRegions(createRegions(boardRef, regions))
    }, [regions, rows])
    return (
        <div className="border b-1 flex justify-center items-center" style={{ height: window.innerHeight - 500}} ref={boardRef}>
            <div className="cells bg-red-500">
            {cells.map((cell, index) => {
                return <Cell key={index} cell={cell} />    
            })}
            </div>
        { regions.map((region, index) => {
            return <Region key={index} region={region} />
        })}
        </div>

    );
}

export default Board;
