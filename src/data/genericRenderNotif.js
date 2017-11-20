//@flow

const verbsByHTTPMethod = {
  PUT: "updated",
  POST: "created",
  DELETE: "deleted"
};

export default (resource: string, verb: $Keys<typeof verbsByHTTPMethod>) => ({
  title: `${resource} ${verbsByHTTPMethod[verb]}`,
  content: `the ${resource} has been successfully ${verbsByHTTPMethod[verb]}`
});
