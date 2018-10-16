//@flow

// will try to shallow merge old object with patch but keep returning old if they are all shallow equal
export function merge(
  old: Object,
  patch: ?Object,
  equals: (a: Object, b: Object) => boolean = (a, b) => a === b
): Object {
  if (!patch) return old;
  let copy;
  for (let k in patch) {
    if (!equals(old[k], patch[k])) {
      if (!copy) {
        copy = { ...old };
      }
      copy[k] = patch[k];
      /* copy all keys belonging to old that are not present in patch.
         Typically we have too ways to get opeation. One with full data with a transaction object, and another without a transaction.
         If the endpoint with less data finishes after an endpoint with full data it can breaks the UI.
      */
      copy[k] = Object.assign({ ...old[k] }, copy[k]);
    } else if (copy) {
      copy[k] = old[k];
    }
  }
  return !copy ? old : copy;
}
