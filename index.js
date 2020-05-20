const config = require('./lib/common/config/env.config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const AuthorizationRouter = require('./lib/authorization/routes.config');
const UsersRouter = require('./lib/users/routes.config');
const SubjectsRouter = require('./lib/subjects/routes.config');
const RatingsRouter = require('./lib/ratings/routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    console.log(JSON.stringify(req.body, null, 2));
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
SubjectsRouter.routesConfig(app);
RatingsRouter.routesConfig(app);

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
