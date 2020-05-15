// @flow

import { UserRefusedFirmwareUpdate } from "@ledgerhq/errors";

// $FlowFixMe it's a mock
import { _setupInstallOsuFirmMock } from "@ledgerhq/live-common/lib/hw/installOsuFirmware";
import {
  // $FlowFixMe it's a mock
  _setupInstallFinalFirmMock,
  // $FlowFixMe it's a mock
  _setupInstallAppMock,
} from "@ledgerhq/live-common/lib/api/Manager";

import {
  getUpdatePlan,
  parseRawApp,
  parseRawTransition,
} from "device/update/registry";
import { buildPlanObservable, resumeSubject$ } from "./UpdatePlan";

describe("Updater > usePlan", () => {
  it("should install an app", (done) => {
    const app = parseRawApp("2.2.7-ee app_3.0.9");
    const plan = getUpdatePlan({
      expectedApp: "3.0.9",
      currentFirmware: "2.2.7-ee",
      transitions: [],
      apps: [app],
    });

    const $plan = buildPlanObservable(plan, { version: "2.2.7-ee" });

    _setupInstallAppMock((o) => {
      o.next({ progress: 0.1 });
      o.next({ progress: 0.5 });
      o.next({ progress: 0.9 });
      o.complete();
    });

    const expected = [
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.5 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.9 },
        },
      },
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      { type: "FINISH" },
    ];

    testEvents($plan, expected, done);
  });

  it("should install an app and handle error & retry", (done) => {
    const app = parseRawApp("2.2.7-ee app_3.0.9");
    const plan = getUpdatePlan({
      expectedApp: "3.0.9",
      currentFirmware: "2.2.7-ee",
      transitions: [],
      apps: [app],
    });

    const $plan = buildPlanObservable(plan, { version: "2.2.7-ee" });

    _setupInstallAppMock((o) => {
      o.next({ progress: 0.1 });
      o.next({ progress: 0.5 });
      o.error("Oops");
    });

    const expected = [
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.5 },
        },
      },
      { type: "ERROR", payload: { step: { type: "app", app }, error: "Oops" } },
      () => {
        _setupInstallAppMock((o) => {
          o.next({ progress: 0.1 });
          o.next({ progress: 0.5 });
          o.complete();
        });
      },
      () => clickResume(),
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.5 },
        },
      },
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      { type: "FINISH" },
    ];

    testEvents($plan, expected, done);
  });

  it("should not install OSU if device is already in OSU", (done) => {
    const app = parseRawApp("2.2.7-ee app_3.0.9");
    const transition = parseRawTransition("2.2.6-ee => 2.2.7-ee");
    const plan = getUpdatePlan({
      expectedApp: "3.0.9",
      currentFirmware: "2.2.6-ee",
      transitions: [transition],
      apps: [app],
    });

    const $plan = buildPlanObservable(plan, {
      version: "2.2.6-ee",
      isOSU: true,
    });

    _setupInstallFinalFirmMock((o) => {
      o.next({ progress: 0.1 });
      o.next({ progress: 0.899999 });
      o.next({ progress: 0.9 });
      o.complete();
    });

    _setupInstallAppMock((o) => {
      o.next({ progress: 0.1 });
      o.next({ progress: 0.5 });
      o.next({ progress: 0.9 });
      o.complete();
    });

    const expected = [
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final", progress: 0.899999 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final", progress: 0.9 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-final", type: "start" },
        },
      },
      () => clickResume(),
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-final", type: "click" },
        },
      },
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.5 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.9 },
        },
      },
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      { type: "FINISH" },
    ];

    testEvents($plan, expected, done);
  });

  it("should install a firmware then an app", (done) => {
    const app = parseRawApp("2.2.7-ee app_3.0.9");
    const transition = parseRawTransition("2.2.6-ee => 2.2.7-ee");
    const plan = getUpdatePlan({
      expectedApp: "3.0.9",
      currentFirmware: "2.2.6-ee",
      transitions: [transition],
      apps: [app],
    });

    const $plan = buildPlanObservable(plan, { version: "2.2.6-ee" });

    _setupInstallOsuFirmMock((o) => {
      o.next({ progress: 0.1 });
      o.next({ progress: 0.9 });
      o.complete();
    });

    _setupInstallFinalFirmMock((o) => {
      o.next({ progress: 0.1 });
      o.next({ progress: 0.899999 });
      o.next({ progress: 0.9 });
      o.complete();
    });

    _setupInstallAppMock((o) => {
      o.next({ progress: 0.1 });
      o.next({ progress: 0.5 });
      o.next({ progress: 0.9 });
      o.complete();
    });

    const expected = [
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "osu" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "osu", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "osu", progress: 0.9 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-osu", type: "start" },
        },
      },
      () => clickResume(),
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-osu", type: "click" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final", progress: 0.899999 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final", progress: 0.9 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-final", type: "start" },
        },
      },
      () => clickResume(),
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-final", type: "click" },
        },
      },
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.1 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.5 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app", progress: 0.9 },
        },
      },
      {
        type: "UPDATE",
        payload: { step: { type: "app", app }, data: { substep: "app" } },
      },
      { type: "FINISH" },
    ];

    testEvents($plan, expected, done);
  });

  it("should correctly handle deny firmware update by user", (done) => {
    const app = parseRawApp("2.2.7-ee app_3.0.9");
    const transition = parseRawTransition("2.2.6-ee => 2.2.7-ee");
    const plan = getUpdatePlan({
      expectedApp: "3.0.9",
      currentFirmware: "2.2.6-ee",
      transitions: [transition],
      apps: [app],
    });

    const $plan = buildPlanObservable(plan, { version: "2.2.6-ee" });

    _setupInstallOsuFirmMock((o) => {
      o.error(new UserRefusedFirmwareUpdate());
    });
    _setupInstallFinalFirmMock((o) => o.complete());
    _setupInstallAppMock((o) => o.complete());

    const expected = [
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "osu" },
        },
      },
      {
        type: "ERROR",
        payload: {
          step: { type: "firm", transition },
          error: new UserRefusedFirmwareUpdate(),
        },
      },
      () => {
        _setupInstallOsuFirmMock((o) => {
          o.next({ progress: 0.9 });
          o.complete();
        });
      },
      () => clickResume(),
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "osu" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "osu", progress: 0.9 },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-osu", type: "start" },
        },
      },
      () => clickResume(),
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-osu", type: "click" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "final" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-final", type: "start" },
        },
      },
      () => clickResume(),
      {
        type: "UPDATE",
        payload: {
          step: { type: "firm", transition },
          data: { substep: "reboot-final", type: "click" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app" },
        },
      },
      {
        type: "UPDATE",
        payload: {
          step: { type: "app", app },
          data: { substep: "app" },
        },
      },
      {
        type: "FINISH",
      },
    ];

    testEvents($plan, expected, done);
  });
});

const testEvents = ($plan, expected, done) => {
  let i = 0;
  $plan.subscribe({
    next: (val) => {
      const cur = expected[i];
      expect(val).toEqual(cur);
      while (expected[i + 1] && typeof expected[i + 1] === "function") {
        const cb = expected[i + 1];
        // $FlowFixMe
        setImmediate(cb);
        i++;
      }
      i++;
    },
    complete: () => {
      done();
    },
  });
};

const clickResume = () => {
  resumeSubject$.next({ type: "click" });
};
