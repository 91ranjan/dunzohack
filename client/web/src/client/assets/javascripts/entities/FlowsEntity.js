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

export const entity_name = 'flows';
export const base_action = 'FLOWS';

export const reducerConfig = {
    baseAction: base_action,
    basePath: ['data'],
};

export const entityActions = {
    get: createGetAction(
        payload => {
            return `/${payload.filters.product}/flows`;
        },
        payload => payload.filters,
        {}
    ),
    getById: createGetAction(
        payload => {
            return `/${payload.filters.product}/flows/` + payload.filters.id;
        },
        {},
        {}
    ),
    save: createSaveAction(
        payload => {
            return `/${payload.filters.product}/flows`;
        },
        payload => payload.data,
        {}
    ),
    update: createUpdateAction(
        payload => {
            return `/${payload.filters.product}/flows`;
        },
        payload => payload.data,
        {}
    ),
    delete: createDeleteAction(
        payload => {
            return `/${payload.filters.product}/flows/${payload.filters.id}`;
        },
        payload => payload.data,
        {}
    ),

    createLocal: createCreateLocalAction(),
    updateLocal: createUpdateLocalAction(),
    discardLocal: createDicardLocalAction(),
};
