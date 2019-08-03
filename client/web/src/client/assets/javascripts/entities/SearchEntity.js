import {
    createGetAction,
    createSaveAction,
    createUpdateAction,
    createDeleteAction,
    createCreateLocalAction,
    createUpdateLocalAction,
    createDicardLocalAction,
} from 'utils/createActions';
// import Query from 'graphql-query-builder';

export const entity_name = 'search';
export const base_action = 'SEARCH';

export const reducerConfig = {
    baseAction: base_action,
    basePath: ['data'],
};

export const entityActions = {
    get: createGetAction(
        payload => {
            return `/search`;
        },
        payload => payload.filters,
        {}
    ),
    getById: createGetAction(
        payload => {
            return `/search/` + payload.filters.id;
        },
        {},
        {}
    ),
    save: createSaveAction(
        payload => {
            return `/search`;
        },
        payload => payload.data,
        {}
    ),
    update: createUpdateAction(
        payload => {
            return `/search`;
        },
        payload => payload.data,
        {}
    ),
    delete: createDeleteAction(
        payload => {
            return `/search/${payload.filters.id}`;
        },
        payload => payload.data,
        {}
    ),

    createLocal: createCreateLocalAction(),
    updateLocal: createUpdateLocalAction(),
    discardLocal: createDicardLocalAction(),
};
