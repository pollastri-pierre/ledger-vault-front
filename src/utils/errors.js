import { createCustomErrorClass } from "@ledgerhq/errors/lib/helpers";

export const GenericError = createCustomErrorClass("GenericError");
export const UnknownDomain = createCustomErrorClass("UnknownDomain");
export const ApprovalsExceedQuorum = createCustomErrorClass(
  "ApprovalsExceedQuorum"
);

// device related error
export const InvalidDataDevice = createCustomErrorClass("InvalidDataDevice");
export const NoChannelForDevice = createCustomErrorClass("NoChannelForDevice");
export const UnknownDevice = createCustomErrorClass("UnknownDevice");