import * as cookies from 'cookies';

export const setCookie = (req, res, token: string) => {
    new cookies(req, res).set('access_token', token, {
        httpOnly: true,
        secure: false, // dev environment
    });
};

