//@flow
import React, { Component } from "react";
import Animated from "animated/lib/targets/react-dom";
import "./index.css";

const progress = new Animated.Value(0);
const opacity = new Animated.Value(1);

export class GlobalLoadingRendering extends Component<void> {
  interpolatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"]
  });
  render() {
    return (
      <Animated.div
        className="GlobalLoading"
        style={{ width: this.interpolatedWidth, opacity }}
      />
    );
  }
}

let instanceCount = 0;
export default class GlobalLoading extends Component<*> {
  componentDidMount() {
    if (instanceCount === 0) {
      opacity.setValue(1);
      progress.setValue(0);
    }
    Animated.spring(progress, {
      toValue: 1,
      tension: 5,
      friction: 200
    }).start();
    ++instanceCount;
  }
  componentWillUnmount() {
    --instanceCount;
    if (instanceCount === 0) {
      Animated.spring(opacity, { toValue: 0 }).start();
    }
  }
  render() {
    return null;
  }
}
