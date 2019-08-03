import * as graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

export const getHttpSchema = (name, query, mutation?) => {
    const schema = <any>{};
    if (query) {
        schema.query = new GraphQLObjectType({
            name: name + 'query',
            fields: query,
        })
    }
    if (mutation) {
        schema.mutation = new GraphQLObjectType({
            name: name + 'mutation',
            fields: mutation,
        })
    }
    return new GraphQLSchema(schema);
};
