import React, { useEffect, useState, useRef, useContext } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { getBoard, getOffset, getValFromCell, addValToCell, getOriginalDicePosWithId, getRegions } from "../helpers";

export const Drag = ({ children, style, id, pushToBoard, rotate, dragConstraints, gameCount, setIsSolved }) => {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    console.log(`animate to 0,0`)
    animateTo(0,0)
  }, [gameCount])

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const actualPosRef = useRef()

  const dragStateRef = useRef({
    pointerId: null,
    startPointerX: 0,
    startPointerY: 0,
    startX: 0,
    startY: 0,
    isDragging: false,
    hasMoved: false,
    positionOnBoard: []
  });

  const animXRef = useRef(null);
  const animYRef = useRef(null);

  const animateTo = (targetX, targetY) => {
    if (animXRef.current) animXRef.current.stop();
    if (animYRef.current) animYRef.current.stop();

    animXRef.current = animate(x, targetX, {
      type: "spring",
      stiffness: 250,
      damping: 16,
      mass: 0.8,
    });

    animYRef.current = animate(y, targetY, {
      type: "spring",
      stiffness: 250,
      damping: 16,
      mass: 0.8,
    });
  };

  const handlePointerDown = (event) => {
    document.body.style.cursor = 'grabbing'

    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);

    dragStateRef.current = {
      ...dragStateRef.current,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: x.get(),
      startY: y.get(),
      isDragging: true,
      hasMoved: false
    };

    const toReset = dragStateRef.current.positionOnBoard
    toReset.forEach(id => {
      addValToCell('', id)
    })

    if (animXRef.current) animXRef.current.stop();
    if (animYRef.current) animYRef.current.stop();
  };

  const handlePointerMove = (event) => {
    const state = dragStateRef.current;
    if (!state.isDragging || state.pointerId !== event.pointerId) return;
    setIsDragging(true)

    const deltaX = event.clientX - state.startPointerX;
    const deltaY = event.clientY - state.startPointerY;

    const targetX = state.startX + deltaX;
    const targetY = state.startY + deltaY;

    dragStateRef.current = {
      ...dragStateRef.current,
      hasMoved: true
    };

    // spring chases pointer target in ANY direction
    animateTo(targetX, targetY);
  };

  const handlePointerUp = (event) => {
    document.body.style.cursor = 'grab'

    const state = dragStateRef.current;
    if (state.pointerId !== event.pointerId) return;
    setIsDragging(false)

    event.currentTarget.releasePointerCapture(event.pointerId);
    state.isDragging = false;
    const diePos = actualPosRef.current.getBoundingClientRect()
    const boardPositions = getBoard()
    console.log({ boardPositions })

    if(!state.hasMoved && !state.positionOnBoard.length > 0) rotate(event)

    const offset = getOffset()
    const getOverlapPercent = (die, cell) => {
      
      
      const offsetDie = {
        top: die.top - offset.y,
        bottom: die.bottom - offset.y,
        left: die.left - offset.x,
        right: die.right - offset.x
      }
      const cellArea = die.width * die.height;
      if (cellArea === 0) return 0;
    
      const ix = Math.max(0, Math.min(offsetDie.right, cell.x + cell.w) - Math.max(offsetDie.left, cell.x));
      const iy = Math.max(0, Math.min(offsetDie.bottom, cell.y + cell.h) - Math.max(offsetDie.top, cell.y));

      
    
      const intersectionArea = ix * iy;
      const val = (intersectionArea / cellArea) * 200;
      return val
      
    }

    const results = boardPositions.map(cell => ({
      id: cell.id,
      overlap: getOverlapPercent(diePos, cell)
    }));

    const resetAfterDrop = () => {
      dragStateRef.current = {
        ...dragStateRef.current,
        positionOnBoard: []
      }
      return animateTo(0,0)
    }

    const droppedIds = results.filter(item => item.overlap > 50).map(item => item.id)
    if(droppedIds.length < 2) {
      return resetAfterDrop()
      
    }

    let bothEmpty = true
    droppedIds.forEach(id => {
      bothEmpty = bothEmpty && (getValFromCell(id) === '') 
    })
    // console.log({ bothEmpty })
    if(bothEmpty) {
      pushToBoard(droppedIds)
    } else {
      return resetAfterDrop()
    }
    console.log(`ok so i get here,.,,.`)

    const smallestCell = (ids) => {
      let smallestVal = Infinity
      let smallestId = ''
      ids.forEach(id => {
        const vals = id.split('-')
        const sum = vals[0] + vals[1]
        if(sum < smallestVal) {
          smallestVal = sum
          smallestId = id
        }
      })
      return smallestId
    }
    const firstCell = smallestCell(droppedIds)
    if(!firstCell) {
      return resetAfterDrop()
      
    }
    console.log(`185`)

    const target = boardPositions.find(item => item.id === firstCell)
    if(!target) {
      return resetAfterDrop()
    }

    console.log(`192`)
    const pos = getOriginalDicePosWithId(id)
    const diff = {x: pos.rect.x - offset.x - target.x, y: pos.rect.y - offset.y - target.y}
    dragStateRef.current = {
      ...dragStateRef.current,
      positionOnBoard: droppedIds
    }
    animateTo(diff.x * -1, diff.y * -1)
    console.log(`200`)

    checkIfWon()
  };

  const handlePointerEnter = (event) => {
    document.body.style.cursor = 'grab'
  }

  const handlePointerLeave = (event) => {
    document.body.style.cursor = 'default'
  }

  const getValsInRegion = (coordinates) => {
    const vals = []
    coordinates.forEach(coord => {
      const id = `${coord.y}-${coord.x}`
      vals.push(getValFromCell(id))
    })
    return vals
  }

  const sum = (arr) => {
    let s = 0
    arr.forEach(item => s += item)
    return s
  }

  const checkIfWon = () => {
    const boardPositions = getBoard()
    const boardFull = boardPositions.every(item => item.val !== '')
    // UNCOMMENT THIS
    if(!boardFull) return

    const regions = getRegions()
    let allRegionsSatisfied = true
    regions.forEach(region => {
      
      const op = region.computedValue[0]
      const rest = region.computedValue.slice(1)
      const items = getValsInRegion(region.coordinates)
      if (op === "<") {
        if(sum(items) >= parseInt(rest)) {
          // console.log(`error`)
          allRegionsSatisfied = false
          return
        }
      } else if (op === ">") {
        if(sum(items) <= parseInt(rest)) {
          // console.log(`error`)
          allRegionsSatisfied = false
          return
        }
      } else if(op === "=") {
        const s = new Set(items)
        const dupArr = [...s]
        if(dupArr.length > 1 ) {
          // console.log(`error`)
          allRegionsSatisfied = false
          return 
        }
      } else if(op === "≠") {
        const s = new Set(items)
        const dupArr = [...s]
        if(items.length !== dupArr.length) {
          allRegionsSatisfied = false
          return
        }
      } else {
        if(sum(items) !== parseInt(region.computedValue)) {
          // console.log(region)
          // console.log(sum(items), region.computedValue)
          console.log(`error`)
          allRegionsSatisfied = false
          return
        }
      }
      // if (c === "=") return [110, 150, 170] // visible blue-teal
      // if (c === "≠") return [120, 170, 140] // gentle emerald green
      // return [200, 120, 90] // low-sat orange-red
    })
    if(allRegionsSatisfied) {
      // settimeout cuz animation

      setTimeout(() => setIsSolved(true), 500)
    } else {
      setTimeout(() => alert('Error'), 500)
    }
    // }
  }

  const concatStyle = {
    ...style,
    opacity: isDragging ? 0.5 : 1
  }
  return (
      <motion.div
        style={{ x, y, }}
        dragConstraints={dragConstraints}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div style={{...concatStyle}} ref={actualPosRef}>
        {children}
        </div>
      </motion.div>
  );
}
