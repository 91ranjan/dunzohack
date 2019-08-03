import { ACTION_STATES, BASE_ACTIONS_TYPES } from "constants/ActionConstants";

export const getEnityActions = baseAction => {
	const entityActions = {};
	Object.keys(BASE_ACTIONS_TYPES).forEach(action => {
		entityActions[action] = action + "_" + baseAction;
	});
	return entityActions;
};

export const getActionState = action => {
	const actionStates = {};
	Object.keys(ACTION_STATES).map(state => {
		return (actionStates[state] = action + "_" + state);
	});
	return actionStates;
};

export const getAllEntityActions = baseAction => {
	let allActions = [];
	Object.keys(BASE_ACTIONS_TYPES).forEach(base => {
		allActions.push(base + "_" + baseAction);
		Object.keys(ACTION_STATES).forEach(state => {
			allActions.push(base + "_" + baseAction + "_" + state);
		});
	});
	return allActions;
};

export const isActionPending = action => {
	var reg = new RegExp(/_PENDING$/);
	return reg.test(action);
};

export const isActionSuccess = action => {
	var reg = new RegExp(/_SUCCESS$/);
	return reg.test(action);
};

export const isActionFailure = action => {
	var reg = new RegExp(/_FAILURE$/);
	return reg.test(action);
};

export const isActionCreate = action => {
	var reg = new RegExp(/^CREATE_/);
	return reg.test(action);
};

export const isActionLocal = action => {
	var reg = new RegExp(/_LOCAL$/);
	return reg.test(action);
};

export const isActionGet = action => {
	var reg = new RegExp(/^GET_/);
	return reg.test(action);
};

export const isActionPost = action => {
	var reg = new RegExp(/^POST_/);
	return reg.test(action);
};

export const isActionDiscard = action => {
	var reg = new RegExp(/^DISCARD_/);
	return reg.test(action);
};

export const isActionUpdate = action => {
	var reg = new RegExp(/^UPDATE_/);
	return reg.test(action);
};

export const isActionDelete = action => {
	var reg = new RegExp(/^DELETE_/);
	return reg.test(action);
};

export const isUiAction = action => {
	var reg = new RegExp(/^UI_LOCAL_/);
	return reg.test(action);
};

export const isActionOfType = (action, type) => {
	var reg = new RegExp("^" + type);
	return reg.test(action);
};
