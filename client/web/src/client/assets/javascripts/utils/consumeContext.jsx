import React from 'react';

/**
 * Makes any data stored in React Context available as a prop
 * @param  {String} propKey         Prop name under which to provide the value stored in context
 * @param  {Object} ContextConsumer React Context component, or Context.Consumer
 * @return {Function}               Decorator function that returns the React component with context
 *                                  as prop
 */
export default function consumeContext(propKey, ContextConsumer) {
    return function(DecoratedComponent) {
        return class ContextConnector extends React.PureComponent {
            static displayName = `consumeContext(${propKey})`;

            render() {
                return (
                    <ContextConsumer>
                        {value => {
                            const contextProp = { [propKey]: value };
                            return <DecoratedComponent {...this.props} {...contextProp} />;
                        }}
                    </ContextConsumer>
                );
            }
        };
    };
}