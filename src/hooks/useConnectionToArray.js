// @flow

import { useMemo } from "react";

import type { Connection } from "restlay/ConnectionQuery";

const useConnectionToArray = <T>(connection: Connection<T>) => {
  return useMemo<Array<T>>(() => connection.edges.map(e => e.node), [
    connection,
  ]);
};

export default useConnectionToArray;
