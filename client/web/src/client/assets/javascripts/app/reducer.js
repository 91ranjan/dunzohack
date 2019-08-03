import { combineReducers } from "redux";
import { Map } from "immutable";
import { routerReducer as routing } from "react-router-redux";
import { defaultState, getActionString } from "utils/reducers/reducerHelpers";

// need a better way to solve this importing.
const entities = [];

const req = require.context("../entities", true, /^(.*Entity\.(js$))[^.]*$/im);
req.keys().forEach(function(key) {
    entities.push(req(key));
});

const reducersObj = {};
entities.forEach(entity => {
    if (entity.entity_name && entity.getReducers) {
        reducersObj[entity.entity_name] = combineReducers(entity.getReducers());
    }

    if (entity.entity_name && entity.entityActions) {
        const reducers = [];
        const actionStrings = [];

        // If you have defined a custom reducer for an entity it adds that reducer.
        if (entity.entityReducer) {
            reducers.push(entityReducer);
        }

        // Fetching all the reducers from the actions defined for that entity
        Object.entries(entity.entityActions).forEach(entry => {
            actionStrings.push(
                getActionString(entry[0]) + "_" + entity.base_action
            );
            reducers.push(entry[1].reducer(entity.reducerConfig));
        });

        // Getting the initial state of the entity store
        let mergedInitialState =
            entity.reducerConfig.initialState || defaultState;
        if (mergedInitialState.items) {
            mergedInitialState.items = mergedInitialState.items.set(
                "__idMaps__",
                Map()
            );
        }

        // Initializing all the reducers with entity reducer config and
        // returning a single reducer that manages the entire entity.
        reducersObj[entity.entity_name] = (
            state = mergedInitialState,
            action
        ) => {
            const actionType = action.type;
            const actionString = actionType.substr(
                0,
                actionType.lastIndexOf("_")
            );

            // If action belongs to that entity then pass it to the
            // reducers else return state
            if (actionStrings.indexOf(actionString) > -1) {
                return reducers.reduce((returnState, nextReducer) => {
                    return nextReducer(returnState, action);
                }, state);
            } else {
                return state;
            }
        };
    }
});

export default function createRootReducer(reducers = reducersObj) {
    const rootReducers = Object.assign({}, { routing }, reducers);
    return combineReducers(rootReducers);
}
