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
    // onDragEnd(event)
    // console.log(actualPosRef.current)
    const diePos = actualPosRef.current.getBoundingClientRect()
    const boardPositions = getBoard()
    const offset = getOffset()

    // console.log({ boardPositions})
    // console.log({ itemRect})
    // const ok = {...itemRect}
    // console.log(itemRect)
    // itemRect.left = itemRect.left - offset.x
    // itemRect.x = itemRect.x - offset.x
    // itemRect.top = itemRect.top - offset.y
    // itemRect.y = itemRect.y - offset.y

    const getOverlapPercent = (die, cell) => {
      console.log({ cell, die })
      const cellArea = die.width * die.height;
      if (cellArea === 0) return 0;
    
      const ix = Math.max(0, Math.min(die.right, cell.x + cell.w) - Math.max(die.left, cell.x));
      const iy = Math.max(0, Math.min(die.bottom, cell.y + cell.h) - Math.max(die.top, cell.y));
      // const ix = cell.x - die.right

      
    
      const intersectionArea = ix * iy;
      const val = (intersectionArea / cellArea) * 100;
      console.log(cell.id, val)
      return val
      
    }

    const results = boardPositions.map(cell => ({
      id: cell.id,
      overlap: getOverlapPercent(diePos, cell)
    }));

    console.log({ results })

    if(!dragStateRef.current.hasMoved) rotate(event)
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
