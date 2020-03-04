// @flow

import React, { useEffect, useReducer, useMemo, memo } from "react";
import invariant from "invariant";
import { Link } from "react-router-dom";
import type Transport from "@ledgerhq/hw-transport";
import { Subject, empty, from, of, concat, Observable, throwError } from "rxjs";
import { DisconnectedDevice } from "@ledgerhq/errors";
import installOsuFirmware from "@ledgerhq/live-common/lib/hw/installOsuFirmware";
import ManagerAPI from "@ledgerhq/live-common/lib/api/Manager";
import {
  concatMap,
  map,
  take,
  catchError,
  retryWhen,
  filter,
  delay,
} from "rxjs/operators";
import { FaArrowRight, FaCheck, FaHourglassHalf } from "react-icons/fa";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import { withDevicePolling } from "@ledgerhq/live-common/lib/hw/deviceAccess";

import Timeline, { TimelineStop } from "components/base/Timeline";
import { remapError } from "utils/errors";
import Box from "components/base/Box";
import Button from "components/base/Button";
import Text from "components/base/Text";
import { getTransitionTo } from "device/update/registry";
import type {
  VaultUpdatePlan,
  VaultUpdatePlanStep,
} from "device/update/registry";
import type { FirmDevice } from "components/Updater";
import LedgerBlue from "components/LedgerBlue";
import { DashBoard } from "components/LedgerBlue/screens";
import { transitions } from "components/UpdateDevice";
import UpdateStepDesc from "./UpdateStepDesc";
import UpdateStep from "./UpdateStep";
import { Container } from "./components";

const targetId = 0x31010004;
const perso = "perso_11";

const DEMO_DELAY = 1;

type Props = {|
  plan: VaultUpdatePlan,
  currentFirmware: FirmDevice,
  isDemoMode?: boolean,
|};

export const SUBSTEPS = {
  OSU: "osu",
  REBOOT_OSU: "reboot-osu",
  FINAL: "final",
  REBOOT_FINAL: "reboot-final",
  APP: "app",
};

const genSubstep = (type: TypeStep, isOnOsu?: boolean): SubStep => ({
  type,
  isRunning: false,
  isDone: [SUBSTEPS.OSU, SUBSTEPS.REBOOT_OSU].includes(type) && !!isOnOsu,
  progress: 0,
});

const FIRMWARE_UPDATE_SUBSTEPS = [
  SUBSTEPS.OSU,
  SUBSTEPS.REBOOT_OSU,
  SUBSTEPS.FINAL,
  SUBSTEPS.REBOOT_FINAL,
];

export const resumeSubject$ = new Subject<{ type: "click" }>();

const buildPlanStatus = (
  plan: VaultUpdatePlan,
  currentFirmware: FirmDevice,
): VaultUpdatePlanStatus =>
  plan.map(step => ({
    isRunning: false,
    isDone: false,
    substeps:
      step.type === "app"
        ? [genSubstep("app")]
        : FIRMWARE_UPDATE_SUBSTEPS.map(type =>
            genSubstep(type, currentFirmware.isOSU),
          ),
  }));

const reducer = (state, action) => {
  const { type } = action;
  if (type === "CLEAR_ERROR") {
    return { ...state, error: null };
  }
  if (type === "ERROR") {
    // we set all the progress to 0
    return {
      ...state,
      error: action.payload.error,
      planStatus: state.planStatus.map(stepStatus => ({
        ...stepStatus,
        substeps: stepStatus.substeps.map(sub => ({ ...sub, progress: 0 })),
      })),
    };
  }
  if (type === "RESET") {
    return {
      plan: action.payload,
      planStatus: buildPlanStatus(action.payload, action.currentFirmware),
      error: null,
    };
  }
  if (type === "UPDATE") {
    if (!state || !state.plan || !state.planStatus || !action.payload)
      return state;
    const { step, data } = action.payload;
    const stepIndex = state.plan.indexOf(step);

    const subStepIndex =
      "substep" in data
        ? state.planStatus[stepIndex].substeps.findIndex(
            s => s.type === data.substep,
          )
        : -1;
    return {
      ...state,
      error: null,
      planStatus: state.planStatus.map((stepStatus, i) => ({
        ...stepStatus,
        isRunning: i === stepIndex,
        isDone: i < stepIndex,
        substeps: stepStatus.substeps.map((sub, j) => ({
          ...sub,
          isRunning: subStepIndex === j,
          isDone: subStepIndex > -1 && subStepIndex > j,
          isRequestingPermission:
            stepIndex === i &&
            subStepIndex === j &&
            data.type === "device-permission-requested",
          progress:
            stepIndex === i && subStepIndex === j && "progress" in data
              ? data.progress
              : sub.progress,
        })),
      })),
    };
  }
  if (type === "FINISH") {
    if (!state || !state.planStatus) return state;

    const { planStatus } = state;
    // update last step status to isDone
    return {
      ...state,
      planStatus: planStatus.map(stepStatus => {
        if (stepStatus !== planStatus[planStatus.length - 1]) return stepStatus;
        // return stepStatus;
        return { ...stepStatus, isRunning: false, isDone: true };
      }),
    };
  }
  return state;
};

