import { ReactP5Wrapper } from "@p5-wrapper/react";
import React, { useEffect, useState } from "react";
import axios from "axios";  
  
const cell = { w: 100, h: 100 }
const borderWidth = 8

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
    }

    const drawDiamond = ({ coords, left, top, text, color }) => {
      let minX = 999, minY = 999
      coords.forEach(coord => {
        if(coord.x < minX) minX = coord.x
        if(coord.y < minY) minY = coord.y
      })
      console.log({ minX, minY})
      console.log(cell.w * minX )
      const x = left +  minX * cell.w + borderWidth
      const y = top + minY * cell.h + borderWidth
      console.log({ x,y })

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
      p5.rect(-10, -10, 20, 20)    
      p5.fill(255)
      p5.rotate(p5.radians(-45))   
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.text(text, 0, 0)
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

      
      // console.log({ tPadding, lPadding }) 
      const { tPadding, lPadding } = getPadding({ width, height, rows })
      console.log(`board`)
      console.log({ tPadding, lPadding})
      for(let i = 0; i < rows.length; i ++) {
        for(let j = 0; j < rows[i].length; j ++) {
          if(rows[i][j]) {
            p5.rect(lPadding + (j * cell.w) , tPadding + (i * cell.h), cell.w, cell.h  )
          }
        }
      }
      
      
    }

    const createRegions = ({width, height, rows, regions}) => {
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
          drawCell({color, x, y, w, h, neighbors})

        })
        drawDiamond({ coords, left: lPadding, top: tPadding, text: val, color })
      })

    }

    const createDice = ({ dice }) => {
      // console.log({ dice })
      // const cell = Math.min(width / (cols + 2), height / (rows + 2))

      // const squares = dice.length * 2


      // p5.line(0, offsetTop, width, offsetTop)
      // p5.textAlign(p5.CENTER)
      // p5.text('Dice', width / 2, offsetTop + 30)

      // createGrid({ offsetTop, width, height: 300, rows, cols, isVisible: true })
      // dice.forEach(die => {

      // })
    }

    let rotation = 0;
  
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
      console.log(props.data)
      if(dice && regions && rows ) {
        createBoard({ width, height: height - 300, rows})
        createRegions({width, height: height - 300, rows, regions})
        createDice({ dice })
      }
      // if (props.rotation) {
      //   rotation = (props.rotation * Math.PI) / 180;
      // }
    };

  
    p5.draw = () => {
      // p5.background(256,256,256);
      // console.log(p5)
      
      // p5.normalMaterial();
      // p5.noStroke();
      // p5.push();
      // p5.rotateY(rotation);
      // p5.box(100);
      // p5.pop();
    };
  }
  
const Pfive = () => {
    const [data, setData] = useState({});
  
    useEffect(() => {
      const request = async() => {
        const res = await axios.get('http://localhost:9001/mothafuckin-api/pips?difficulty=easy')

        // const res = await axios.get('http://localhost:9001/mothafuckin-api/pips?id=107')
        const d = res.data
        if(d) {
          const gameData = { dice: JSON.parse(d.dice), regions: JSON.parse(d.regions), rows: JSON.parse(d.rows) }
          console.log({ gameData})
          setData(gameData)
        }

        return res
      }

      const ok = request()

    }, []);
  
    return <ReactP5Wrapper sketch={sketch} data={data} />;
  }

  export default Pfive