// @flow

import React, { useState, useEffect, useRef, useCallback } from "react";
import Animated from "animated/lib/targets/react-dom";

import { boxShadow } from "components/base/Modal/components";
import Measure from "components/base/Measure";

// FIXME `import` won't compile in storybook currently (wtf?)
const CircularProgress = require("@material-ui/core/CircularProgress").default; // eslint-disable-line

const SIZE = 350;

const SPEEDS = {
  scaleX: { tension: 130, friction: 15 },
  scaleY: { tension: 130, friction: 15 },
};

export function GrowingSpinner() {
  return (
    <div style={fixedStyle}>
      <div style={spinnerStyle}>
        <CircularProgress size={24} />
      </div>
    </div>
  );
}

export default function GrowingCard({ children }: { children: React$Node }) {
  const [isMeasured, setIsMeasured] = useState(false);
  const [anims] = useState({
    opacity: new Animated.Value(0),
    scaleX: new Animated.Value(1),
    scaleY: new Animated.Value(1),
    translateY: new Animated.Value(0),
  });

  const unmounted = useRef(false);

  useEffect(
    () => () => {
      unmounted.current = true;
    },
    [],
  );

  const onMeasure = useCallback(
    dimensions => {
      const { width, height } = dimensions;
      anims.opacity.setValue(0);
      anims.scaleX.setValue(SIZE / width);
      anims.scaleY.setValue(SIZE / height);

      const { innerHeight } = window;
      let offset = 0;
      if (height > innerHeight - 80) {
        offset = (height - innerHeight) / 2 + 40;
        Animated.spring(anims.translateY, { toValue: offset }).start();
      }

      Animated.stagger(100, [
        Animated.parallel([
          Animated.spring(anims.scaleX, { toValue: 1, ...SPEEDS.scaleX }),
          Animated.spring(anims.scaleY, { toValue: 1, ...SPEEDS.scaleY }),
          Animated.spring(anims.translateY, { toValue: offset }),
        ]),
        Animated.spring(anims.opacity, { toValue: 1 }),
      ]).start();

      setIsMeasured(true);
    },
    [anims],
  );

  const wrapperStyle = {
    ...modalStyle,
    opacity: isMeasured ? 1 : 0,
    transform: [
      { scaleX: anims.scaleX },
      { scaleY: anims.scaleY },
      { translateY: anims.translateY },
    ],
  };

  const contentStyle = {
    opacity: anims.opacity,
  };

  return (
    <>
      <Measure onMeasure={onMeasure}>
        <Animated.div style={wrapperStyle}>
          <Animated.div style={contentStyle}>{children}</Animated.div>
        </Animated.div>
      </Measure>
      {!isMeasured && (
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
