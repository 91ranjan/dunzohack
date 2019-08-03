import Immutable from "immutable";
import { BASE_ACTIONS_TYPES, ACTION_STATES } from "constants/ActionConstants";
import {
    getEnityActions,
    getActionState,
    isActionGet,
    isActionCreate,
    isActionUpdate,
    isActionPost,
    isActionPending,
    isActionSuccess,
    isActionDelete,
    isActionFailure,
    getAllEntityActions,
    isActionDiscard,
    isUiAction
} from "utils/getActions";

import { serializeFilter } from "utils/store";

const defaultAccessor = "id";

export const createItemReducer = (initialState = Immutable.Map(), config) => {
    const entityActions = getAllEntityActions(config.baseAction);
    let mergedInitialState = initialState.set("__idMaps__", Immutable.Map());
    const accessor = config.accessor || defaultAccessor;
    const saveListItems =
        config.saveListItems !== undefined ? config.saveListItems : true;
    const basePath = config.basePath || [];
    const itemPath = config.itemPath
        ? basePath.concat(config.itemPath)
        : basePath;
    const listPath = config.listPath
        ? basePath.concat(config.listPath)
        : basePath;

    return (state = mergedInitialState, action) => {
        if (entityActions.indexOf(action.type) > -1) {
            if (isActionGet(action.type)) {
                if (isActionPending(action.type)) {
                    const filterId = action.payload.filters[accessor];

                    // GET List
                    if (!filterId) {
                        // Case where the list of items is being fetched.
                        // Nothing at the moment
                    } else {
                        // GET specific object
                        // Already an object exist
                        if (state.get(filterId)) {
                            state = state.update(filterId, item =>
                                item.set("state", ACTION_STATES.PENDING)
                            );
                        } else {
                            state = state.set(
                                filterId,
                                Immutable.fromJS({
                                    state: ACTION_STATES.PENDING
                                })
                            );
                        }
                    }
                } else if (isActionSuccess(action.type)) {
                    const filterId = action.payload.query.filters[accessor];
                    // GET List
                    // saveListItems : Save the items by iterating when list API is called.
                    if (!action.payload.query.filters[accessor]) {
                        if (saveListItems) {
                            // listPath : Path in the list api response to access items
                            const data =
                                config.listPath || config.basePath
                                    ? action.payload.response.getIn(listPath)
                                    : action.payload.response;

                            if (data.size) {
                                Immutable.List.isList(data) &&
                                    data.forEach(item => {
                                        const currentItem =
                                            typeof item === "string"
                                                ? JSON.parse(item)
                                                : item;
                                        const itemId =
                                            typeof item === "string"
                                                ? JSON.parse(item)[accessor]
                                                : item.get(accessor);
                                        const storeData = {
                                            version: {
                                                current: currentItem,
                                                synced: currentItem
                                            },
                                            state: ACTION_STATES.SUCCESS
                                        };
                                        state = state.set(
                                            itemId,
                                            Immutable.fromJS(storeData)
                                        );
                                    });
                            }
                        }
                    } else {
                        state = state.update(filterId, item => {
                            item = item.set("state", ACTION_STATES.SUCCESS);
                            const oldSyncedVersion = item.getIn([
                                "version",
                                "synced"
                            ]);
                            // If anyone of them is there then we have to get inside to get the value.
                            const newValue =
                                config.itemPath || config.basePath
                                    ? action.payload.response.getIn(itemPath)
                                    : action.payload.response;
                            /**
                             * If there is a old synced version of the item but
                             * the old synced version is not equal to the new
                             * synced version then updte the item.
                             */
                            if (
                                !oldSyncedVersion ||
                                (oldSyncedVersion &&
                                    !oldSyncedVersion.equals(newValue))
                            ) {
                                console.log(
                                    "Updating the item store with new item"
                                );
                                item = item.setIn(
                                    ["version", "current"],
                                    newValue
                                );
                                item = item.setIn(
                                    ["version", "synced"],
                                    newValue
                                );
                            }
                            return item;
                        });
                    }
                }
            } else if (isActionCreate(action.type)) {
                // Create Local Item
                const storeData = {
                    version: {
                        current: action.payload,
                        synced: null
                    },
                    state: ACTION_STATES.LOCAL
                };
                state = state.set(
                    action.payload.get(accessor),
                    Immutable.fromJS(storeData)
                );
            } else if (isActionUpdate(action.type)) {
                if (isActionPending(action.type)) {
                    state = state.setIn(
                        [action.payload.data.get(accessor), "state"],
                        ACTION_STATES.PENDING
                    );
                    state = state.setIn(
                        [
                            action.payload.data.get(accessor),
                            "version",
                            "current"
                        ],
                        action.payload.data
                    );
                } else if (isActionFailure(action.type)) {
                    state = state.setIn(
                        [action.payload.query.data.get(accessor), "state"],
                        ACTION_STATES.FAILURE
                    );
                } else if (isActionSuccess(action.type)) {
                    state = state.setIn(
                        [action.payload.query.filters[accessor], "state"],
                        ACTION_STATES.SUCCESS
                    );
                    // This is done so that the data ref can change and Component can detect it as a trigger to refresh as a response.

                    const data = config.ignoreResponse
                        ? action.payload.query.data
                        : action.payload.response;

                    // When the response does not have the latest data
                    //state = state.setIn([action.payload.query.filters[accessor], "version", "current"], Immutable.fromJS(action.payload.query.data));
                    //state = state.setIn([action.payload.query.filters[accessor], "version", "synced"], state.getIn([action.payload.query.filters[accessor], "version", "current"]));

                    // When the response have the latest data
                    state = state.setIn(
                        [
                            action.payload.query.filters[accessor],
                            "version",
                            "current"
                        ],
                        data
                    );
                    state = state.setIn(
                        [
                            action.payload.query.filters[accessor],
                            "version",
                            "synced"
                        ],
                        data
                    );
                } else {
                    // Local update
                    state = state.setIn(
                        [action.payload.get(accessor), "version", "current"],
                        action.payload
                    );
                }
            } else if (isActionPost(action.type)) {
                // Saving new entities in the backend.
                if (isActionPending(action.type)) {
                    // Used to update the data assuming it will be successful,
                    // so that the UI does not flicker

                    // Used for the case when the id is generated from the backend
                    // so the request data object itself does not have the id
                    // Or you want to manage the ID your self for ex. id with date time.
                    if (
                        action.payload.filters &&
                        action.payload.filters[accessor]
                    ) {
                        state = state.setIn(
                            [action.payload.filters[accessor], "state"],
                            ACTION_STATES.PENDING
                        );
                        state = state.setIn(
                            [
                                action.payload.filters[accessor],
                                "version",
                                "current"
                            ],
                            action.payload.data
                        );
                    } else if (
                        action.payload.data.get &&
                        action.payload.data.get(accessor)
                    ) {
                        // Case when the UI is assigning the ID and the backend just saves it.
                        state = state.setIn(
                            [action.payload.data.get(accessor), "state"],
                            ACTION_STATES.PENDING
                        );
                        state = state.setIn(
                            [
                                action.payload.data.get(accessor),
                                "version",
                                "current"
                            ],
                            action.payload.data
                        );
                    }
                } else if (isActionSuccess(action.type)) {
                    const requestData = action.payload.query.data;
                    if (
                        action.payload.query.filters &&
                        action.payload.query.filters[accessor]
                    ) {
                        // Used for the case when the id is generated from the backend
                        // so the request data object itself does not have the id
                        // In this case irrespective of the backend id an identifier
                        // is created from the filters and used.
                        // Or you want to manage the ID your self for ex. id with date time.
                        state = state.setIn(
                            [action.payload.query.filters[accessor], "state"],
                            ACTION_STATES.SUCCESS
                        );

                        const data = config.ignoreResponse
                            ? action.payload.query.data
                            : action.payload.response;

                        state = state.setIn(
                            [
                                action.payload.query.filters[accessor],
                                "version",
                                "current"
                            ],
                            data
                        );
                        state = state.setIn(
                            [
                                action.payload.query.filters[accessor],
                                "version",
                                "synced"
                            ],
                            data
                        );

                        state = state.setIn(
                            [
                                "__idMaps__",
                                action.payload.query.filters[accessor]
                            ],
                            data.get(accessor)
                        );
                    } else if (requestData.get(accessor)) {
                        // Used when the front end is creating the ID and backend
                        // just saves it.
                        state = state.setIn(
                            [requestData.get(accessor), "state"],
                            ACTION_STATES.SUCCESS
                        );

                        // Below can be used if the response does not have the updated value.
                        // state = state.setIn([requestData.get(accessor), "version", "synced"],
                        // state.getIn([requestData.get(accessor), "version", "current"]));

                        // Below is used in the case when the response is the updated value
                        state = state.setIn(
                            [requestData.get(accessor), "version", "synced"],
                            action.payload.response
                        );
                        state = state.setIn(
                            [requestData.get(accessor), "version", "current"],
                            action.payload.response
                        );
                    }
                }
            } else if (isActionDiscard(action.type)) {
                const itemId = action.payload.filters[accessor];
                state = state.updateIn([itemId, "version"], data => {
                    return data.set("current", data.get("synced") || undefined);
                });
            }
        }
        return state;
    };
};

