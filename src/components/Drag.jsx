import React, { useRef } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { getBoard } from "../helpers/board";

export const Drag = ({ children, onDragEnd, rotate, dragConstraints }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const dragStateRef = useRef({
    pointerId: null,
    startPointerX: 0,
    startPointerY: 0,
    startX: 0,
    startY: 0,
    isDragging: false,
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

    // spring chases pointer target in ANY direction
    animateTo(targetX, targetY);
  };

  const handlePointerUp = (event) => {
    document.body.style.cursor = 'grab'

    const state = dragStateRef.current;
    console.log(state)
    if (state.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    state.isDragging = false;
    onDragEnd(event)


  };

  const handlePointerEnter = (event) => {
    document.body.style.cursor = 'grab'
  }

  const handlePointerLeave = (event) => {
    document.body.style.cursor = 'default'
  }

  return (
      <motion.div
        style={{ x, y }}
        dragConstraints={dragConstraints}
        onPointerDown={handlePointerDown}
        onClick={rotate}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {children}
      </motion.div>
  );
}
