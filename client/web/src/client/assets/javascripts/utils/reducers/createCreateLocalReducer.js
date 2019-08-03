import { defaultAccessor, updateItemState } from './reducerHelpers';
import { ACTION_STATES } from 'constants/ActionConstants';
import { Map, List, fromJS } from 'immutable';

import {
    isActionCreate,
    isActionLocal,
    isActionPending,
    isActionSuccess,
    isActionFailure,
} from 'utils/getActions';

import { serializeFilter } from 'utils/store';

export default function createCreateLocalReducer(config = {}) {
    // The item accessor can be id or passed to it. Ex. patientId, userId
    const accessor = config.accessor || defaultAccessor;

    /**
     * Main reducer for the action
     * @param  {Object} state  Initial state is assigned in the reducer.js from the entity
     * @param  {Object} action Action object
     * @return {Object}        New state object
     */
    return function(state, action) {
        /**
         * Checking if the action was for get
         */
        if (!isActionCreate(action.type) || !isActionLocal(action.type)) {
            return state;
        }
        let itemState = state.items;
        let listState = state.lists;
        let localsState = state.locals;

        let filterId = action.payload.filters && action.payload.filters[accessor];

        // Create Local Item
        const storeData = {
            version: {
                current: action.payload.data,
                synced: null,
            },
            state: ACTION_STATES.LOCAL,
        };

        // UPDATING THE ITEM STATE
        itemState = itemState.set(filterId, fromJS(storeData));
        localsState = localsState.push(filterId);

        return { items: itemState, lists: listState, locals: localsState };
    };
}
