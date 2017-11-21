//@flow
import formatError from "./error";

export const success = (resource: string, action: string) => ({
  title: `${resource} ${action}`,
  content: `the ${resource} has been successfully ${action}`
});

export const error = (resource: string, action: string, e: ?Error) => {
  const errMsg = formatError(e);
  console.log(errMsg, e);
  return {
    title: "Oops",
    content: `the ${resource} was not ${action}${errMsg ? ": " + errMsg : ""}`
  };
};
