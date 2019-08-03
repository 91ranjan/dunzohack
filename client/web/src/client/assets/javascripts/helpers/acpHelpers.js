import { Map } from 'immutable';

export const createACP = (acps, app_features) => {
    let acpObj = Map();
    acps.forEach(acp => {
        const productId = acp.getIn(['role_acp', 'product', 'id']);
        // Creating the product key
        if (acp.getIn(['role_acp', 'access_all'])) {
            acpObj = acpObj.set(productId, true);
        } else {
            app_features.forEach(featureACP => {
                const featureAttr = {};
                const acpKey = featureACP.get('key');
                featureACP.get('permission_attrs').forEach(attr => {
                    featureAttr[attr.get('id')] = attr;
                });
                acp.getIn(['role_acp', 'permissions']).forEach(permissionId => {
                    const perm = featureAttr[permissionId];
                    if (perm) {
                        acpObj = acpObj.setIn(
                            [acpKey, perm.get('entity'), perm.get('operation'), productId],
                            true
                        );
                    }
                });
            });
        }
    });
    return acpObj;
};
