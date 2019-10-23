// @flow

import { useRef, useState, useEffect } from "react";
import { useSpring } from "react-spring";

const SPRING_CONFIG = {
  tension: 500,
};

export default () => {
  const ref = useRef<HTMLElement | null>(null);
  const [isMouseDown, setMouseDown] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    const mousedown = (e: MouseEvent) => {
      setClickPos({ x: e.pageX, y: e.pageY });
      setMouseDown(true);
    };
    const mouseup = () => {
      setClickPos({ x: 0, y: 0 });
      setMouseDown(false);
    };
    current.addEventListener("mousedown", mousedown);
    window.addEventListener("mouseup", mouseup);
    return () => {
      current.removeEventListener("mousedown", mousedown);
      window.removeEventListener("mouseup", mouseup);
    };
  }, [ref, setMouseDown]);

  useEffect(() => {
    if (isMouseDown) return;
    setOffsetPos(pos);
  }, [isMouseDown, pos, setOffsetPos]);

  useEffect(() => {
    if (!isMouseDown) return;
    const mousemove = e => {
      setPos({
        x: e.pageX - clickPos.x + offsetPos.x,
        y: e.pageY - clickPos.y + offsetPos.y,
      });
    };
    window.addEventListener("mousemove", mousemove);
    return () => {
      window.removeEventListener("mousemove", mousemove);
    };
  }, [isMouseDown, clickPos, offsetPos]);

  const style = useSpring({
    config: SPRING_CONFIG,
    transform: `translate(${pos.x}px, ${pos.y}px)`,
  });

  return [style, ref];
};
