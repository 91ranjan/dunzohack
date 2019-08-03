import Immutable from "immutable";
import keymirror from "utils/keymirror";
import { createItemReducer, createListReducer } from "utils/createReducers";
import { createStructuredSelector } from "reselect";
import {
    createGetRequest,
    createPostRequest,
    createPutRequest
} from "utils/createRequest";

import {
    getEnityActions,
    isActionSuccess,
    isActionFailure,
    isActionOfType,
    getAllEntityActions
} from "utils/getActions";

export const entity_name = "logged_in_user";
export const base_action = "LOGGED_IN_USERS";

const entityActions = getEnityActions(base_action);

export const customMethods = keymirror("LOGGED_IN_USER");

export const actions = [
    {
        name: "onGetLoggedInUser",
        method: customMethods.LOGGED_IN_USER
    }
];

export const getReducers = function(state, action) {
    return {
        currentUser: currentUserReducer()
    };
};

export const asyncAction = (action, payload) => {
    switch (action) {
        case customMethods.LOGGED_IN_USER:
            return createGetRequest("/user/current", {});
            break;
    }
};

function currentUserReducer() {
    return (state = Immutable.Map() || Immutable.Map(), action) => {
        const entityActions = getAllEntityActions(base_action);
        if (isActionOfType(action.type, customMethods.LOGGED_IN_USER)) {
            if (isActionSuccess(action.type)) {
                state = action.payload.response;
            }
        }
        return state;
    };
}
