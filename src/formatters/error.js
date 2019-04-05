// @flow

export type EnhancedError = Error & { metaData: { type: any } };

export default (error: Error | EnhancedError) => {
  if (typeof error === "string") return error;
  const genStr = ((error && error.message) || "").toString();
  // $FlowFixMe
  const metaData = "metaData" in error ? error.metaData : null;
  return metaData ? `${genStr}: ${String(metaData.type)}` : genStr;
};
