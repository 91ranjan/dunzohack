import Cache from '../utils/Cache';
import { Map } from 'immutable';
import UserACPModel from '../model/UserACPModel';
import AppFeatureModel from '../model/AppFeatureModel';

/**
 * Returns the object for user acp
 * @param acps { Array } Array of user ACPs
 * @returns { Object } Return the flowing object
 * {
 *  feature_key: {
 *      entity_name: {
 *          operation: {
 *              product_id: ownership
 *          }
 *      }
 *  }
 * }
 */
export const createACP = async acps => {
    let acpObj = Map();
    const features = await AppFeatureModel.getAll({ limit: 999 });
    acps.forEach(acp => {
        const productId = acp.role_acp.product.id;
        // Creating the product key
        if (acp.role_acp.access_all) {
            acpObj = acpObj.set(productId, true);
        } else {
            features.forEach(featureACP => {
                const featureAttr = {};
                const acpKey = featureACP.key;
                featureACP.permission_attrs.forEach(attr => {
                    featureAttr[attr.id] = attr;
                });
                acp.role_acp.permissions.forEach(permissionId => {
                    const perm = featureAttr[permissionId];
                    if (perm) {
                        acpObj = acpObj.setIn(
                            [acpKey, perm.entity, perm.operation, productId],
                            true
                        );
                    }
                });
            });
        }
    });
    return acpObj.toJS();
};

export const updateACP = async (userId, token?) => {
    const acps = await UserACPModel.getAll({
        user: userId,
        limit: 999,
    });
    let userCache = await Cache.get(userId);
    if (userCache) {
        userCache.acps = await createACP(acps);
        if (token) {
            userCache.token = token;
        }
    } else {
        userCache = {
            token,
            acps: await createACP(acps),
        };
    }
    await Cache.set(userId, userCache);
};
