import {
    createGetAction,
    createSaveAction,
    createUpdateAction,
    createDeleteAction,
    createCreateLocalAction,
    createUpdateLocalAction,
    createDicardLocalAction,
} from 'utils/createActions';

export const entity_name = 'users';
export const base_action = 'USERS';

export const reducerConfig = {
    baseAction: base_action,
    basePath: ['data'],
};

export const entityActions = {
    get: createGetAction(
        payload => {
            return `/users`;
        },
        payload => payload.filters,
        {}
    ),
    getById: createGetAction(
        payload => {
            return `/users/${payload.filters.id}`;
        },
        payload => {},
        {}
    ),
    save: createSaveAction(
        payload => {
            return '/users';
        },
        payload => payload.data,
        {}
    ),
    update: createUpdateAction(
        payload => {
            return '/users';
        },
        payload => payload.data,
        {}
    ),
    delete: createDeleteAction(
        payload => {
            return '/users/' + payload.filters.id;
        },
        payload => payload.data,
        {}
    ),

    createLocal: createCreateLocalAction(),
    updateLocal: createUpdateLocalAction(),
    discardLocal: createDicardLocalAction(),
};
