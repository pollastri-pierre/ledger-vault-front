//@flow

const pendingPromisePerKey: { [_: string]: Promise<*> } = {};

export default (key: string, f: () => Promise<*>): Promise<*> => {
  if (key in pendingPromisePerKey) {
    return pendingPromisePerKey[key];
  }
  const p = f();
  const onDone = () => {
    delete pendingPromisePerKey[key];
  };
  p.then(onDone, onDone);
  pendingPromisePerKey[key] = p;
  return p;
};
