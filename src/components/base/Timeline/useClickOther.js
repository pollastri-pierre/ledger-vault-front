// @flow

import { useEffect, useRef } from "react";

export default function useClickOther(
  dataType: string,
  parent: React$ElementRef<any>,
  cb: () => void,
) {
  const savedCb = useRef(cb);

  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (parent.current && parent.current.contains(e.target)) return;
      const foundDataType = findDataType(e.target);
      if (foundDataType === dataType) {
        savedCb.current();
      }
    };
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [dataType, parent]);
}

function findDataType(element) {
  let el = element;
  while (el) {
    // $FlowFixMe
    const { type } = el.dataset;
    if (type) return type;
    // $FlowFixMe
    el = el.parentElement;
  }
  return null;
}
