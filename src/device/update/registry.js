// @flow

import minBy from "lodash/minBy";
import semver from "semver";

type VaultFirmware = {
  version: string,
  role: "ADMIN" | "OPERATOR",
  isDev: boolean,
  isOSU?: boolean,
};

export type VaultApp = {
  version: string,
  firmware: VaultFirmware,
};

export type VaultFirmwareTransition = {
  from: VaultFirmware,
  to: VaultFirmware,
};

type VaultUpdatePlanStepFirm = {
  type: "firm",
  transition: VaultFirmwareTransition,
};

type VaultUpdatePlanStepApp = {
  type: "app",
  app: VaultApp,
};

export type VaultUpdatePlanStep =
  | VaultUpdatePlanStepFirm
  | VaultUpdatePlanStepApp;

export type VaultUpdatePlan = VaultUpdatePlanStep[];

type TransitionTree = {
  firmware: VaultFirmware,
  children: TransitionTree[],
};

export const parseRawFirmware = (rawFirmware: string): VaultFirmware => {
  const version = rawFirmware.trim();
  const rest = version.split("-")[1];
  if (!rest) {
    throw new Error(`Invalid firmware format: ${version}`);
  }
  const isAdmin = /^eed?$/.test(rest);
  const isOperator = /^eeld?$/.test(rest);
  const role = isAdmin ? "ADMIN" : isOperator ? "OPERATOR" : null;
  if (!role) {
    throw new Error(`Cannot determine role from firmware: ${version}`);
  }
  const isDev = /^eel?d$/.test(rest);
  return { version, role, isDev };
};

export const parseRawTransition = (
  rawTransition: string,
): VaultFirmwareTransition => {
  const [from, to] = rawTransition
    .split("=>")
    .map(el => parseRawFirmware(el.trim()));
  return { from, to };
};

export const parseRawApp = (rawApp: string): VaultApp => {
  const [firm, app] = rawApp.split(/ +app_/);
  if (!firm || !app) {
    throw new Error(`Invalid format for app: ${rawApp}`);
  }
  return { version: app, firmware: parseRawFirmware(firm) };
};

const parseRawPlanStep = (rawPlanStep: string): VaultUpdatePlanStep => {
  const [type, payload] = rawPlanStep.split(":");
  if (type === "firm") {
    return { type: "firm", transition: parseRawTransition(payload) };
  }
  if (type === "app") {
    return { type: "app", app: parseRawApp(payload) };
  }
  throw new Error(`Invalid format for plan step: ${rawPlanStep}`);
};

export const parseRawPlan = (rawPlan: string[]): VaultUpdatePlan => {
  return rawPlan.map(parseRawPlanStep);
};

export const getTransitionTo = (
  firmVersion: string,
  transitions: VaultFirmwareTransition[],
): VaultFirmwareTransition | null => {
  const matching = transitions.filter(t => t.to.version === firmVersion);
  if (!matching.length) return null;
  matching.sort((a, b) => (semver.gt(a.from.version, b.from.version) ? -1 : 1));
  return matching[0];
};

export const getUpdatePlan = ({
  expectedApp: expectedRawApp,
  currentFirmware: currentRawFirmware,
  transitions,
  apps,
  isOSU,
}: {
  expectedApp: string,
  currentFirmware: string,
  transitions: VaultFirmwareTransition[],
  apps: VaultApp[],
  isOSU?: boolean,
}): VaultUpdatePlan => {
  const expectedApp = parseRawApp(
    `${currentRawFirmware} app_${expectedRawApp}`,
  );
  const currentFirmware = parseRawFirmware(currentRawFirmware);
  const availableApps = apps.filter(app => {
    if (app.version !== expectedApp.version) return false;
    const { firmware } = app;
    if (firmware.role !== currentFirmware.role) return false;
    return true;
  });

  // we always want the latest firmware that has the app
  availableApps.sort((a, b) =>
    semver.gt(a.firmware.version, b.firmware.version) ? -1 : 1,
  );

  if (!availableApps.length) {
    throw new Error(`Could not find available app ${expectedRawApp}`);
  }

  const [appToInstall] = availableApps;
  const firmToInstall = appToInstall.firmware;

  const appStep = { type: "app", app: appToInstall };

  if (firmToInstall.version === currentFirmware.version && !isOSU) {
    return [appStep];
  }

  const transitionsToApply = findTransitions(
    { from: currentFirmware, to: firmToInstall, isOSU },
    transitions,
  );

  if (!transitionsToApply.length) {
    throw new Error(
      `Could not find firmware transition from ${currentFirmware.version} to ${firmToInstall.version}`,
    );
  }

  return [
    ...transitionsToApply.map(transition => ({ type: "firm", transition })),
    appStep,
  ];
};

const buildTransitionTree = (
  from: VaultFirmware,
  transitions: VaultFirmwareTransition[],
): TransitionTree => {
  return {
    firmware: from,
    children: transitions
      .filter(transition => transition.from.version === from.version)
      .map(transition => buildTransitionTree(transition.to, transitions)),
  };
};

const getAllPaths = (
  node: TransitionTree,
  target: VaultFirmware,
  path?: string[] = [],
  all?: Array<string[]> = [],
): Array<string[]> => {
  if (node.children.length === 0 || node.firmware.version === target.version) {
    all.push([...path, node.firmware.version]);
  } else {
    node.children.forEach(n =>
      getAllPaths(n, target, [...path, node.firmware.version], all),
    );
  }
  return all;
};

const findTransitions = (
  {
    from,
    to,
    isOSU,
  }: { from: VaultFirmware, to: VaultFirmware, isOSU?: boolean },
  transitions: VaultFirmwareTransition[],
): VaultFirmwareTransition[] => {
  const tree = buildTransitionTree(from, transitions);
  const paths = getAllPaths(tree, to);
  const validPaths = paths.filter(p => p.includes(to.version));
  const shortestPath = minBy(validPaths, p => p.length);
  return shortestPath.reduce((acc, cur, i) => {
    const next = shortestPath[i + 1];
    if (isOSU && from.version === cur) {
      acc.push(parseRawTransition(`${cur} => ${cur}`));
    }
    if (next) {
      acc.push(parseRawTransition(`${cur} => ${next}`));
    }
    return acc;
  }, []);
};