let _sub = null;

type TypeStep = $Values<typeof SUBSTEPS>;
export type SubStep = {
  type: TypeStep,
  isRunning: boolean,
  isDone: boolean,
  isRequestingPermission?: boolean,
  progress?: number,
};
export type VaultUpdatePlanStepStatus = {
  isRunning: boolean,
  isDone: boolean,
  substeps: Array<SubStep>,
};
export type VaultUpdatePlanStatus = VaultUpdatePlanStepStatus[];
type State = {
  error: *,
  plan: VaultUpdatePlan,
  planStatus: VaultUpdatePlanStatus,
};

type Action = Object;
const UpdatePlan = (props: Props) => {
  const { plan: _plan, isDemoMode } = props;
  const [state, dispatch] = useReducer<State, Action>(reducer, {
    plan: _plan,
    error: null,
    planStatus: buildPlanStatus(_plan, props.currentFirmware),
  });

  const $plan = usePlan(_plan, props.currentFirmware, isDemoMode);

  useUnsubOnUnmount();
  useResetOnPlanChange(_plan, dispatch, props.currentFirmware);

  const handleStart = () =>
    (_sub = $plan.subscribe(action => {
      dispatch(action);
    }));

  if (!state || !state.planStatus || !state.plan) return null;

  const { planStatus, plan } = state;
  const isNotStarted = !planStatus[0].isRunning && !planStatus[0].isDone;

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };
  const resetState = () => {
    dispatch({ type: "RESET" });
  };
  return (
    <Timeline>
      <StartStep plan={plan} isActive={isNotStarted} onStart={handleStart} />

      {plan &&
        plan.map((step, i) => (
          <UpdateStep
            key={getStepKey(step)}
            step={step}
            status={planStatus[i]}
            onClearError={clearError}
            subject={resumeSubject$}
            error={state.error}
            onResetState={resetState}
          />
        ))}
      <EndStep finished={planStatus[planStatus.length - 1].isDone} />
    </Timeline>
  );
};

const usePlan = (
  plan: VaultUpdatePlan,
  currentFirmware: FirmDevice,
  isDemoMode,
) => {
  return useMemo(() => buildPlanObservable(plan, currentFirmware, isDemoMode), [
    plan,
    currentFirmware,
    isDemoMode,
  ]);
};

export const buildPlanObservable = (
  plan: VaultUpdatePlan,
  currentFirmware: FirmDevice,
  isDemoMode?: boolean,
): Observable<*> => {
  return concat(
    from(plan).pipe(
      concatMap(step => {
        const remapStep = map(e =>
          e.error
            ? { type: "ERROR", payload: { step, error: e.error } }
            : { type: "UPDATE", payload: { step, data: e } },
        );

        if (step.type === "firm") {
          if (currentFirmware.isOSU) {
            return installFinal(step.transition).pipe(remapStep);
          }
          return concat(
            installOSU(step.transition, isDemoMode),
            installFinal(step.transition, isDemoMode),
          ).pipe(remapStep);
        }
        return updateApp(step.app, isDemoMode).pipe(remapStep);
      }),
    ),
    of({ type: "FINISH" }),
  ).pipe(
    catchError(error => {
      return of({ type: "FINISH", error });
    }),
  );
};

