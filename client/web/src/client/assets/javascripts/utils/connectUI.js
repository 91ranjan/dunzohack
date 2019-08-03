import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import * as UIEntity from 'entities/UIEntity';

export const connectUI = (name) => {
    const mapStateToProps = (state, ownProps) => {
        let value,
            syncedValue,
            isPending,
            isLocal = false;

        value = state[UIEntity.entity_name].items.get(name);
        return {value};
    };
    const mapDispatchToProps = (dispatch, ownProps) => {
        return {
            update: (key, value) => {
                dispatch({
                    type: UIEntity.base_action + '_UPDATE',
                    payload: {
                        key, value, name
                    }
                });
            }
        };
    };
    const mergeProps = function(stateProps, dispatchProps, ownProps) {
        return {
            ...ownProps,
            [name]: Object.assign({}, stateProps, dispatchProps)
        }
    }
    return reduxConnect(mapStateToProps, mapDispatchToProps, mergeProps);
}
