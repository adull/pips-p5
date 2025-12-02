import { P5Canvas } from "@p5-wrapper/react";
import React, { useEffect, useState } from "react";
  
  
  
  const sketch = (p5) => {
    let rotation = 0;
  
    p5.setup = () => p5.createCanvas(600, 400, p5.WEBGL);
  
    p5.updateWithProps = props => {
      if (props.rotation) {
        rotation = (props.rotation * Math.PI) / 180;
      }
    };
  
    p5.draw = () => {
      p5.background(100);
      p5.normalMaterial();
      p5.noStroke();
      p5.push();
      p5.rotateY(rotation);
      p5.box(100);
      p5.pop();
    };
  }
  
const Pfive = () => {
    const [rotation, setRotation] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(
        () => setRotation(rotation => rotation + 100),
        100
      );
  
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    return <P5Canvas sketch={sketch} rotation={rotation} />;
    // return <div>haha</div>
  }

  export default Pfive