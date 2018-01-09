//@flow
import React, { Component } from "react";
import Animated from "animated/lib/targets/react-dom";

const progress = new Animated.Value(0);
const opacity = new Animated.Value(1);

export class GlobalLoadingRendering extends Component<{}> {
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
export function load() {
  if (instanceCount++ === 0) {
    opacity.setValue(1);
    progress.setValue(0);
  }
  Animated.spring(progress, {
    toValue: 1,
    tension: 5,
    friction: 200
  }).start();

  return function unload() {
    if (--instanceCount === 0) {
      Animated.spring(opacity, {
        toValue: 0
      }).start();
    }
  };
}

export default class GlobalLoading extends Component<*> {
  unload: Function;
  componentDidMount() {
    this.unload = load();
  }
  componentWillUnmount() {
    this.unload();
  }
  render() {
    return null;
  }
}
