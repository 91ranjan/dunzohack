import Immutable from 'immutable';
import keymirror from 'utils/keymirror';
import { createItemReducer } from 'utils/createReducers';
import { createPostRequest } from 'utils/createRequest';

import {
    getEnityActions,
    getAllEntityActions,
    isActionSuccess,
    isActionFailure,
    isActionOfType,
} from 'utils/getActions';

export const entity_name = 'auth';
export const base_action = 'AUTH';

const entityActions = getEnityActions(base_action);

export const getReducers = function(state, action) {
    return { items: authReducer() };
};

export const customMethods = keymirror('POST_LOGIN_USER');

export const getUserDetails = auth => auth.items.get('currentUser');

export const actions = [
    {
        name: 'onLogin',
        method: customMethods.POST_LOGIN_USER,
    },
];

const loginSuccessResponse = {
    statusCode: 200,
    text: JSON.stringify({ status: true, message: 'Success', data: 'login-token' }),
};

export const asyncAction = (action, payload) => {
    switch (action) {
        case customMethods.POST_LOGIN_USER:
            {
                const { username, password } = payload.data;
                return createPostRequest('/users/login', payload.data);
            }
            break;
    }
};

const authState = {
    currentUser: localStorage.getItem('user'),
    token: localStorage.getItem('token'),
};

function authReducer() {
    return (state = Immutable.fromJS(authState) || Immutable.Map(), action) => {
        const entityActions = getAllEntityActions(base_action);
        if (isActionOfType(action.type, customMethods.POST_LOGIN_USER)) {
            if (isActionSuccess(action.type)) {
                const user = JSON.stringify(action.payload.response.toJS());
                state = state.set('currentUser', user);
                state = state.set('token', action.payload.response.get('token'));
                window.localStorage.setItem('user', user);
                window.localStorage.setItem('token', action.payload.response.get('token'));

                //state = action.payload.response;
            } else if (isActionFailure(action.type)) {
                console.log('Failed to login');
            }
        }
        return state;
    };
}

export const getUserRole = () => JSON.parse(localStorage.getItem('user')).role;
