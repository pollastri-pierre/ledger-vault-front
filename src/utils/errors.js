// @flow
import { createCustomErrorClass } from "@ledgerhq/errors/lib/helpers";
import { StatusCodes } from "@ledgerhq/hw-transport";

export const GenericError = createCustomErrorClass("GenericError");
export const UnknownDomain = createCustomErrorClass("UnknownDomain");
export const ApprovalsExceedQuorum = createCustomErrorClass(
  "ApprovalsExceedQuorum",
);

// device related error
export const InvalidDataDevice = createCustomErrorClass("InvalidDataDevice");
export const NoChannelForDevice = createCustomErrorClass("NoChannelForDevice");
export const UnknownDevice = createCustomErrorClass("UnknownDevice");
export const OutOfDateApp = createCustomErrorClass("OutOfDateApp");

export type DeviceError = {
  statusCode: $Values<typeof StatusCodes>,
};

// send errors
export const InvalidAddress = createCustomErrorClass("InvalidAddress");
export const AddressShouldNotBeSegwit = createCustomErrorClass(
  "AddressShouldNotBeSegwit",
);
export const AmountTooHigh = createCustomErrorClass("AmountTooHigh");
export const AmountExceedMax = createCustomErrorClass("AmountExceedMax");
export const NonEIP55Address = createCustomErrorClass("NonEIP55Address");
export const RippleAmountExceedMinBalance = createCustomErrorClass(
  "RippleAmountExceedMinBalance",
);
export const UserInvitationAlreadyUsed = createCustomErrorClass(
  "UserInvitationAlreadyUsed",
);

export const NetworkTimeoutError = createCustomErrorClass(
  "NetworkTimeoutError",
);

export const DeviceNotOnDashboard = createCustomErrorClass(
  "DeviceNotOnDashboard",
);
export const TargetXRPNotActive = createCustomErrorClass("tecNO_DST_INSUF_XRP");

export function remapError(err: Error) {
  // $FlowFixMe
  if (err.statusCode === 0x6020 || err.statusCode === 0x6701) {
    return new DeviceNotOnDashboard();
  }
  if (
    // $FlowFixMe
    err.json &&
    err.json.message &&
    err.json.message.includes("tecNO_DST_INSUF_XRP")
  ) {
    return new TargetXRPNotActive();
  }
  if (
    // $FlowFixMe
    err.json &&
    err.json.message &&
    err.json.message.includes("Not enough funds")
  ) {
    return new AmountTooHigh();
  }
  return err;
}
