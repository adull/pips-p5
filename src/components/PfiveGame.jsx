import { ReactP5Wrapper } from "@p5-wrapper/react";
import React, { useEffect, useRef, useState } from "react";
import Dice from "./Dice"
import GameController from "./GameController"
import axios from "axios";  

import { getCellSize, updateCellSize, setOffset, setRegions, pushToBoard, clearBoard } from "../helpers"
  
let cell = getCellSize()
// const dicePositions = []
const borderWidth = 8

const getPadding = ({ width, height, rows }) => {
  const tPadding = (height - cell.h * rows.length) / 2
  const lPadding = (width - cell.w * rows[0].length) / 2

  return { tPadding, lPadding }
}

  /**
   * @param {import("p5")} p5
   */
  const boardSketch = (p5) => {
    

    const createBoard = ({ width, height, rows}) => {
      clearBoard()
      const { tPadding, lPadding } = getPadding({ width, height, rows })
      for(let i = 0; i < rows.length; i ++) {
        for(let j = 0; j < rows[i].length; j ++) {
          if(rows[i][j]) {
            p5.fill(256,256,256,128)
            p5.rect(lPadding + (j * cell.w) , tPadding + (i * cell.h), cell.w, cell.h  )
            const square = {
              id: `${i}-${j}`,
              x: lPadding + (j * cell.w),
              y: tPadding + (i * cell.h),
              w: cell.w,
              h: cell.h,
              val: ''
            }
            pushToBoard(square)

          }
        }
      }
    }
  
    p5.setup = () => {
      p5.createCanvas(1, 1);
      p5.background(200);
    }
  
    p5.updateWithProps = props => {
      const {w, h} = props.canvasSize
      const setCellSize = props.setCellSize
      const { rows } = props.data
      if(rows) {
        
        if(w  > 0 && h > 0) {
          // find if rows or cols are bigger
          const minViewDim = Math.min(w,h)
          const maxBoardDim = Math.max(rows.length, rows[0].length)
          if((maxBoardDim + 2) * cell.w > minViewDim) {
            const newSize = minViewDim / (maxBoardDim + 2)
            updateCellSize(newSize)
            setCellSize({w: newSize, h: newSize})
          }
          p5.resizeCanvas(w,h)
          const { width, height } = p5
          p5.background(200);
          createBoard({ width, height: height - 300, rows})  
        }
      }
      // const { width, height } = p5
      
    };
  }
  
const regionSketch = (p5) => {
  const drawCell = ({ color, x, y, w, h, neighbors }) => {
    p5.push()
    p5.stroke(color)
    // p5.strokeCap(p5.SQUARE)
    p5.strokeWeight(borderWidth)
    
  
    // draw big lines
    if (!neighbors.top)    p5.line(x, y, x + w, y)
    if (!neighbors.right)  p5.line(x + w, y, x + w, y + h)
    if (!neighbors.bottom) p5.line(x, y + h, x + w, y + h)
    if (!neighbors.left)   p5.line(x, y, x, y + h)

    if (neighbors.top) {
      p5.line(x, y, x, y - borderWidth)
      p5.line(x + w, y, x + w, y - borderWidth)
    } 
    if (neighbors.right) {
      p5.line(x + w, y, x + w + borderWidth, y)
      p5.line(x + w, y + h, x + w + borderWidth, y + h)
    } 
    if(neighbors.bottom) {
      p5.line(x, y + h, x, y + h + borderWidth)
      p5.line(x + w, y + h, x + w, y + h + borderWidth)
    }
    if (neighbors.left) {
      p5.line(x, y, x - borderWidth, y)
      p5.line(x, y + h, x - borderWidth, y + h)
    }   
    p5.pop()
  }
  
  

  const getColor = ({ type }) => {
    const c = type[0]
  
    if (c === "<") return [160, 133, 113] // desaturated caramel
    if (c === ">") return [70, 110, 140]  // softened navy-blue
    if (c === "=") return [110, 150, 170] // visible blue-teal
    if (c === "≠") return [120, 170, 140] // gentle emerald green
    return [200, 120, 90] // low-sat orange-red
  }

  const createRegions = ({ width, height, rows, regions }) => {
    const { tPadding, lPadding } = getPadding({ width, height, rows })
    regions.forEach(region => {
      const { coordinates: coords = region.coordinates, computedValue: val = region.computedValue } = region
      const color = getColor({ type: val })

      coords.forEach(coord => {
        const neighbors = {
          top: coords.some(i => i.x === coord.x && i.y === coord.y - 1),
          right: coords.some(i => i.x === coord.x + 1 && i.y === coord.y),
          bottom: coords.some(i => i.x === coord.x && i.y === coord.y + 1),
          left: coords.some(i => i.x === coord.x - 1 && i.y === coord.y),
        }

        
        const x = lPadding + cell.w * coord.x + borderWidth
        const y = tPadding + (cell.h * coord.y) + borderWidth
        const w = cell.w - borderWidth * 2
        const h = cell.h - borderWidth * 2
        drawCell({ color, x, y, w, h, neighbors })

      })
      // drawDiamond({ coords, left: lPadding, top: tPadding, text: val, color })
    })

  } 

  const drawDiamond = ({ coords, left, top, text, color }) => {
    let minX = 999, minY = 999
    coords.forEach(coord => {
      if(coord.x < minX) minX = coord.x
      if(coord.y < minY) minY = coord.y
    })
    const x = left +  minX * cell.w + borderWidth
    const y = top + minY * cell.h + borderWidth

    p5.push()              
    p5.translate(x , y ) 
    p5.rotate(p5.radians(45))    
    const darker = [
      color[0] * 0.8,
      color[1] * 0.8,
      color[2] * 0.8
    ]
    p5.stroke(darker)
    p5.strokeWeight(2)

    p5.fill(color)
    p5.rect(-10, -10, 30, 30)    
    p5.fill(255)
    p5.rotate(p5.radians(-45))   
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.textSize(18)
    p5.text(text, 0, 9)
    
    p5.pop()              
  }

  const drawDiamonds = ({ width, height, rows, regions }) => {
    const { tPadding, lPadding } = getPadding({ width, height, rows })
    regions.forEach(region => {
      const { coordinates: coords = region.coordinates, computedValue: val = region.computedValue } = region
      const color = getColor({ type: val })
      drawDiamond({ coords, left: lPadding, top: tPadding, text: val, color })
    })

  }

  p5.setup = () => {
    p5.createCanvas(1000, 1000);
  }

  p5.updateWithProps = (props) => {
    const {w, h} = props.canvasSize
    if(w  > 0 && h > 0) {
      p5.resizeCanvas(w,h)
    }
    const { rows, regions } = props.data
    const { width, height } = p5
    if(rows && regions) {
      createRegions({ width, height: height - 300, rows, regions })
      drawDiamonds({ width, height: height - 300, rows, regions })
    }

  }
}