export const createListReducer = (initialState, config) => {
    const entityActions = getAllEntityActions(config.baseAction);
    const accessor = config.accessor || defaultAccessor;
    const saveListItems =
        config.saveListItems !== undefined ? config.saveListItems : true;
    const basePath = config.basePath || [];
    const itemPath = config.itemPath
        ? basePath.concat(config.itemPath)
        : basePath;
    const listPath = config.listPath
        ? basePath.concat(config.listPath)
        : basePath;
    const updatePath = config.updatePath;

    return (state = initialState || Immutable.Map(), action) => {
        if (entityActions.indexOf(action.type) > -1) {
            //console.log(action.type + ' belongs to ' + config.baseAction);
            if (isActionGet(action.type)) {
                if (isActionPending(action.type)) {
                    // GET List
                    if (!action.payload.filters[accessor]) {
                        const storeData = {
                            state: ACTION_STATES.PENDING
                        };
                        const serializedFilter = serializeFilter(
                            action.payload.filters
                        );
                        if (state.get(serializedFilter)) {
                            state = state.setIn(
                                [serializedFilter, "state"],
                                ACTION_STATES.PENDING
                            );
                        } else {
                            state = state.set(
                                serializedFilter,
                                Immutable.fromJS(storeData)
                            );
                        }
                    }
                } else if (isActionSuccess(action.type)) {
                    // In case of Response the query has the request filters
                    // GET List
                    if (!action.payload.query.filters[accessor]) {
                        state = state.update(
                            serializeFilter(action.payload.query.filters),
                            list => {
                                list = list.set("state", ACTION_STATES.SUCCESS);
                                list = list.set(
                                    "totalRecords",
                                    action.payload.response.getIn(
                                        basePath.concat("records")
                                    )
                                );
                                //
                                const data =
                                    config.listPath || config.basePath
                                        ? action.payload.response.getIn(
                                              listPath
                                          )
                                        : action.payload.response;

                                list = list.set(
                                    "items",
                                    Immutable.fromJS(
                                        action.payload.response
                                            .getIn(listPath)
                                            .map(
                                                (
                                                    item // If the item is a string then parse it and then use it.
                                                ) =>
                                                    saveListItems
                                                        ? typeof item ===
                                                          "string"
                                                          ? JSON.parse(item)[
                                                                accessor
                                                            ]
                                                          : item.get(accessor)
                                                        : item
                                            )
                                    )
                                );
                                return list;
                            }
                        );
                    }
                } else if (isActionFailure(action.type)) {
                    // In case of Response the query has the request filters
                    // GET List
                    if (!action.payload.query.filters[accessor]) {
                        state = state.update(
                            serializeFilter(action.payload.query.filters),
                            list => {
                                list = list.set("state", ACTION_STATES.FAILURE);
                                list = list.set("items", Immutable.List());
                                return list;
                            }
                        );
                    }
                }
            } else if (isActionPost(action.type)) {
                if (isActionSuccess(action.type)) {
                    state.forEach((value, key) => {
                        state = state.update(key, list =>
                            list.set("state", BASE_ACTIONS_TYPES.STALE)
                        );
                    });
                }
            } else if (isActionUpdate(action.type)) {
                if (isActionPending(action.type)) {
                    if (
                        !action.payload.filters ||
                        !action.payload.filters[accessor]
                    ) {
                        state = state.update(
                            serializeFilter(action.payload.filters),
                            list => {
                                return list.set("state", ACTION_STATES.PENDING);
                            }
                        );
                    }
                } else if (isActionSuccess(action.type)) {
                    state.forEach((value, key) => {
                        state = state.update(key, list =>
                            list.set("state", BASE_ACTIONS_TYPES.STALE)
                        );
                    });
                    if (
                        (config.ignoreUpdateResponse &&
                            !action.payload.query.filters) ||
                        !action.payload.query.filters[accessor]
                    ) {
                        state = state.update(
                            serializeFilter(action.payload.query.filters),
                            list => {
                                const data = updatePath
                                    ? action.payload.query.data.getIn(
                                          updatePath
                                      )
                                    : action.payload.query.data;
                                list = list.set("items", data);
                                return list;
                            }
                        );
                    }
                }
            } else if (isActionDelete(action.type)) {
                if (isActionSuccess(action.type)) {
                    state.forEach((value, key) => {
                        state = state.update(key, list =>
                            list.set("state", BASE_ACTIONS_TYPES.STALE)
                        );
                    });
                }
            }
            // For extending the list reducer
            if (config.postReducer) {
                state = config.postReducer(state, action);
            }
        }
        return state;
    };
};

export const createUiReducer = (initialState = Immutable.Map(), config) => (
    state = initialState,
    action
) => {
    if (isUiAction(action.type)) {
        if (!state.get(action.payload.name)) {
            state = state.set(action.payload.name, Immutable.Map());
        }
        state = state.setIn(
            [action.payload.name, action.payload.key],
            action.payload.value
        );
    }
    return state;
};
