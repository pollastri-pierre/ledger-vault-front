//@flow

export default function(uri: string): Promise<Object | Array<*>> {
  // 1. we need to concat an API base url
  // 2. we need to factorize the promises PER uri. so calling twice getJSON("/accounts") will do one underlying call
  // 3. we need to use something like https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/fetch/fetchWithRetries.js
  return Promise.reject('not implemented getJSON(' + uri + ')');
}
