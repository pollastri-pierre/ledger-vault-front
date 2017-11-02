export const REMOVE_MESSAGE = "messages/REMOVE_MESSAGE";
export const ADD_MESSAGE = "messages/ADD_MESSAGE";

export function closeMessage() {
  return {
    type: REMOVE_MESSAGE
  };
}

/* important to set visible to false for minimum State instead of null because of how material ui works */

const initialState = { visible: false };

const verbsByHTTPMethod = {
  PUT: "updated",
  POST: "created",
  DELETE: "deleted"
};

export default function reducer(state = initialState, action) {
  const status = `${action.status}`;

  // FIXME should we keep this ? This let us catch any action with a field 'status' set to 5xx ( basically for error 500/503 ) and display a generic message
  if (status && status.lastIndexOf("50", 0) === 0) {
    return {
      title: "error.error5xTitle",
      content: "error.error5xContent",
      type: "error"
    };
  }

  switch (action.type) {
    case "DATA_FETCHED":
      if (action.spec.method !== "GET") {
        const verb = verbsByHTTPMethod[action.spec.method] || "modified";
        const resource = action.spec.resource || "resource";

        return {
          type: "success",
          title: `${resource} ${verb} `,
          content: `the ${resource} has been successfully ${verb}`,
          visible: true
        };
      }

      return state;
    case REMOVE_MESSAGE:
      return { ...state, visible: false };
    default:
      return state;
  }
}
