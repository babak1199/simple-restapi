const config = require('./lib/common/config/env.config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const apicache = require('apicache');

// let cache = apicache.middleware;

const AWSXRay = require('aws-xray-sdk');

const AuthorizationRouter = require('./lib/authorization/routes.config');
const UsersRouter = require('./lib/users/routes.config');
const SubjectsRouter = require('./lib/subjects/routes.config');
const RatingsRouter = require('./lib/ratings/routes.config');
const TagsRouter = require('./lib/tags/routes.config');
const SubjectTemplatesRouter = require('./lib/subjectTemplates/routes.config');

const LoggingMiddleware = require('./lib/common/middlewares/logging.middleware');

// TODO: configure proper caching strategy
// app.use(cache('5 minutes'));

app.use(AWSXRay.express.openSegment('SimpleRESTApiApp'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

    console.info(`- Received: [${req.method}] ${req.url}`
        + (req.body ? '\n   Reqest body: ' + JSON.stringify(req.body, null, 2) : ''));

    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(LoggingMiddleware.logResponse);

app.use(bodyParser.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
SubjectsRouter.routesConfig(app);
RatingsRouter.routesConfig(app);
TagsRouter.routesConfig(app);
SubjectTemplatesRouter.routesConfig(app);

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});

app.use(AWSXRay.express.closeSegment());
