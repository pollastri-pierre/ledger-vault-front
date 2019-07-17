// @flow
export function ensure(
  {
    onlyIf: condition = true,
    NODES,
    key,
  }: { onlyIf?: boolean, NODES: Object, key: string },
  create,
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

export function remove(NODES, key) {
  NODES[key].remove();
  NODES[key] = null;
}

export function append(NODES, key, node) {
  NODES[key] = node;
}
