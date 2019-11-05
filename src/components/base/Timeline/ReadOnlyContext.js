// @flow

import { createContext, useContext } from "react";

const ReadOnlyContext = createContext<boolean>(false);

export const useReadOnly = () => useContext(ReadOnlyContext);

export const ReadOnlyProvider = ReadOnlyContext.Provider;
