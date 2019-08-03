const licenseFile = require('nodejs-license-file');
const fs = require('fs');

const template = [
    '====BEGIN LICENSE====',
    '{{&licenseVersion}}',
    '{{&applicationVersion}}',
    '{{&firstName}}',
    '{{&lastName}}',
    '{{&email}}',
    '{{&expirationDate}}',
    '{{&features}}',
    '{{&serial}}',
    '=====END LICENSE=====',
].join('\n');

try {
    const licenseFileContent = licenseFile.generate({
        privateKeyPath: './private_key.pem',
        template,
        data: {
            licenseVersion: '1',
            applicationVersion: '1.0.0',
            firstName: 'Ritesh',
            lastName: 'Ranjan',
            email: '91.ranjan@gmail.com',
            expirationDate: '12/10/2020',
            features: JSON.stringify({
                test_manager: {
                    release: 1,
                    feature: 1,
                    usecase: 1,
                    flows: -1,
                    steps: -1,
                },
                bug_manager: {
                    third_party: 1,
                },
            }),
        },
    });

    try {
        fs.writeFileSync('license.lic', licenseFileContent, { mode: 0o755 });
    } catch (err) {
        // An error occurred
        console.error(err);
    }
} catch (err) {
    console.log(err);
}

module.exports = { template };
