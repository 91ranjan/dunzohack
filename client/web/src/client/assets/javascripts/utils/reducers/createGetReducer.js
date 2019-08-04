import { defaultState, defaultAccessor, updateItemState } from './reducerHelpers';
import { ACTION_STATES } from 'constants/ActionConstants';
import { Map, List, fromJS } from 'immutable';

import { isActionGet, isActionPending, isActionSuccess, isActionFailure } from 'utils/getActions';

import { serializeFilter } from 'utils/store';

export default function createGetReducer(config = {}) {
    // The item accessor can be id or passed to it. Ex. patientId, userId
    const accessor = config.accessor || defaultAccessor;

    //
    /**
     * If true the items from a list call is to be saved in the items state
     * individually and the ids are saved in the list state
     * else items are directly stored in the list state
     * @type {Boolean}
     */
    const saveListItems = config.saveListItems !== undefined ? config.saveListItems : true;

    /**
     * In the response of the api, this defines path of the actual
     * data to be accessed Ex. ['data']
     * @type {Array}
     */
    const basePath = config.basePath || [];

    /**
     * If item is to be accessed in a deeper path than the base path
     * @type {Array}
     */
    const itemPath = config.itemPath ? basePath.concat(config.itemPath) : basePath;

    /**
     * If list is to be accessed in a deeper path than the base path
     * @type {Array}
     */
    const listPath = config.listPath ? basePath.concat(config.listPath) : basePath;

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
        if (!isActionGet(action.type)) {
            return state;
        }

        let filterId;

        if (isActionPending(action.type)) {
            filterId = action.payload.filters && action.payload.filters[accessor];
        } else {
            filterId = action.payload.query.filters && action.payload.query.filters[accessor];
        }

        let itemState = state.items;
        let listState = state.lists;
        let localsState = state.locals;

        /**
         * Checking if the request was made for and item
         */
        if (filterId) {
            // REDUCING ITEM STATE
            if (isActionPending(action.type)) {
                // GET specific object
                itemState = updateItemState(itemState, filterId, ACTION_STATES.PENDING);
            } else if (isActionSuccess(action.type)) {
                itemState = itemState.update(filterId, item => {
                    item = item.set('state', ACTION_STATES.SUCCESS);

                    const newValue = action.payload.response.getIn(itemPath);

                    item = item.setIn(['version', 'synced'], newValue);
                    return item;
                });
            } else if (isActionFailure(action.type)) {
                itemState = updateItemState(itemState, filterId, ACTION_STATES.FAILURE);
            }
        } else {
            // REDUCING LIST STATE

            let serializedFilter;

            /**
             * If the action is pending the requested filter is in payload
             * else in payload.query
             */
            if (isActionPending(action.type)) {
                serializedFilter =
                    action.payload.filters && serializeFilter(action.payload.filters);
            } else {
                serializedFilter =
                    action.payload.query.filters && serializeFilter(action.payload.query.filters);
            }

            if (isActionPending(action.type)) {
                // GET List
                listState = updateItemState(listState, serializedFilter, ACTION_STATES.PENDING);
            } else if (isActionSuccess(action.type)) {
                // Updating the items in the list response in the item state.

                const responseData = action.payload.response.getIn(listPath);
                const metadata = action.payload.response.getIn(['metaData']);
                // saveListItems : Save the items by iterating when list API is called.
                if (saveListItems) {
                    // listPath : Path in the list api response to access items

                    if (List.isList(responseData) && responseData.size) {
                        responseData.forEach(item => {
                            /**
                             * If the response of the list call is a string
                             * we parse it to get the Array
                             * @type {String}
                             */
                            const currentItem = typeof item === 'string' ? JSON.parse(item) : item;
                            if (!currentItem) {
                                return;
                            }
                            const itemId = currentItem.get(accessor);

                            // Case when the item in the list is already present in the item state
                            // we do not overrite the current value.
                            if (itemState.get(itemId)) {
                                itemState = itemState.update(itemId, stateItem => {
                                    return stateItem
                                        .setIn(['version', 'synced'], currentItem)
                                        .set('state', ACTION_STATES.SUCCESS);
                                });
                            } else {
                                const storeData = fromJS({
                                    version: {
                                        current: null,
                                        synced: currentItem,
                                    },
                                    state: ACTION_STATES.SUCCESS,
                                });
                                itemState = itemState.set(itemId, storeData);
                            }
                        });
                    }
                }

                // Updating the list state of the entity.
                let newlistState = Map();
                newlistState = newlistState.set('state', ACTION_STATES.SUCCESS);

                // Updating the metadata if any
                newlistState = newlistState.set('metadata', metadata);

                /**
                 * Setting the total records of the list response
                 * Defaulting to 0
                 * @type {Object}
                 */
                newlistState = newlistState.set(
                    'totalRecords',
                    action.payload.response.getIn(['total']) || 0
                );

                newlistState = newlistState.set(
                    'items',
                    responseData.filter(item => item).map((
                        item // If the item is a string then parse it and then use it.
                    ) =>
                        saveListItems // Read SaveListItems ReadMe above
                            ? typeof item === 'string'
                                ? JSON.parse(item)[accessor]
                                : item.get(accessor)
                            : item
                    )
                );

                listState = listState.set(serializedFilter, newlistState);
            } else if (isActionFailure(action.type)) {
                listState = updateItemState(listState, serializedFilter, ACTION_STATES.FAILURE);
            }
        }

        return { items: itemState, lists: listState, locals: localsState };
    };
}