const StartStep = ({
  plan,
  onStart,
  isActive,
}: {|
  plan: VaultUpdatePlan,
  onStart: () => any,
  isActive: boolean,
|}) => {
  const handleClick = async () => {
    await new Promise(r => setTimeout(r, 300));
    onStart();
  };
  return (
    <TimelineStop
      bulletVariant="plain"
      bulletSize="small"
      Icon={isActive ? FaArrowRight : FaCheck}
      bar="bot"
    >
      {isActive ? (
        <Container>
          <Box horizontal flow={20} align="flex-start">
            <Box width={180} noShrink>
              <LedgerBlue size={"small"}>
                <DashBoard />
              </LedgerBlue>
            </Box>

            <Box>
              <Box>
                <Text fontWeight="bold">Your device need to be updated</Text>
                <Text>
                  <ul>
                    {plan.map(step => (
                      <li key={getStepKey(step)}>
                        <UpdateStepDesc step={step} />
                      </li>
                    ))}
                  </ul>
                </Text>
              </Box>
            </Box>
          </Box>
          <Box mt={20}>
            <Text>
              The process will take approximatively{" "}
              <strong>{getNbMinutes(plan)}&nbsp;minutes</strong>.
            </Text>
          </Box>
          <Box mt={20} style={{ width: "100%" }} align="flex-end">
            <Button type="filled" onClick={handleClick}>
              Start
            </Button>
          </Box>
        </Container>
      ) : (
        <Text fontWeight="bold">Your device need to be updated</Text>
      )}
    </TimelineStop>
  );
};

const useUnsubOnUnmount = () => {
  useEffect(() => {
    return () => {
      _sub && _sub.unsubscribe();
    };
  }, []);
};

const useResetOnPlanChange = (plan, dispatch, currentFirmware) => {
  useEffect(() => {
    dispatch({ type: "RESET", payload: plan, currentFirmware });
    return () => {
      _sub && _sub.unsubscribe();
    };
  }, [plan, dispatch, currentFirmware]);
};

const getNbMinutes = (plan: VaultUpdatePlan) =>
  plan.reduce((acc, cur) => acc + (cur.type === "app" ? 2 : 5), 0);

const EndStep = ({ finished }: { finished: boolean }) => (
  <>
    <TimelineStop
      bulletSize="small"
      Icon={finished ? FaCheck : FaHourglassHalf}
      bar="top"
      bulletVariant={finished ? "plain" : "dashed"}
    >
      {!finished ? (
        <div>
          <strong>Device is ready</strong>
        </div>
      ) : (
        <Container>
          <Box flow={20}>
            <Box>
              <Text fontWeight="bold" i18nKey="update:steps.ready" />
              <Text i18nKey="update:steps.ready-to-login" />
            </Box>

            <Button size="small" type="link">
              <Link to="/">Login</Link>
            </Button>
          </Box>
        </Container>
      )}
    </TimelineStop>
  </>
);

const getStepKey = (step: VaultUpdatePlanStep) => {
  if (step.type === "app") return `app_${step.app.version}`;
  return `firm_${step.transition.from.version}`;
};

export default memo<Props>(UpdatePlan);

const mapSubstep = substep => map(v => ({ substep, ...v }));

// emit the error so we can use it in react land
// throw just after so the flow interrupts
// wait for a click before retrying
const retryOnClick = (obs: Observable<*>) => {
  // $FlowFixMe I have no idea
  return obs.pipe(
    catchError(error => {
      const errorRemaped = remapError(error);
      if (error instanceof DisconnectedDevice) {
        return empty();
      }
      return concat(of({ error: errorRemaped }), throwError(errorRemaped));
    }),
    retryWhen(err => {
      return err.pipe(
        concatMap(error => {
          if (error instanceof DisconnectedDevice) {
            return throwError(error);
          }
          return resumeSubject$.pipe(take(1));
        }),
      );
    }),
  );
};

// determine whether we should retry or not
const onDeviceError = () => {
  return false;
};

const waitForDeviceInfo = () => {
  return retryOnClick(
    withDevicePolling("webusb")(
      transport => from(getDeviceInfo(transport)),
      onDeviceError,
    ),
  );
};
// wait for a click on subject$
const waitReboot = (substep, isDemoMode) =>
  isDemoMode
    ? // $FlowFixMe
      concat(of({ type: "start" }), resumeSubject$.pipe(take(1))).pipe(
        filter(e => e.type === "start" || e.type === "click"),
        mapSubstep(substep),
      )
    : concat(
        of({ type: "start" }),
        resumeSubject$.pipe(take(1)),
        waitForDeviceInfo(),
      ).pipe(
        filter(e => e.type === "start" || e.type === "click"),
        mapSubstep(substep),
      );

