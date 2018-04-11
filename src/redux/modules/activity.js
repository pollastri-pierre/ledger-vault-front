import type { ActivityCommon } from "data/types";
import ActivityQuery from "api/queries/ActivityQuery";
import { normalize } from "normalizr-gre";
import { DATA_FETCHED } from "restlay/dataStore";

export const NEW_ACTIVITY = "@@restlay/NEW_ACTIVITY";

export function newActivity(activity: ActivityCommon) {
    return {
        type: NEW_ACTIVITY,
        activity
    };
}
const initialState: Store = { activities: [] };

export default function reducer(state: Store = initialState, action: Object) {
    switch (action.type) {
        case NEW_ACTIVITY:
            //state.activities.push(action.activity);
            const query = new ActivityQuery();
            const data = action.activity;
            const result = normalize(data, query.getResponseSchema() || {});
            dispatch({
                type: DATA_FETCHED,
                result,
                query
            });
            return state;
        default:
            return state;
    }
}
