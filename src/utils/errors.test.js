import { INVALID_OR_MISSING_ATTESTATION } from "device";

import {
  remapError,
  DeviceNotOnDashboard,
  InvalidOrMissingAttestation,
  TargetXRPNotActive,
  AmountTooHigh,
  RequestFinished,
  UserIdAlreadyUsed,
} from "./errors";

describe("/utils/errors", () => {
  describe("Cases based on status code ", () => {
    it("it should return Device Not On Dashboard Error", () => {
      expect(remapError({ statusCode: 0x6020 })).toEqual(
        new DeviceNotOnDashboard(),
      );
    });
    it("it should return Device Not On Dashboard Error", () => {
      expect(remapError({ statusCode: 0x6701 })).toEqual(
        new DeviceNotOnDashboard(),
      );
    });
    it("it should return Invalid Or Missing Attestation Error", () => {
      expect(
        remapError({ statusCode: INVALID_OR_MISSING_ATTESTATION }),
      ).toEqual(new InvalidOrMissingAttestation());
    });
  });

  describe("Cases based on error message content", () => {
    it("it should return Target XRP Not Active Error ", () => {
      expect(remapError({ json: { message: "tecNO_DST_INSUF_XRP" } })).toEqual(
        new TargetXRPNotActive(),
      );
    });

    it("it should return Amount Too High Error ", () => {
      expect(
        remapError({ json: { message: "There is Not enough funds" } }),
      ).toEqual(new AmountTooHigh());
    });

    it("it should return Request Finished Error ", () => {
      expect(
        remapError({
          json: { message: "Action not implemented in this state" },
        }),
      ).toEqual(new RequestFinished());
    });

    it("it should return User Id already used Error ", () => {
      expect(
        remapError({
          json: {
            message: "Model '0000100001ABC' of type 'User' already exists",
          },
        }),
      ).toEqual(new UserIdAlreadyUsed());
    });
  });
});
