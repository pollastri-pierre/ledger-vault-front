// @flow

import React, { useRef, useEffect, useCallback } from "react";
import shortid from "shortid";

import { minWait } from "utils/promise";
import EmulatorTransport from "./EmulatorTransport";
import EmulatorLayout from "./EmulatorLayout";
import { useEmulatorState, useEmulatorDispatch } from "./EmulatorContext";

// noVNC has issues through jsdom
let RFB = null;
if (process.env.NODE_ENV !== "test") {
  RFB = require("@novnc/novnc/lib/rfb").default;
  const NOVNCLogging = require("@novnc/novnc/lib/util/logging");
  NOVNCLogging.init_logging("error");
}

let _currentDevice = null;

const LOCAL_WEBLUE = window.localStorage.getItem("LOCAL_WEBLUE") === "1";

const getWeblueURL = () =>
  LOCAL_WEBLUE ? "http://localhost:3000" : window.config.WEBLUE_URL;

const getAPDUURL = device =>
  LOCAL_WEBLUE
    ? `ws://localhost:${device.apdu}/websockify`
    : `${window.config.SPECULOS_WEBLUE_URL}/${device.apdu}/websockify`;

const getVNCURL = device =>
  LOCAL_WEBLUE
    ? `ws://localhost:${device.vnc}/websockify`
    : `${window.config.SPECULOS_WEBLUE_URL}/${device.vnc}/websockify`;

// bind a transport emulator on the global _currentDevice
// aka: the selected device will receive apdus
export const createEmulatorTransport = async () => {
  if (!_currentDevice) {
    throw new Error("No emulator available. Please spawn one.");
  }
  const url = getAPDUURL(_currentDevice);
  const t = await EmulatorTransport.open(url);
  return t;
};

// get and set session id
const EMULATOR_SESSION_ID =
  localStorage.getItem("EMULATOR_SESSION_ID") || shortid.generate();
localStorage.setItem("EMULATOR_SESSION_ID", EMULATOR_SESSION_ID);

const Emulator = () => {
  const { devices, device } = useEmulatorState();
  const dispatch = useEmulatorDispatch();

  const setFetching = useCallback(
    (isFetching: boolean) =>
      dispatch({ type: "SET_FETCHING", payload: isFetching }),
    [dispatch],
  );

  const setDevices = useCallback(
    devices => dispatch({ type: "SET_DEVICES", payload: devices }),
    [dispatch],
  );

  const setDevice = useCallback(
    device => dispatch({ type: "SET_DEVICE", payload: device }),
    [dispatch],
  );

  const setError = useCallback(
    (error: Error | null) => dispatch({ type: "SET_ERROR", payload: error }),
    [dispatch],
  );

  const vncRef = useRef();

  const deviceVNCURL = device ? getVNCURL(device) : null;

  // the current device receive vault apdus
  const setCurrentDevice = useCallback(
    device => {
      setDevice(device);
      _currentDevice = device;
    },
    [setDevice],
  );

  // sync _device singleton with current device
  useEffect(() => {
    _currentDevice = device;
  }, [device]);

  useEffect(() => {
    let unsub = false;

    const fetchDevices = async () => {
      let res = null;
      try {
        const loadURL = `${getWeblueURL()}/sessions/${EMULATOR_SESSION_ID}`;
        const load = fetchJSON(loadURL);
        res = await minWait(load, 500);
        if (unsub) return;
        setError(null);
      } catch (err) {
        if (unsub) return;
        setError(new Error("Seems that emulator api is not up"));
        setFetching(false);
      }
      return res ? res.sessionDevices : null;
    };

    const effect = async () => {
      setFetching(true);
      // fetch list of devices already spawned for this session
      const devices = await fetchDevices();
      if (unsub) return;
      if (!devices) return;

      // display them
      setDevices(devices);

      // focus the first one if needed
      if (devices.length) {
        const predicat = d => _currentDevice && d.id === _currentDevice.id;
        const device = devices.find(predicat);
        setCurrentDevice(device || devices[0]);
      }

      setFetching(false);
    };
    effect();
    return () => {
      unsub = true;
    };
  }, [setCurrentDevice, setDevices, setError, setFetching]);

  useVNC(vncRef, deviceVNCURL);

  const handleSpawnDevice = async seed => {
    // spawn device instance & collect urls for apdus & vnc sockets
    const device = await createDevice(seed);

    // update device list
    setDevices([...devices, device]);

    // focus the last added device
    setCurrentDevice(device);
  };

  const handleClearSession = async () => {
    const url = `${getWeblueURL()}/sessions/${EMULATOR_SESSION_ID}`;
    await fetch(url, { method: "DELETE" });
    setDevices([]);
    setCurrentDevice(null);
  };

  return (
    <EmulatorLayout
      vncRef={vncRef}
      onSpawnDevice={handleSpawnDevice}
      onClearSession={handleClearSession}
    />
  );
};

const useVNC = (ref, url) => {
  useEffect(() => {
    if (!url) return;
    if (!ref.current) return;
    if (!RFB) return;
    const rfb = new RFB(ref.current, url);
    rfb._screen.style.background = "transparent";
    rfb._screen.style.overflow = "hidden";
    return () => {
      rfb.disconnect();
    };
  }, [ref, url]);
};

const createDevice = async seed => {
  const res = await fetch(`${getWeblueURL()}/devices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: seed.name,
      seed: seed.seed,
      sessionId: EMULATOR_SESSION_ID,
      model: "blue",
      appName: "vault",
      firmVersion: "blue-2.2.5",
      appVersion: window.config.APP_VERSION,
    }),
  });
  return res.json();
};

const fetchJSON = async url => {
  const res = await fetch(url);
  return res.json();
};

export default Emulator;
export { useEmulatorState, useEmulatorDispatch };
