import React from 'react';
import { List } from 'immutable';
import { connect as reduxConnect } from 'react-redux';
import { getEnityActions, getActionState } from 'utils/getActions';
import { createTransaction, txnStates } from 'utils/Transactions';
import { ACTION_STATES, BASE_ACTIONS_TYPES } from 'constants/ActionConstants';
import { serializeFilter } from 'utils/store';
import { getActionString, defaultAccessor } from 'utils/reducers/reducerHelpers';

export const connect = (name, entity, filters = () => {}, opts = {}) => {
    const mapStateToProps = (state, ownProps) => {
        let value,
            syncedValue,
            isSynced = false,
            isPending = false, // By default isPending should be false so we can track request made or not
            isSuccess = false,
            isFailure = false,
            isStale = false,
            totalRecords = 0,
            localIds = List(),
            localItems = List(),
            metadatas = List(),
            isLocal = false;

        const idField =
            entity.reducerConfig && entity.reducerConfig.accessor
                ? entity.reducerConfig.accessor
                : defaultAccessor;
        const filterVal = filters && filters(ownProps).filters;
        const entityState = state[entity.entity_name];
        /**
         * If there is a valid filter value
         * and there is an entity state in the store
         */
        if (filterVal && entityState) {
            const entityItemState = entityState.items;
            const entityListState = entityState.lists;
            const entityLocalState = entityState.locals;
            /**
             * Checking if the filter is for the list items
             */

            if (!filterVal[idField]) {
                // FETCHING VALUE FROM LIST STATE
                if (entityListState) {
                    /**
                     * Getting the identifier for the list state of entity.
                     */
                    const entityListObj = entityListState.get(serializeFilter(filterVal));

                    let items = List();
                    /**
                     * If the list state exist for the above identifier and has items
                     * then we process the items and return the array of items in that
                     * list.
                     * In case of scroll pagination even though the new filter has no
                     * value but the same filter with previous page has value and we
                     * need to send older page values as well.
                     */
                    if (entityListObj && entityListObj.get('items')) {
                        /**
                         * Determining various list states
                         */
                        isSuccess = entityListObj.get('state') === ACTION_STATES.SUCCESS;
                        isPending = entityListObj.get('state') === ACTION_STATES.PENDING;
                        isFailure = entityListObj.get('state') === ACTION_STATES.FAILURE;
                        isStale = entityListObj.get('state') === BASE_ACTIONS_TYPES.STALE;
                        isSynced = isSuccess;
                        totalRecords = entityListObj.get('totalRecords');

                        /**
                         * In case of scroll pagination when the filter changes
                         * entity state for that filter will be PENDING and the items will be
                         * missing, so until those items are loaded we default it to
                         * List so that the last page values can be added to it and
                         * we contiune to show the older values until the next page
                         * value loads.
                         */
                        items = entityListObj.get('items') || List();

                        // If the metadata exists for this index then fill it.
                        metadatas = metadatas.push(entityListObj.get('metadata'));
                    }
                    // If it is a scrolling pagination and if the page is more than 1
                    // then appending the old pages data
                    if (opts.isScrollPagination && filterVal.startindex > 0) {
                        // Scroll Pagination handling
                        let oldItems = List();
                        for (let i = 0; i < filterVal.startindex; i += filterVal.pagesize) {
                            const pageFilters = Object.assign({}, filterVal, {
                                startindex: i,
                            });
                            const pageItems = entityListState.get(serializeFilter(pageFilters));
                            if (pageItems && pageItems.get('state') !== ACTION_STATES.PENDING) {
                                totalRecords = pageItems.get('totalRecords');
                                oldItems = oldItems.concat(pageItems.get('items'));
                            }
                        }
                        items = oldItems.concat(items);
                    }
                    if (items.size) {
                        // Filling the items values form item store
                        value = items.map(item => {
                            /**
                             * if the "item" is a string then the item will be
                             * in the entity item state else return the item
                             * from list state.
                             */
                            if (typeof item !== 'object') {
                                return entityItemState.getIn([item, 'version', 'synced']);
                            } else {
                                return item;
                            }
                        });
                    } else {
                        value = List();
                    }
                } else {
                    // Need this for notifications reducer
                    value = entityItemState;
                }
            } else if (filterVal[idField]) {
                // FETCHING VALUE FROM ITEM STATE
                const accessorKey = filterVal[idField];
                let itemFromState = null;
                /**
                 * Checking if the item exist
                 */
                if (entityItemState.get(accessorKey)) {
                    itemFromState = entityItemState.get(accessorKey);
                } else {
                    /**
                     * Check if there is a __idMap for that accessorKey
                     */
                    const idMapValue = entityItemState.getIn(['__idMaps__', accessorKey]);
                    itemFromState = entityItemState.get(idMapValue);
                }

                if (itemFromState) {
                    // Query is for a single item
                    const currentVal = itemFromState.getIn(['version', 'current']);
                    const syncedVal = itemFromState.getIn(['version', 'synced']);

                    /**
                     * If current value is there assign it to current value
                     * else fallback to synced value.
                     */
                    value = currentVal || syncedVal;
                    const hasEnoughDetails = opts.hasEnoughDetails
                        ? opts.hasEnoughDetails(value)
                        : true;
                    /**
                     * Determining various item states
                     */
                    isSynced = value && value === syncedVal && hasEnoughDetails ? true : false;
                    isLocal = !syncedVal;
                    isPending = itemFromState.get('state') === ACTION_STATES.PENDING;
                    isSuccess = itemFromState.get('state') === ACTION_STATES.SUCCESS;
                    isFailure = itemFromState.get('state') === ACTION_STATES.FAILURE;
                }
            }

            // FETCHING ALL THE LOCALS
            localItems = entityLocalState
                ? entityLocalState.map(localId => {
                      return entityItemState.getIn([localId, 'version', 'current']);
                  })
                : localItems;

            return {
                value,
                localIds: entityLocalState,
                localItems,
                status: {
                    isSynced,
                    isPending,
                    isSuccess,
                    isFailure,
                    isStale,
                    isLocal,
                },
                metadatas,
                totalRecords,
            };
        } else {
            // If the entity state does not exist in the store
            return {};
        }
    };
    const mapDispatchToProps = (dispatch, ownProps) => {
        const entityActions = getEnityActions(entity.base_action);

        // Actions to be passed to the component below
        let connectActions = {};

        entity.entityActions &&
            Object.keys(entity.entityActions).forEach(prop => {
                // action = {request, reducer}
                const action = entity.entityActions[prop];

                /**
                 * Ex. get => GET getPendingItems => GET_PENDING_ITEMS
                 * @type {[type]}
                 */
                const actionString = getActionString(prop);
                const actionStates = getActionState(actionString + '_' + entity.base_action);

                /**
                 * If the action is a local action we do not have to
                 * create transactions.
                 * @param  {Boolean} action.isLocalAction True if the action is syncronous action
                 * @return {Void}                       Void
                 */
                if (!action.isLocalAction) {
                    // When the call happens for that action
                    connectActions[prop] = payload => {
                        // Initiating the transaction
                        const Tnx = createTransaction();
                        Tnx.initiateTxn();

                        // Dipatching the pending request
                        dispatch({
                            type: actionStates.PENDING,
                            payload: payload,
                            __type__: action.__type__,
                        });

                        // Making the request
                        action.request(payload).then(([error, response]) => {
                            if (error) {
                                dispatch({
                                    type: actionStates.FAILURE,
                                    payload: { query: payload },
                                    error: error,
                                    __type__: action.__type__,
                                });
                                Tnx.setStateFailure(error);
                            } else {
                                dispatch({
                                    type: actionStates.SUCCESS,
                                    payload: { response, query: payload },
                                    __type__: action.__type__,
                                });
                                Tnx.setStateSuccess(response);
                            }
                        });
                        return Tnx;
                    };
                } else {
                    // In case of a local action we just dipatch the local action.
                    connectActions[prop] = payload => {
                        dispatch({
                            type: actionStates.LOCAL,
                            payload: payload,
                        });
                    };
                }
            });
        return connectActions;
    };

    const mergeProps = function(stateProps, dispatchProps, ownProps) {
        const consolidatedProps = {
            [name]: Object.assign({}, stateProps, { actions: dispatchProps }),
        };

        return Object.assign({}, ownProps, consolidatedProps);
    };
    return reduxConnect(mapStateToProps, mapDispatchToProps, mergeProps);
};
