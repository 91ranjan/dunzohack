import Immutable from 'immutable';
import { createStructuredSelector } from 'reselect';
import { isActionSuccess, isActionFailure } from 'utils/getActions';

export const entity_name = 'notifications';

export const getReducers = function(state, action) {
    return {
        items: createNotificationReducer(),
    };
};

const createNotificationReducer = (initialState = Immutable.List(), config) =>
    // const actions = config.actions;
    (state = initialState, action) => {
        if (action.__type__ === 'put' || action.__type__ === 'post') {
            if (!action.payload.query || (action.payload.query && !action.payload.query.isSilent)) {
                if (isActionSuccess(action.type)) {
                    state = state.push(action.payload.response.set('success', true));
                } else if (isActionFailure(action.type)) {
                    state = state.push(action.error.set('success', false));
                }
            }
        }
        return state;
    };

export const getItemSelector = selector =>
    createStructuredSelector({
        [selector]: state => state[entity_name],
    });

export const asyncAction = (action, payload) => {};
