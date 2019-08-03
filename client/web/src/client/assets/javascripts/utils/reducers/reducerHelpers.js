import { Map, List, fromJS } from "immutable";
import { ACTION_STATES } from "constants/ActionConstants";

export const defaultState = {
    items: Map(),
    lists: Map(),
    locals: List()
};

export const defaultAccessor = "id";

/**
 * Updates the filterId item state in the state passed to it.
 * If the item does not exist then create it.
 * @param  {Object} state     Initial state of the store.
 * @param  {String} filterId  Identifier of the item to be updated in the state.
 * @param  {String} newStatus New Status of the item
 * @return {Object}           Updated store value
 */
export const updateItemState = (state, filterId, newStatus) => {
    let newState;
    if (state.get(filterId)) {
        newState = state.update(filterId, item => item.set("state", newStatus));
    } else {
        newState = state.set(
            filterId,
            fromJS({
                state: newStatus
            })
        );
    }
    return newState;
};

/**
 * From the action name in the entityAction it creats the ActionString
 * @param  {String} actionProp Action name passed as a prop to the child comp
 * @return {String}            Action string to be used for that action triggers.
 */
export const getActionString = actionProp => {
    return actionProp
        .split("")
        .map(function(letter, index) {
            // If the letter is already upper case the return _'Letter'
            if (letter === letter.toUpperCase()) {
                return "_" + letter.toUpperCase();
            }

            // return the upper case of the letter.
            return letter.toUpperCase();
        })
        .join("");
};
