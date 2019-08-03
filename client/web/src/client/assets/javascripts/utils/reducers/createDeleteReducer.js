import { defaultState, defaultAccessor, updateItemState } from './reducerHelpers';
import { ACTION_STATES, BASE_ACTIONS_TYPES } from 'constants/ActionConstants';
import { Map, List, fromJS } from 'immutable';

import {
    isActionDiscard,
    isActionLocal,
    isActionPending,
    isActionSuccess,
    isActionDelete,
    isActionFailure,
} from 'utils/getActions';

import { serializeFilter } from 'utils/store';

export default function createDiscardLocalReducer(config = {}) {
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
        if (!isActionDelete(action.type)) {
            return state;
        }
        let itemState = state.items;
        let listState = state.lists;
        let localsState = state.locals;

        let filterId = action.payload.filters && action.payload.filters[accessor];

        // MARKING ITEMS IN THE ITEM STORE STALE
        if (isActionSuccess(action.type)) {
            // Invalidating all the list items
            listState.forEach((value, key) => {
                listState = listState.update(key, list =>
                    list.set('state', BASE_ACTIONS_TYPES.STALE)
                );
            });
        }

        return { items: itemState, lists: listState, locals: localsState };
    };
}
