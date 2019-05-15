// @flow

import React, { useRef, useEffect } from "react";

type Dimensions = {
  width: number,
  height: number,
};

export default function Measure({
  children,
  onMeasure,
}: {
  children: React$Node,
  onMeasure: Dimensions => void,
}) {
  const node = useRef(null);

  useEffect(() => {
    let frame;
    const idleCallbackID = window.requestIdleCallback(() => {
      frame = requestAnimationFrame(() => {
        if (!node.current) return;
        onMeasure(node.current.getBoundingClientRect());
      });
    });
    return () => {
      cancelIdleCallback(idleCallbackID);
      cancelAnimationFrame(frame);
    };
  }, [onMeasure]);

  return <div ref={node}>{children}</div>;
}
