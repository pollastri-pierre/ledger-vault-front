//@flow
import locale from "./locale";
import auth from "./auth";
import alerts from "./alerts";
import accountCreation from "./account-creation";
import data from "./data";
import onboarding from "./onboarding";
import activity from "./activity";

const reducers = {
    locale,
    auth,
    alerts,
    accountCreation,
    onboarding,
    data,
    activity
};

export default reducers;
