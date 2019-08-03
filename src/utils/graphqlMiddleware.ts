import { getGraphQLParams } from 'express-graphql';
import * as _graphql from 'graphql';
import * as httpErrors from 'http-errors';

export const graphQlMiddleware = options => {
    return (request, response) => {
        // Higher scoped variables are referred to at various stages in the
        // asynchronous state machine below.
        var params = request.params;
        var context = void 0;
        var query = void 0;

        var documentAST = void 0;
        var variables = void 0;
        var operationName = void 0;

        // Promises are used as a mechanism for capturing any thrown errors during
        // the asynchronous process below.

        // Parse the Request to get GraphQL request parameters.
        return getGraphQLParams(request)
            .then(
                function(graphQLParams) {
                    params = graphQLParams;
                    // Then, resolve the Options to get OptionsData.
                    return params;
                },
                function(error) {
                    // When we failed to parse the GraphQL parameters, we still need to get
                    // the options object, so make an options call to resolve just that.
                    return response.status(400).send({
                        message: 'Failed to get query params while parsing request.'
                    });
                }
            )
            .then(function() {
                // Assert that schema is required.
                if (!options.schema) {
                    throw new Error('GraphQL middleware options must contain a schema.');
                }

                // Collect information from the options data object.
                var schema = options.schema;
                var rootValue = options.rootValue;
                var fieldResolver = options.fieldResolver;

                context = options.context || request;

                var validationRules = _graphql.specifiedRules;
                if (options.validationRules) {
                    validationRules = validationRules.concat(options.validationRules);
                }

                // GraphQL HTTP only supports GET and POST methods.
                if (request.method !== 'GET' && request.method !== 'POST') {
                    response.setHeader('Allow', 'GET, POST');
                    response.status(405).send('GraphQL only supports GET and POST requests.');
                    throw httpErrors(405, 'GraphQL only supports GET and POST requests.');
                }

                // Get GraphQL params from the request and POST body data.
                query = params.query;
                variables = params.variables;
                operationName = params.operationName;

                // If there is no query, but GraphiQL will be displayed, do not produce
                // a result, otherwise return a 400: Bad Request.
                if (!query) {
                    throw httpErrors(400, 'Must provide query string.');
                }

                // Validate Schema
                var schemaValidationErrors = _graphql.validateSchema(schema);
                if (schemaValidationErrors.length > 0) {
                    // Return 500: Internal Server Error if invalid schema.
                    response.statusCode = 500;
                    return { errors: schemaValidationErrors };
                }

                //  GraphQL source.
                var source = new _graphql.Source(query, 'GraphQL request');

                // Parse source to AST, reporting any syntax error.
                try {
                    documentAST = _graphql.parse(source);
                } catch (syntaxError) {
                    // Return 400: Bad Request if any syntax errors errors exist.
                    response.statusCode = 400;
                    return { errors: [syntaxError] };
                }

                // Validate AST, reporting any errors.
                var validationErrors = _graphql.validate(schema, documentAST, validationRules);
                if (validationErrors.length > 0) {
                    // Return 400: Bad Request if any validation errors exist.
                    response.statusCode = 400;
                    return { errors: validationErrors };
                }

                // Only query operations are allowed on GET requests.
                if (request.method === 'GET') {
                    // Determine if this GET request will perform a non-query.
                    var operationAST = _graphql.getOperationAST(documentAST, operationName);
                    if (operationAST && operationAST.operation !== 'query') {
                        // Otherwise, report a 405: Method Not Allowed error.
                        response.setHeader('Allow', 'POST');
                        throw httpErrors(
                            405,
                            'Can only perform a ' +
                                operationAST.operation +
                                ' operation ' +
                                'from a POST request.'
                        );
                    }
                }
                // Perform the execution, reporting any errors creating the context.
                try {
                    return _graphql.execute(
                        schema,
                        documentAST,
                        rootValue,
                        context,
                        variables,
                        operationName,
                        fieldResolver
                    );
                } catch (contextError) {
                    // Return 400: Bad Request if any execution context errors exist.
                    response.statusCode = 400;
                    return { errors: [contextError] };
                }
            })
            .catch(function(error) {
                // If an error was caught, report the httpError status, or 500.
                response.statusCode = error.status || 500;
                return { errors: [error] };
            })
            .then(function(result) {
                // If no data was included in the result, that indicates a runtime query
                // error, indicate as such with a generic status code.
                // Note: Information about the error itself will still be contained in
                // the resulting JSON payload.
                // http://facebook.github.io/graphql/#sec-Data
                if (response.statusCode === 200 && result && !result.data) {
                    response.statusCode = 500;
                }
                // Format any encountered errors.
                if (result && result.errors) {
                    result.errors = result.errors.map(_graphql.formatError);
                }

                // At this point, result is guaranteed to exist, as the only scenario
                // where it will not is when showGraphiQL is true.
                if (!result) {
                    throw httpErrors(500, 'Internal Error');
                }

                return result;
            });
    };
};
