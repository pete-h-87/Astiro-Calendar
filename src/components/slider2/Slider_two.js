import React, { useState, useRef, useEffect } from 'react';

const Slider = () => {
  const [value, setValue] = useState(0);
  const sliderRef = useRef(null);
  const isMouseDown = useRef(false);
  const initialClickY = useRef(null);
  const previousX = useRef(null);

  const handleMouseDown = (e) => {
    isMouseDown.current = true;
    initialClickY.current = e.clientY;
    previousX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (isMouseDown.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const currentY = e.clientY;
      const currentX = e.clientX;
      const sliderHeight = sliderRect.height;

      let increment = 100;
      const distanceFromBottom = sliderHeight - (currentY - sliderRect.top);
      if (distanceFromBottom >= sliderHeight - 100) {
        increment = 1;
      } else if (distanceFromBottom >= sliderHeight - 200) {
        increment = 10;
      }

      const deltaX = currentX - previousX.current;
      const steps = Math.floor(deltaX / 20); // Calculate the number of 20-pixel steps
      const newValue = value + (steps * increment);
      setValue(Math.max(0, Math.min(1000, newValue)));

      previousX.current = currentX;
    }
  };

  return (
    <div
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <input
        type="range"
        min={0}
        max={1000}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
      />
      <p>Value: {value}</p>
    </div>
  );
};

export default Slider;
