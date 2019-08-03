import Immutable from 'immutable';
import { createUiReducer } from 'utils/createReducers';

export const entity_name = 'UI';
export const base_action = 'UI_LOCAL';

export const getReducers = function(state, action) {
    return {
        items: createUiReducer(Immutable.Map(),{baseAction: base_action})
    }
}