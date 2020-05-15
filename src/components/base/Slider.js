// @flow

import React, { Children, useEffect, useCallback } from "react";
import { animated, useSprings } from "react-spring";

function Slider({ children, slide }: { children: React$Node, slide: number }) {
  const childs = Children.toArray(children);

  const anim = useCallback(
    (i) => ({
      opacity: i === slide ? 1 : 0,
      transform: `translateY(${(i - slide) * 20}%)`,
      config: {
        tension: 600,
        friction: 40,
      },
    }),
    [slide],
  );

  const [springs, setSprings] = useSprings(childs.length, anim);

  useEffect(() => {
    setSprings(anim);
  }, [anim, setSprings]);

  return (
    <div style={{ padding: 20, position: "relative" }}>
      {springs.map((style, i) => (
        <animated.div
          key={childs[i].key}
          style={{
            pointerEvents: i === slide ? "auto" : "none",
            ...(i > 0 ? stickyStyle : {}),
            ...style,
          }}
        >
          {childs[i]}
        </animated.div>
      ))}
    </div>
  );
}

const stickyStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
};

export default Slider;
