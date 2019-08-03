import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { createTransaction, txnStates } from 'utils/Transactions';
import { getEnityActions, getActionState } from 'utils/getActions';
import * as UIEntity from 'entities/UIEntity';

export const connectDummy = (name, entity) => {
    const mapStateToProps = (state, ownProps) => {
        let value,
            syncedValue,
            isPending,
            isLocal = false;
        // Returns the complete state to the component.
        value = state[entity.entity_name];
        return {value};
    };
    const mapDispatchToProps = (dispatch, ownProps) => {
        const ayncBind = createAsyncCall.bind(this, dispatch);
		const entityActions = getEnityActions(entity.base_action);
        
        const connectActions = {};
        const customActions = entity.actions;
        customActions && customActions.forEach(action => {
			connectActions[action.name] = (payload) => {
				const Tnx = createTransaction();
				Tnx.initiateTxn();
				ayncBind(Tnx, payload, entity, action.method);
				return Tnx;
			}
        });
        return connectActions;
    };
    const mergeProps = function(stateProps, dispatchProps, ownProps) {
        return {
            ...ownProps,
            [name]: Object.assign({}, stateProps, dispatchProps)
        }
    }
    return reduxConnect(mapStateToProps, mapDispatchToProps, mergeProps);
}

function createAsyncCall(dispatch, Tnx, payload, entity, action) {
	const actionState = getActionState(action);
	dispatch({
		type: actionState.PENDING,
		payload: payload
	});
	Tnx.setStatePending();

	entity.asyncAction(action, payload)
		.then(
			([error, response]) => {
				if (error) {
					dispatch({
						type: actionState.FAILURE,
						payload: {query: payload},
						error: error
					});
					Tnx.setStateFailure(error);
				} else {
					dispatch({
						type: actionState.SUCCESS,
						payload: {response, query: payload}
					});
					Tnx.setStateSuccess(response);
				}
			}
		);
}