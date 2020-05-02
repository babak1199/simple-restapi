const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

var middleware = PermissionMiddleware.minimumPermissionLevelRequired;

var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon  = require('sinon');

describe('minimum permission level middleware', function() {

    function setUserPermissionLevel(level) {
        return { permissionLevel: level };
    }

    function setRequiredPremissionLevel(level) {
        return middleware(level);
    }

    function createHttpResponse() {
        var res = {
            statusCode: 0,
            sendCalled: false,
            status: function(s) {
                res.statusCode = s;
                return {
                    send: function() {
                        res.sendCalled = true;
                    }
                };
            }
        };

        return res;
    }

    describe('request handler creation', function() {
        var mw;

        beforeEach(function() {
            mw = middleware(ADMIN);
        });

        it('should not be empty', function() {
            assert.isNotNull(mw, 'Middleware is empty.');
        });

        it('should return a function()', function() {
            assert.equal(typeof(mw), 'function');
        });

        it('should accept three arguments', function() {
            expect(mw.length).to.equal(3);
        });

    });

    [
        ADMIN,
        PAID,
        FREE
    ].forEach(function(requiredPermission) {

        describe(`request handling: ${requiredPermission} level permission check`, function() {

            var req, mw;

            this.beforeEach(function() {
                mw = setRequiredPremissionLevel(requiredPermission);
                req = {};
            });

            it('should call allow access for a user with ADMIN level permission', function() {
                var nextSpy = sinon.spy();
                req.jwt = setUserPermissionLevel(ADMIN);
                var res = createHttpResponse();;

                mw(req, res, nextSpy);
                expect(nextSpy.calledOnce).to.be.true;
            });

            it('should return 403 for a user with FREE level permission', function() {
                var nextSpy = sinon.spy();
                req.jwt = setUserPermissionLevel(FREE);

                var res = createHttpResponse();;

                mw(req, res, nextSpy);
                expect(nextSpy.called).to.be.false;
                expect(res.statusCode).to.be.equal(403);
                expect(res.sendCalled).to.be.true;
            });
        });
    });
});
