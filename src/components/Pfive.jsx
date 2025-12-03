import { ReactP5Wrapper } from "@p5-wrapper/react";
import React, { useEffect, useRef, useState } from "react";
import Board from './Board'
import Dice from './Dice'
import axios from "axios";  
  
const cell = { w: 100, h: 100 }
const dicePositions = []
const borderWidth = 8
const canvasSize = {w : 1000, h: 1000}

  /**
   * @param {import("p5")} p5
   */
  const sketch = (p5) => {
    const getPadding = ({ width, height, rows }) => {
      const tPadding = (height - cell.h * rows.length) / 8
      const lPadding = (width - cell.w * rows[0].length) / 2

      return { tPadding, lPadding }
    }

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

      // draw little connecting lines
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
      p5.b
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
    

    const getColor = ({ type }) => {
      const c = type[0]
    
      if (c === "<") return [160, 133, 113] // desaturated caramel
      if (c === ">") return [70, 110, 140]  // softened navy-blue
      if (c === "=") return [110, 150, 170] // visible blue-teal
      if (c === "≠") return [120, 170, 140] // gentle emerald green
      return [200, 120, 90] // low-sat orange-red
    }
    

    const createBoard = ({ width, height, rows}) => {
      const { tPadding, lPadding } = getPadding({ width, height, rows })
      for(let i = 0; i < rows.length; i ++) {
        for(let j = 0; j < rows[i].length; j ++) {
          if(rows[i][j]) {
            p5.rect(lPadding + (j * cell.w) , tPadding + (i * cell.h), cell.w, cell.h  )
          }
        }
      }
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
        drawDiamond({ coords, left: lPadding, top: tPadding, text: val, color })
      })

    }

    // const createDice = ({ width, offsetTop, dice }) => {
    //   console.log(p5.props)
      
    //   p5.push()
    //   p5.line(0, offsetTop, p5.width, offsetTop)
      

    //   // call beefedUpDice to make it easier to work with
    //   beefedUpDice(dice).forEach(die => {
    //     // console.log(die)
    //     die.position = { x: die.position.x, y: die.position.y, w: cell.w * 2, h: cell.h } 
    //     // push to global arr so lifecycle can use it
    //     dicePositions.push(die)
    //     p5.rect(die.position.x, die.position.y, cell.w * 2, cell.h)
    //     p5.text(die.val[0], die.position.x + 10, die.position.y + 10)
    //     p5.text(die.val[1], die.position.x + cell.w + 10, die.position.y + 10)
    //   })
    // }
  
    p5.setup = () => {
      p5.strokeCap(p5.SQUARE)
      p5.createCanvas(1000, 1000);
      p5.background(200);
      // p5.line(30, 20, 85, 20);

      
    }
  
    p5.updateWithProps = props => {
      // console.log(props)
      const { dice, regions, rows } = props.data
      const { width, height } = p5
      console.log(props)
      if(dice && regions && rows ) {
        // props.beefedUpDice(dice)
        createBoard({ width, height: height - 300, rows})
        createRegions({ width, height: height - 300, rows, regions })
        // beefedUpDice(dice)
        // createDice({ width, offsetTop: height- 300,dice })
      }
      // if (props.rotation) {
      //   rotation = (props.rotation * Math.PI) / 180;
      // }
    };

    // p5.mouse
    p5.mousePressed = () => {
      // detect click
      console.log(dicePositions)
      dicePositions.forEach(die => {
        if (
          p5.mouseX >= die.position.x &&
          p5.mouseX <= die.position.x + die.position.w &&
          p5.mouseY >= die.position.y &&
          p5.mouseY <= die.position.y + die.position.h
        ) {
          // cell.onClick()
          // console.log(die)
          console.log(die)
          die.awake = true
        }
      })
      
    }
    p5.mouseDragged = (e) => {
      const awakeDie = dicePositions.find(item => item.awake === true)
      if(awakeDie) {
        console.log(e)
        // console.log(awakeDie)
        p5.rect(e.offsetX, e.offsetY, cell.w * 2, cell.h)
      }
    }
    
    p5.mouseReleased = () => {
      console.log(`released`)
      const awakeDie = dicePositions.find(item => item.awake === true)
      console.log(awakeDie)
      // go to bed
      if(awakeDie) {
        awakeDie.awake = false
      }
    }

  
    p5.mouseMoved = (e) => {
      
    };
  }
  
const Pfive = () => {
    const [data, setData] = useState({});
    const dicePos = useRef([])

    const beefedUpDice = (dice) => {
      const count = dice.length
      const rows = [dice.slice(0,Math.ceil(count / 2)), dice.slice(Math.ceil(count / 2),count)]
      const paddingX = 100
      const paddingY = 50
      const beefy = []
      rows.forEach((row, rIndex) => {
        row.forEach((die, dIndex) => {
          beefy.push({ 
            id: `${rIndex}-${dIndex}`,
            val: die, 
            position: { 
              x: paddingX + (dIndex / (row.length + 1)) * canvasSize.w, 
              y: paddingY + (rIndex / (rows.length + 1)) * 300  
            },
            // awake is used to ignore dies that are inert - don't animate them in the onframe loop
            awake: false
          })
        })
      })
      return beefy
    }
  
    useEffect(() => {
      const request = async() => {
        const res = await axios.get('http://localhost:9001/mothafuckin-api/pips?difficulty=easy')

        // const res = await axios.get('http://localhost:9001/mothafuckin-api/pips?id=107')
        const d = res.data
        if(d) {
          const gameData = { dice: JSON.parse(d.dice), regions: JSON.parse(d.regions), rows: JSON.parse(d.rows) }
          // console.log({ gameData})
          dicePos.current = beefedUpDice(gameData.dice)
          setData(gameData)
        }

        return res
      }

      const ok = request()

    }, []);
  
    return (
    <>
    <Board regions={data.regions ? data.regions : []} rows={data.rows ? data.rows : []} />
    <Dice dice={data.dice ? data.dice : []} />
    </>
    )
  }

  export default Pfive