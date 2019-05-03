// @flow

import React, { useState, useEffect, useRef, useCallback } from "react";
import Animated from "animated/lib/targets/react-dom";

import { boxShadow } from "components/base/Modal/components";
import Measure from "components/base/Measure";

// FIXME `import` won't compile in storybook currently (wtf?)
const CircularProgress = require("@material-ui/core/CircularProgress").default; // eslint-disable-line

const SIZE = 150;

export function GrowingSpinner() {
  return (
    <div style={fixedStyle}>
      {/* FIXME forced to create new ref for style. else, no bg (wtf?) */}
      <div style={{ ...spinnerStyle }}>
        <CircularProgress size={24} />
      </div>
    </div>
  );
}

export default function GrowingCard({ children }: { children: React$Node }) {
  const [anims] = useState({
    opacity: new Animated.Value(0),
    scaleX: new Animated.Value(1),
    scaleY: new Animated.Value(1),
    translateY: new Animated.Value(0),
  });

  const [dimensions, setDimensions] = useState({ width: SIZE, height: SIZE });
  const [finished, setFinished] = useState(false);
  const unmounted = useRef(false);

  const { width, height } = dimensions;

  useEffect(
    () => () => {
      unmounted.current = true;
    },
    [],
  );

  const onMeasure = useCallback(
    dimensions => {
      setDimensions(dimensions);
      const { width, height } = dimensions;
      anims.scaleX.setValue(SIZE / width);
      anims.scaleY.setValue(SIZE / height);
      Animated.spring(anims.scaleX, { toValue: 1 }).start();
      Animated.spring(anims.scaleY, { toValue: 1 }).start();
      const { innerHeight } = window;
      if (height > innerHeight - 80) {
        const offset = (height - innerHeight) / 2 + 40;
        Animated.spring(anims.translateY, { toValue: offset }).start();
      }

      // couldn't find a way to get animation end callback
      setTimeout(() => {
        if (unmounted.current) return;
        setFinished(true);
        Animated.spring(anims.opacity, { toValue: 1 }).start();
      }, 500);
    },
    [anims],
  );

  const wrapperStyle = {
    ...modalStyle,
    opacity: finished ? 1 : 0,
  };

  const contentStyle = {
    opacity: anims.opacity,
  };

  const loadingStyle = {
    ...modalStyle,
    width,
    height,
    opacity: finished ? 0 : 1,
    transform: [
      { scaleX: anims.scaleX },
      { scaleY: anims.scaleY },
      { translateY: anims.translateY },
    ],
  };

  return (
    <>
      <Measure onMeasure={onMeasure}>
        <div style={wrapperStyle}>
          <Animated.div style={contentStyle}>{children}</Animated.div>
        </div>
      </Measure>
      <div style={fixedStyle}>
        <Animated.div style={loadingStyle} />
      </div>
    </>
  );
}

const modalStyle = {
  background: "white",
  borderRadius: 4,
  boxShadow,
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
