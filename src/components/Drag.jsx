import React, { useRef } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { getBoard, getOffset } from "../helpers/board";

export const Drag = ({ children, style, onDragEnd, rotate, dragConstraints }) => {
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
    hasMoved: false
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
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: x.get(),
      startY: y.get(),
      isDragging: true,
      hasMoved: false
    };

    if (animXRef.current) animXRef.current.stop();
    if (animYRef.current) animYRef.current.stop();
  };

  const handlePointerMove = (event) => {
    const state = dragStateRef.current;
    if (!state.isDragging || state.pointerId !== event.pointerId) return;

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

    event.currentTarget.releasePointerCapture(event.pointerId);
    state.isDragging = false;
    const diePos = actualPosRef.current.getBoundingClientRect()
    const boardPositions = getBoard()

    if(!dragStateRef.current.hasMoved) rotate(event)

    const getOverlapPercent = (die, cell) => {
      
      const offset = getOffset()
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

    const droppedIds = results.filter(item => item.overlap > 50).map(item => item.id)
    console.log({ droppedIds})
    if(droppedIds.length < 2) {
      animateTo(0,0)
    }

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
      animateTo(0,0)
    }
    // console.log(boardPositions)
    const target = boardPositions.find(item => item.id === firstCell)
    if(!target) {
      animateTo(0,0)
    }
    
    console.log(target)

    // animateTo(-5, -5)


    // console.log({ results })

    
  };

  const handlePointerEnter = (event) => {
    document.body.style.cursor = 'grab'
  }

  const handlePointerLeave = (event) => {
    document.body.style.cursor = 'default'
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
        <div style={{...style}} ref={actualPosRef}>
        {children}
        </div>
      </motion.div>
  );
}
