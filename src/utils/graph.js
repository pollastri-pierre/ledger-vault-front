// @flow
export function ensure(
  {
    onlyIf: condition = true,
    NODES,
    key,
  }: { onlyIf?: boolean, NODES: Object, key: string },
  create: Function,
) {
  if (!condition && NODES[key]) {
    remove(NODES, key);
  }
  if (condition && NODES[key]) {
    remove(NODES, key);
  }
  if (condition && !NODES[key]) {
    append(NODES, key, create());
  }
}

export function remove(NODES: Object, key: string) {
  NODES[key].remove();
  NODES[key] = null;
}

export function append(NODES: Object, key: string, node: Object) {
  NODES[key] = node;
}
