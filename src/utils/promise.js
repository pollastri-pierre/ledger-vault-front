// @flow

export const delay = (ms: number): Promise<any> =>
  new Promise((success) => setTimeout(success, ms));

export async function minWait(promise: Promise<any>, ms: number) {
  const now = window.performance.now();
  const res = await promise;
  const elapsed = window.performance.now() - now;
  if (elapsed < ms) {
    await delay(Math.round(ms - elapsed));
  }
  return res;
}
