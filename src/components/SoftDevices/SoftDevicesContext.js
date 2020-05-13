// @flow

import React, { useReducer, useContext, createContext } from "react";

import SoftDevicesWrapper from "components/SoftDevices/SoftDevicesWrapper";
import MockDevices from "components/MockDevices";
import { getPreferredTransport } from "device/transport";

let USER_SEEDS = localStorage.getItem("WEBLUE_SEEDS") || "[]";
try {
  USER_SEEDS = JSON.parse(USER_SEEDS);
} catch (err) {
  USER_SEEDS = [];
}
localStorage.setItem("WEBLUE_SEEDS", JSON.stringify(USER_SEEDS));

type EmulatorDevice = {
  id: number,
  name: string,
  vnc: string,
  apdu: string,
};

export type Seed = {
  name: string,
  seed: string,
};

type State = {
  isWeblueOpened: boolean,
  isSoftware: boolean,
  isSeedsManagerOpened: boolean,
  isSeedsGeneratorOpened: boolean,
  isMinimized: boolean,
  isFetching: boolean,
  devices: EmulatorDevice[],
  device: EmulatorDevice | null,
  error: Error | null,
  seeds: Seed[],
};

const initialState = {
  isWeblueOpened: getPreferredTransport() === "weblue",
  isSoftware: getPreferredTransport() === "software",
  isSeedsManagerOpened: false,
  isSeedsGeneratorOpened: false,
  isMinimized: false,
  isFetching: true,
  devices: [],
  device: null,
  error: null,
  seeds: USER_SEEDS,
};

type Action =
  | { type: "OPEN_WEBLUE" }
  | { type: "OPEN_SOFTWARE" }
  | { type: "OPEN_SEEDS_MANAGER" }
  | { type: "OPEN_SEEDS_GENERATOR" }
  | { type: "CLOSE_SEEDS_MANAGER" }
  | { type: "CLOSE_SEEDS_GENERATOR" }
  | { type: "SET_HARDWARE_MODE" }
  | { type: "TOGGLE_MINIMIZE" }
  | { type: "REGISTER_SEED", payload: Seed }
  | { type: "GENERATE_SEEDS", payload: Seed[] }
  | { type: "SET_ERROR", payload: Error | null }
  | { type: "SET_FETCHING", payload: boolean }
  | { type: "SET_DEVICES", payload: EmulatorDevice[] }
  | { type: "SET_DEVICE", payload: EmulatorDevice | null }
  | { type: "CLEAR_SEEDS" };

type Dispatch = Action => void;

const reducer = (state, action) => {
  let seeds;
  switch (action.type) {
    case "OPEN_WEBLUE":
      return { ...state, isWeblueOpened: true, isSoftware: false };
    case "OPEN_SOFTWARE":
      return { ...state, isSoftware: true, isWeblueOpened: false };
    case "OPEN_SEEDS_GENERATOR":
      return { ...state, isSeedsGeneratorOpened: true };
    case "OPEN_SEEDS_MANAGER":
      return { ...state, isSeedsManagerOpened: true };
    case "SET_HARDWARE_MODE":
      return {
        ...state,
        isWeblueOpened: false,
        isFetching: true,
        isSoftware: false,
      };
    case "CLOSE_SEEDS_GENERATOR":
      return { ...state, isSeedsGeneratorOpened: false };
    case "CLOSE_SEEDS_MANAGER":
      return { ...state, isSeedsManagerOpened: false };
    case "TOGGLE_MINIMIZE":
      return { ...state, isMinimized: !state.isMinimized };
    case "REGISTER_SEED":
      seeds = [...state.seeds, action.payload];
      localStorage.setItem("WEBLUE_SEEDS", JSON.stringify(seeds));
      return { ...state, seeds };
    case "GENERATE_SEEDS":
      seeds = action.payload;
      localStorage.setItem("WEBLUE_SEEDS", JSON.stringify(seeds));
      return { ...state, seeds };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_FETCHING":
      return { ...state, isFetching: action.payload };
    case "SET_DEVICES":
      return { ...state, devices: action.payload };
    case "SET_DEVICE":
      return { ...state, device: action.payload };
    case "CLEAR_SEEDS":
      seeds = [];
      localStorage.setItem("WEBLUE_SEEDS", JSON.stringify(seeds));
      return { ...state, seeds };
    default:
      return state;
  }
};

const SoftDevicesContext = createContext<State>(initialState);
const SoftDevicesContextDispatch = createContext<Dispatch>(() => {});

export const SoftDevicesProvider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer<State, Action>(reducer, initialState);
  return (
    <SoftDevicesContext.Provider value={state}>
      <SoftDevicesContextDispatch.Provider value={dispatch}>
        <SoftDevicesWrapper />
        {children}
        {process.env.NODE_ENV === "e2e" && state.isSoftware && <MockDevices />}
      </SoftDevicesContextDispatch.Provider>
    </SoftDevicesContext.Provider>
  );
};

export const useSoftDevicesState = () => useContext(SoftDevicesContext);
export const useSoftDevicesDispatch = () =>
  useContext(SoftDevicesContextDispatch);
