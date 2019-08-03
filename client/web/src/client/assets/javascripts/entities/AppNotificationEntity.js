import { getEnityActions } from "utils/getActions";

import {
    createGetAction,
    createSaveAction,
    createCreateLocalAction,
    createUpdateLocalAction,
    createDicardLocalAction
} from "utils/createActions";

import { IP_ADDR } from "constants/ConfigConstant";

export const entity_name = "app_notifications";
export const base_action = "APP_NOTIFICATIONS";

const entityRequests = getEnityActions(base_action);

export const reducerConfig = {
    baseAction: base_action,
    saveListItems: false,
    listPath: ["data", "notifications"]
};

export const entityActions = {
    get: createGetAction(
        payload => {
            return "/services/notification/" + payload.filters.id;
        },
        {},
        {
            ipAddr: IP_ADDR
        }
    ),
    save: createSaveAction(
        payload => {
            return "/services/notification/" + payload.filters.id;
        },
        {},
        {
            ipAddr: IP_ADDR
        }
    ),
    createLocal: createCreateLocalAction(),
    updateLocal: createUpdateLocalAction(),
    discardLocal: createDicardLocalAction()
};