const PfiveGame = () => {
    const [data, setData] = useState({});
    const wrapperRef = useRef()
    const [dicePositions, setDicePositions] = useState([])
    const [canvasSize, setCanvasSize] = useState({ w: -1, h: -1})
    const [cellSize, setCellSize] = useState(getCellSize())
    const [isSolved, setIsSolved] = useState(false)
    const [gameCount, setGameCount] = useState(1)

    if(wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setOffset({ x: rect.x, y: rect.y })
    }

    const request = async() => {
      setIsSolved(false)
      
      const res = await axios.get('http://localhost:9001/mothafuckin-api/pips')
      const d = res.data
      if(d) {
        const dice = JSON.parse(d.dice)
        const gameData = { dice, regions: JSON.parse(d.regions), rows: JSON.parse(d.rows) }
        setData(gameData)
        setRegions(JSON.parse(d.regions))
        setDicePositions(dice.map((item, index) => { return { index, val: item, rotation: 0 } }))
      }

      return res
    }

    
  
    useEffect(() => {
      if(wrapperRef.current) {
        const w = wrapperRef.current.clientWidth
        const bounds = wrapperRef.current.getBoundingClientRect()
        const h = window.innerHeight - bounds.top - 20
        setCanvasSize({w,h})
        
      }
      request()

    }, [])

    const newPuzzle = () => {
      setGameCount(prev => prev + 1)
      request()
    }
  
    return (
        <div className="relative" ref={wrapperRef}>
          
          <div className="pointer-events-none relative top-0 left-0">
            <ReactP5Wrapper sketch={boardSketch} data={data} canvasSize={canvasSize} setCellSize={setCellSize}/>
          </div>
          <div className="absolute top-0 left-0" style={{ zIndex: 999 }}>
            <GameController style={{width: canvasSize?.w, height: canvasSize?.h}} 
                            isSolved={isSolved} setIsSolved={setIsSolved} newPuzzle={newPuzzle} />
          </div>
          <div className="pointer-events-none absolute top-0 left-0" style={{zIndex: 99}}>
            <ReactP5Wrapper sketch={regionSketch} data={data} canvasSize={canvasSize}  />
          </div>
          <div className="absolute bottom-0" style={{height: 300}}>
            <Dice dice={dicePositions} setDice={setDicePositions} gameCount={gameCount} setIsSolved={setIsSolved} 
                  cellSize={cellSize} height={300} width={canvasSize.w} parent={wrapperRef} 
            />
          </div>
          
        </div>
    )
  }

  export default PfiveGame