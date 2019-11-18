// @flow

import { useEffect, useRef } from "react";

export function usePrevious(value: ?React$Node) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
