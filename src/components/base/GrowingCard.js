// @flow

import React, { useState, useEffect, useCallback } from "react";
import { animated, useSpring } from "react-spring";

import { boxShadow } from "components/base/Modal/components";
import Measure from "components/base/Measure";
import Spinner from "components/base/Spinner";

import { usePrevious } from "utils/customHooks";

const SIZE = 350;

export function GrowingSpinner() {
  return (
    <div style={fixedStyle}>
      <div style={spinnerStyle}>
        <Spinner />
      </div>
    </div>
  );
}

export default function GrowingCard({ children }: { children: React$Node }) {
  const [transforms, setTransforms] = useState<?Object>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const prevTransforms = usePrevious(transforms);

  useEffect(() => {
    if (!prevTransforms && !!transforms) {
      const transforms = { scaleX: 1, scaleY: 1, translateY: 0 };
      setTransforms(transforms);
    }
    if (!shouldShow && !!transforms) {
      setShouldShow(true);
    }
  }, [transforms, prevTransforms, shouldShow]);

  const onMeasure = useCallback(
    dimensions => {
      const { width, height } = dimensions;

      const { innerHeight } = window;
      let offset = 0;
      if (height > innerHeight - 80) {
        offset = (height - innerHeight) / 2 + 40;
      }

      const transforms = {
        scaleX: SIZE / width,
        scaleY: SIZE / height,
        translateY: -offset,
      };

      setTransforms(transforms);
    },
    [setTransforms],
  );

  const opacityStyle = {
    opacity: shouldShow ? 1 : 0,
  };

  const cssTransforms = transforms
    ? `scaleX(${transforms.scaleX}) scaleY(${transforms.scaleY}) translateY(${transforms.translateY}px)`
    : `scaleX(1) scaleY(1) translateY(0)`;

  const wrapperStyle = useSpring({
    position: "relative",
    zIndex: 2,
    transform: cssTransforms,
    immediate: !!transforms && !prevTransforms,
    ...modalStyle,
    config: {
      tension: 700,
      friction: 50,
    },
  });

  const contentStyle = useSpring({
    opacity: transforms ? 1 : 0,
  });

  return (
    <>
      <Measure onMeasure={onMeasure}>
        <div style={opacityStyle}>
          <animated.div style={wrapperStyle}>
            <animated.div style={contentStyle}>{children}</animated.div>
          </animated.div>
        </div>
      </Measure>
      {!shouldShow && (
        <div style={fixedStyle}>
          <div style={fakeModalStyle} />
        </div>
      )}
    </>
  );
}

const modalStyle = {
  background: "white",
  borderRadius: 4,
  boxShadow,
};

const fakeModalStyle = {
  ...modalStyle,
  width: SIZE,
  height: SIZE,
};

const fixedStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
};

const spinnerStyle = {
  ...modalStyle,
  width: SIZE,
  height: SIZE,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