const run = (
  {
    job,
    toMap,
    waitRebootBefore,
    waitRebootAfter,
    extraParams,
  }: {
    job: (
      transport: Transport<*>,
      targetId: number | string,
      extraParams?: Object,
    ) => Observable<any>,
    toMap: Function,
    waitRebootBefore?: string,
    waitRebootAfter?: string,
    extraParams: Object,
  },
  isDemoMode?: boolean,
) => {
  if (isDemoMode) {
    return retryOnClick(
      concat(
        waitRebootBefore ? waitReboot(waitRebootBefore, isDemoMode) : of(null),
        fakeProgress().pipe(
          catchError(e =>
            e instanceof DisconnectedDevice ? empty() : throwError(e),
          ),
        ),
        waitRebootAfter ? waitReboot(waitRebootAfter, isDemoMode) : of(null),
      ).pipe(mapSubstep(toMap)),
    );
  }

  return retryOnClick(
    // $FlowFixMe i don't have any ida
    concat(
      waitRebootBefore ? waitReboot(waitRebootBefore, isDemoMode) : of(null),
      withDevicePolling("webusb")(
        transport =>
          concat(job(transport, targetId, extraParams)).pipe(
            catchError(e =>
              e instanceof DisconnectedDevice ? empty() : throwError(e),
            ),
          ),
        onDeviceError,
      ),
      waitRebootAfter ? waitReboot(waitRebootAfter, isDemoMode) : of(null),
    ).pipe(mapSubstep(toMap)),
  );
};

const installOSU = (transition, isDemoMode) => {
  const expectedFirmSanitized = transition.to.version.replace(/-/g, "_");
  const firmware = `blue/${transition.to.version}/fw_${transition.from.version}/upgrade_osu_${expectedFirmSanitized}`;

  return run(
    {
      // $FlowFixMe we know it's not the exact object expected by ll-common
      job: installOsuFirmware,
      extraParams: {
        firmware,
        firmware_key: `${firmware}_key`,
        perso,
      },
      toMap: SUBSTEPS.OSU,
      waitRebootAfter: SUBSTEPS.REBOOT_OSU,
    },
    isDemoMode,
  );
};

const installFinal = (transition, isDemoMode) => {
  // do_install_firm "blue/${EXPECTED_FIRMWARE}/fw_${CURRENT_FIRMWARE}/upgrade_${EXPECTED_FIRMWARE_SANITIZED}"

  const transitionFrom = getTransitionTo(transition.to.version, transitions);
  invariant(
    transitionFrom,
    `couldn't find transition for ${transition.to.version}`,
  );
  const expectedFirmSanitized = transition.to.version.replace(/-/g, "_");
  const firmware = `blue/${transition.to.version}/fw_${transitionFrom.from.version}/upgrade_${expectedFirmSanitized}`;

  const installFinalJob = (transport, targetId, extraParams) =>
    ManagerAPI.install(
      transport,
      "firmware",
      { ...extraParams, targetId },
      false,
    );

  return run(
    {
      // $FlowFixMe we know it's not the exact object expected by ll-common
      job: installFinalJob,
      extraParams: {
        firmware,
        firmwareKey: `${firmware}_key`,
        perso,
      },
      toMap: SUBSTEPS.FINAL,
      waitRebootAfter: SUBSTEPS.REBOOT_FINAL,
    },
    isDemoMode,
  );
};

const fakeProgress = () =>
  concat(
    ...[...Array(97).keys()].map(i =>
      // $FlowFixMe
      of({ progress: i / 100 }).pipe(delay(DEMO_DELAY)),
    ),
    throwError(new DisconnectedDevice()),
  );

const updateApp = (app, isDemoMode) => {
  const installAppJob = (transport, targetId, extraParams) =>
    ManagerAPI.install(
      transport,
      "install-app",
      { ...extraParams, targetId },
      false,
    );
  return run(
    {
      // $FlowFixMe we know it's not the exact object expected by ll-common
      job: installAppJob,
      extraParams: {
        perso,
        hash: "",
        firmware: `blue/${app.firmware.version}/vault/app_${app.version}`,
        firmwareKey: `blue/${app.firmware.version}/vault/app_${app.version}_key`,
        delete: `blue/${app.firmware.version}/vault/app_${app.version}_del`,
        deleteKey: `blue/${app.firmware.version}/vault/app_${app.version}_del_key`,
      },
      toMap: SUBSTEPS.APP,
    },
    isDemoMode,
  );
};
