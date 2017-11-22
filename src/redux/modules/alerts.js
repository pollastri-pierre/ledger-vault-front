//@flow
import { AUTHENTICATION_FAILED, LOGOUT, AUTHENTICATION_SUCCEED } from "./auth";
export const REMOVE_MESSAGE = "messages/REMOVE_MESSAGE";
export const ADD_MESSAGE = "messages/ADD_MESSAGE";

export type Store = {
  visible: boolean
};

export function closeMessage() {
  return {
    type: REMOVE_MESSAGE
  };
}

export function addMessage(
  title: string,
  content: string,
  messageType: string = "success"
) {
  return {
    type: ADD_MESSAGE,
    title,
    content,
    messageType
  };
}

/* important to set visible to false for minimum State instead of null because of how material ui works */

const initialState: Store = { visible: false };

export default function reducer(state: Store = initialState, action: Object) {
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
    case "DATA_FETCHED": {
      const { queryOrMutation, result } = action;
      const notif =
        queryOrMutation.getSuccessNotification &&
        queryOrMutation.getSuccessNotification(result.result);
      if (notif) {
        const { title, content, messageType = "success" } = notif;
        return { visible: true, title, content, type: messageType };
      }
      return state;
    }
    case "DATA_FETCHED_FAIL": {
      const { queryOrMutation, error } = action;
      const notif =
        queryOrMutation.getErrorNotification &&
        queryOrMutation.getErrorNotification(error);
      if (notif) {
        const { title, content, messageType = "error" } = notif;
        return { visible: true, title, content, type: messageType };
      }
      return state;
    }
    case ADD_MESSAGE: {
      const { title, content, messageType } = action;
      return { visible: true, title, content, type: messageType };
    }
    case LOGOUT:
      return {
        visible: true,
        title: "See you soon!",
        content:
          "You have been successfully loggee out. You can now safely close your web browser.",
        type: "success"
      };
    case AUTHENTICATION_FAILED:
      return {
        visible: true,
        title: "Unkown team domain",
        content:
          "This team domain is unkown. Contact your administrator to get more information.",
        type: "error"
      };
    case AUTHENTICATION_SUCCEED:
      return {
        visible: true,
        title: "Welcome",
        content: "Hello. Welcome on Ledger Vault Application",
        type: "success"
      };
    case REMOVE_MESSAGE:
      return { ...state, visible: false };
    default:
      return state;
  }
}
