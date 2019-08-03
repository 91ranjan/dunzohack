import * as licenseFile from 'nodejs-license-file';
import { template } from './generate_license';

export const loadLicense = () => {
    try {
        const data = licenseFile.parse({
            publicKeyPath: './public_key.pem',
            licenseFilePath: './license.lic',
            template,
        });

        return data.data;
    } catch (err) {
        throw new Error('Invalid licence to load.');
    }
};
