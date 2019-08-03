import { loadLicense } from '../../update_license';

class LicenseManager {
    _license;
    _features;
    constructor() {
        this._license = loadLicense();
        this._features = JSON.parse(this._license.features);
    }
    getLicense = () => {
        return this._license;
    };
    getFeatures = () => {
        return this._features;
    };
}
export default new LicenseManager();
