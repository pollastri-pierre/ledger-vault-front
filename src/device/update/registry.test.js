import {
  parseRawTransition,
  parseRawFirmware,
  parseRawApp,
  parseRawPlan,
  getUpdatePlan,
  getTransitionTo,
} from "./registry";
import { FIRMWARE_TRANSITIONS_RAW, APPS_RAW } from "./data";

describe("Update registry", () => {
  describe("parseRawFirmware", () => {
    it("parse a raw firmware", () => {
      const cases = [
        ["2.2.1-ee", { version: "2.2.1-ee", role: "ADMIN", isDev: false }],
        ["2.2.4-eel", { version: "2.2.4-eel", role: "OPERATOR", isDev: false }],
        ["2.2.4-eed", { version: "2.2.4-eed", role: "ADMIN", isDev: true }],
      ];
      cases.forEach(([raw, expected]) => {
        expect(parseRawFirmware(raw)).toEqual(expected);
      });
    });

    it("throw if invalid format", () => {
      const fn = () => parseRawFirmware("2.1.1");
      expect(fn).toThrow("Invalid firmware format: 2.1.1");
    });

    it("throw if can't determine role", () => {
      const fn = () => parseRawFirmware("2.1.1-ae");
      expect(fn).toThrow("Cannot determine role from firmware: 2.1.1-ae");
    });
  });

  describe("parseRawTransition", () => {
    it("parse a raw transition", () => {
      const actual = parseRawTransition("2.2.4-ee => 2.2.6-ee");
      const expected = {
        from: parseRawFirmware("2.2.4-ee"),
        to: parseRawFirmware("2.2.6-ee"),
      };
      expect(actual).toEqual(expected);
    });

    it("throw if invalid format", () => {
      const fn = () => parseRawTransition("=> mama !");
      expect(fn).toThrow();
    });
  });

  describe("parseRawApp", () => {
    it("parse a raw app", () => {
      const actual = parseRawApp("2.2.7-eeld app_3.0.9-dev");
      const expected = {
        version: "3.0.9-dev",
        firmware: parseRawFirmware("2.2.7-eeld"),
      };
      expect(actual).toEqual(expected);
    });
    it("throw if invalid format", () => {
      const fn = () => parseRawApp("2.2.7-eeld ye_3.0.9-dev");
      expect(fn).toThrow("Invalid format for app: 2.2.7-eeld ye_3.0.9-dev");
    });
  });

  describe("validate real world data", () => {
    it("contains valid firmware transitions", () => {
      FIRMWARE_TRANSITIONS_RAW.forEach(rawTransition => {
        const fn = () => parseRawTransition(rawTransition);
        expect(fn).not.toThrow();
      });
    });

    it("contains valid apps", () => {
      APPS_RAW.forEach(rawApp => {
        const fn = () => parseRawApp(rawApp);
        expect(fn).not.toThrow();
      });
    });
  });

  describe("getUpdatePlan", () => {
    it("basic app install", () => {
      const params = {
        expectedApp: "8.0.0",
        currentFirmware: "1.0.0-ee",
      };

      const transitions = [
        "1.0.0-ee => 2.0.0-ee",
        "2.0.0-ee => 3.0.0-ee",
        "3.0.0-ee => 3.0.1-ee",
      ];

      const apps = ["1.0.0-ee app_8.0.0", "2.0.0-ee app_8.1.4"];

      const expected = ["app:  1.0.0-ee app_8.0.0"];

      const plan = getUpdatePlan({
        ...params,
        transitions: transitions.map(parseRawTransition),
        apps: apps.map(parseRawApp),
      });

      expect(plan).toEqual(parseRawPlan(expected));
    });

    it("find a basic plan", () => {
      const params = {
        expectedApp: "8.0.0",
        currentFirmware: "1.0.0-ee",
      };

      const transitions = [
        "1.0.0-ee => 2.0.0-ee",
        "2.0.0-ee => 3.0.0-ee",
        "3.0.0-ee => 3.0.1-ee",
      ];

      const apps = [
        "1.0.0-ee app_7.0.0",
        "2.0.0-ee app_8.0.0",
        "2.0.0-ee app_8.1.4",
      ];

      const expected = [
        "firm: 1.0.0-ee => 2.0.0-ee",
        "app:  2.0.0-ee app_8.0.0",
      ];

      const plan = getUpdatePlan({
        ...params,
        transitions: transitions.map(parseRawTransition),
        apps: apps.map(parseRawApp),
      });

      expect(plan).toEqual(parseRawPlan(expected));
    });

    it("find a more complex path with only admin firms", () => {
      const params = {
        expectedApp: "8.0.0",
        currentFirmware: "1.0.0-ee",
      };

      const transitions = [
        "1.0.0-ee => 2.0.0-ee",
        "2.0.0-ee => 4.0.0-ee",
        "2.0.0-ee => 2.0.5-ee",
        "2.0.5-ee => 3.0.0-ee",
        "2.0.0-ee => 3.0.0-ee",
        "3.0.0-ee => 4.0.0-ee",
      ];

      const apps = ["3.0.0-ee app_8.0.0"];

      const expected = [
        "firm: 1.0.0-ee => 2.0.0-ee",
        "firm: 2.0.0-ee => 3.0.0-ee",
        "app:  3.0.0-ee app_8.0.0",
      ];

      const plan = getUpdatePlan({
        ...params,
        transitions: transitions.map(parseRawTransition),
        apps: apps.map(parseRawApp),
      });

      expect(plan).toEqual(parseRawPlan(expected));
    });

    it("should not try to convert firmware role", () => {
      const params = {
        expectedApp: "8.0.0",
        currentFirmware: "1.0.0-ee",
      };

      const transitions = [
        "1.0.0-ee => 1.0.1-ee",
        "1.0.0-ee => 2.0.0-eel",
        "1.0.1-ee => 2.0.0-ee",
      ];

      const apps = [
        "2.0.0-ee  app_8.0.0",
        "2.0.0-eel app_8.0.0",
        "3.0.0-eel app_9.0.0",
      ];

      const expected = [
        "firm: 1.0.0-ee => 1.0.1-ee",
        "firm: 1.0.1-ee => 2.0.0-ee",
        "app:  2.0.0-ee app_8.0.0",
      ];

      const plan = getUpdatePlan({
        ...params,
        transitions: transitions.map(parseRawTransition),
        apps: apps.map(parseRawApp),
      });

      expect(plan).toEqual(parseRawPlan(expected));
    });

    it("should handle device already in OSU", () => {
      const params = {
        expectedApp: "3.0.9-dev",
        currentFirmware: "2.2.6-ee",
      };

      const transitions = [
        "2.2.6-ee   => 2.2.7-ee",
        "2.2.6-eed  => 2.2.7-eed",
        "2.2.7-ee   => 2.2.7-eed",
        "2.2.7-eel  => 2.2.7-eeld",
      ];

      const apps = [
        "2.2.7-ee   app_2.0.9",
        "2.2.7-ee   app_3.0.9",
        "2.2.7-eed  app_3.0.9-dev",
        "2.2.7-eeld app_3.0.9-dev",
      ];

      const expected = [
        "firm: 2.2.6-ee => 2.2.6-ee",
        "firm: 2.2.6-ee => 2.2.7-ee",
        "firm: 2.2.7-ee => 2.2.7-eed",
        "app:  2.2.7-eed app_3.0.9-dev",
      ];

      const plan = getUpdatePlan({
        ...params,
        transitions: transitions.map(parseRawTransition),
        apps: apps.map(parseRawApp),
        isOSU: true,
      });

      expect(plan).toEqual(parseRawPlan(expected));
    });
    it("should convert to dev firmware", () => {
      const params = {
        expectedApp: "3.0.9-dev",
        currentFirmware: "2.2.7-eel",
      };

      const transitions = ["2.2.7-eel => 2.2.7-eeld"];

      const apps = ["2.2.7-eeld app_3.0.9-dev"];

      const expected = [
        "firm: 2.2.7-eel => 2.2.7-eeld",
        "app:  2.2.7-eeld app_3.0.9-dev",
      ];

      const plan = getUpdatePlan({
        ...params,
        transitions: transitions.map(parseRawTransition),
        apps: apps.map(parseRawApp),
      });

      expect(plan).toEqual(parseRawPlan(expected));
    });
    it("should choose the latest firmware for the same app", () => {
      const params = {
        expectedApp: "2.0.9",
        currentFirmware: "2.1.1-ee",
      };

      const transitions = [
        "2.1.1-ee => 2.2.4-ee",
        "2.2.4-ee => 2.2.5-ee",
        "2.2.5-ee => 2.2.6-ee",
      ];

      const apps = [
        "2.2.4-ee app_2.0.9",
        "2.2.5-ee app_2.0.9",
        "2.2.6-ee app_2.0.9",
      ];

      const expected = [
        "firm: 2.1.1-ee => 2.2.4-ee",
        "firm: 2.2.4-ee => 2.2.5-ee",
        "firm: 2.2.5-ee => 2.2.6-ee",
        "app:  2.2.6-ee app_2.0.9",
      ];

      const plan = getUpdatePlan({
        ...params,
        transitions: transitions.map(parseRawTransition),
        apps: apps.map(parseRawApp),
      });

      expect(plan).toEqual(parseRawPlan(expected));
    });
  });

  describe("getTransitionTo", () => {
    it("should find the latest transition to a given firm", () => {
      const transitions = ["2.2.6-ee => 2.2.7-eed", "2.2.7-ee => 2.2.7-eed"];
      const t = getTransitionTo(
        "2.2.7-eed",
        transitions.map(parseRawTransition),
      );
      expect(t).toEqual(parseRawTransition("2.2.7-ee => 2.2.7-eed"));
    });
  });
});
