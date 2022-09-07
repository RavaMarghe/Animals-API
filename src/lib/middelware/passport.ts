import passport from "passport";
import passportGithub2 from "passport-github2";
import { RequestHandler, response } from "express";

import config from "../../config";
import { request } from "http";

const githubStrategy = new passportGithub2.Strategy(
    {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
    },
    function (
        accessToken: string,
        refreshToken: string,
        profile: { [key: string]: string },
        done: (error: null, user: Express.User) => void
    ) {
        const user: Express.User = {
            username: profile.username,
        };

        done(null, user);
    }
);

passport.use(githubStrategy);

passport.serializeUser<Express.User>((user, done) => done(null, user));

passport.deserializeUser<Express.User>((user, done) => done(null, user));

const checkAuthorization: RequestHandler = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }

    response.status(401).end();
};

export { passport, checkAuthorization };
