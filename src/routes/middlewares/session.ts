import * as nconf from 'nconf';
var jwt = require('jsonwebtoken');
var cookies = require('cookies');
import GlobalVars from '../../utils/GlobalVars';

export const verifyUser = (req, res, next) => {
    var token = req.headers.authorization;
    if (!token) {
        token = new cookies(req, res).get('access_token');
    }
    jwt.verify(token, GlobalVars.get('session_secret'), function(err, user) {
        if (err) {
            res.status(400);
            res.json({
                status: 'FAILURE',
                message: 'User authentication failed',
            });
        } else {
            req.user = user._doc;
            next();
        }
    });
};
