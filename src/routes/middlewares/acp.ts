import { fromJS, Map } from 'immutable';
var jwt = require('jsonwebtoken');
var cookies = require('cookies');
import GlobalVars from '../../utils/GlobalVars';
import Cache from '../../utils/Cache';

export const userAcp = (feature, entity) => {
    return {
        hasPermission: (operation, productIdFn) => {
            return function(
                target: any,
                propertyKey: string,
                descriptor: TypedPropertyDescriptor<(...params: any[]) => Promise<any>>
            ) {
                let oldFunc = descriptor.value;
                descriptor.value = async function(req, res) {
                    const userSession = await Cache.get(req.user._id);
                    if (userSession) {
                        const userACP = fromJS(userSession.acps);
                        let productId = productIdFn(req);
                        const permType = userACP.getIn([feature, entity, operation, productId]);
                        if (!permType) {
                            res.status(400).send({
                                success: false,
                                message: 'Permission denied',
                            });
                        } else {
                            return await oldFunc.apply(this, arguments);
                        }
                    } else {
                        res.status(400).send({
                            success: false,
                            message: 'Permission denied',
                        });
                    }
                };
                return descriptor;
            };
        },
    };
};
