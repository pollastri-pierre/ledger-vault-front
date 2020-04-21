// @flow
import { createCustomErrorClass } from "@ledgerhq/errors/lib/helpers";
import { StatusCodes } from "@ledgerhq/hw-transport";
import { INVALID_OR_MISSING_ATTESTATION } from "device";

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

// request related error
export const RequestFinished = createCustomErrorClass("RequestFinished");

export type DeviceError = {
  statusCode: $Values<typeof StatusCodes>,
};

// send errors
export const InvalidAddress = createCustomErrorClass("InvalidAddress");
export const AmountTooHigh = createCustomErrorClass("AmountTooHigh");
export const TooManyUTXOs = createCustomErrorClass("TooManyUTXOs");
export const AmountExceedMax = createCustomErrorClass("AmountExceedMax");
export const RippleAmountExceedMinBalance = createCustomErrorClass(
  "RippleAmountExceedMinBalance",
);
export const UserInvitationAlreadyUsed = createCustomErrorClass(
  "UserInvitationAlreadyUsed",
);

export const UserIdAlreadyUsed = createCustomErrorClass("UserIdAlreadyUsed");
export const NetworkTimeoutError = createCustomErrorClass(
  "NetworkTimeoutError",
);

export const DeviceNotOnDashboard = createCustomErrorClass(
  "DeviceNotOnDashboard",
);
export const TargetXRPNotActive = createCustomErrorClass("tecNO_DST_INSUF_XRP");
export const AddressDuplicateNameCurrency = createCustomErrorClass(
  "AddressDuplicateNameCurrency",
);
export const AddressDuplicateCurrencyAddress = createCustomErrorClass(
  "AddressDuplicateCurrencyAddress",
);
export const InvalidOrMissingAttestation = createCustomErrorClass(
  "InvalidOrMissingAttestation",
);

export const NoWorkspaceForDevice = createCustomErrorClass(
  "NoWorkspaceForDevice",
);
export const AccountNameAlreadyExists = createCustomErrorClass(
  "AccountNameAlreadyExists",
);

export function remapError(err: Error) {
  // $FlowFixMe
  if (err.statusCode === 0x6020 || err.statusCode === 0x6701) {
    return new DeviceNotOnDashboard();
  }
  if (err.statusCode === INVALID_OR_MISSING_ATTESTATION) {
    return new InvalidOrMissingAttestation();
  }
  if (jsonIncludes(err, "tecNO_DST_INSUF_XRP")) {
    return new TargetXRPNotActive();
  }
  if (jsonIncludes(err, "Not enough funds")) {
    return new AmountTooHigh();
  }
  if (jsonIncludes(err, "Action not implemented in this state")) {
    return new RequestFinished();
  }

  if (jsonIncludesRegex(err, /Model '[^']+' of type 'User' already exists/)) {
    return new UserIdAlreadyUsed();
  }
  if (jsonIncludes(err, "Account name already exists in this currency")) {
    return new AccountNameAlreadyExists();
  }
  return err;
}

function jsonIncludes(err: Error, msg: string) {
  // $FlowFixMe
  return err.json && err.json.message && err.json.message.includes(msg);
}

function jsonIncludesRegex(err: Error, regex: RegExp) {
  // $FlowFixMe
  return err.json && err.json.message && regex.test(err.json.message);
}

// code is intentionally defensive
export function extractErrorTitle(error: any): string {
  const title =
    error.json && (error.json.code || error.json.message)
      ? error.json.code && typeof error.json.code === "number"
        ? `Error ${error.json.code}`
        : error.json.message || "Unexpected error"
      : error.message
      ? error.message
      : "Error";
  return title || "Unexpected error";
}

export function extractErrorContent(
  error: any,
  defaultValue: ?string = "Unexpected error",
): string {
  return error.json ? error.json.message : error.message || defaultValue;
}
