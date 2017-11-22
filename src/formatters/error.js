//@flow
export default (error: ?Error) => ((error && error.message) || "").toString();
