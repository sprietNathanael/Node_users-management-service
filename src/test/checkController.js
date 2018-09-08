const FunctionWithoutReturnTester = require("../nodeMochaTestGenerator/FunctionWithoutReturnTester");
const ParameterType = require("../nodeMochaTestGenerator/ParameterType");
const SingleAssertEqualsTestParameters = require("../nodeMochaTestGenerator/SingleAssertEqualsTestParameters");

const Controller = require("../controller/controller");

const logger = require("../logger")("error");

const fs = require('fs');

const assert = require('assert');

const jwt = require("jsonwebtoken");

// delete database if exists

const dbPath = "test/usersCheckController.sqlite";

var token;

var incorrectToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 15),
    jwtid: Math.random().toString(),
}, "falsePassphrase");

var expiredToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 15),
    jwtid: Math.random().toString(),
}, "thisisapassphrase");

var notExistingToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 15),
    jwtid: Math.random().toString(),
}, "thisisapassphrase");

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

//----------------------- Server Response ---------------------------

class ServerResponse {
    constructor() {
        this.statusCode = undefined;
    }

    status(code) {
        this.statusCode = code;
        return this;
    }

    send(truc) {
        return this;
    }
}

var mockServerResponse = new ServerResponse();

const serverResponseTestParameters = [];

var serverResponseParameterType = new ParameterType("ServerResponse", serverResponseTestParameters, mockServerResponse, 123);

//----------------------- id ---------------------------

const idTestParameters = [];

var idParameterType = new ParameterType("id", idTestParameters, 1, "1");

//----------------------- name ---------------------------

var nameParameterType = new ParameterType("name", [], "TestT_-éÉêËàÀçÇÿ", 123);

//----------------------- username ---------------------------

var usernameParameterType = new ParameterType("username", [], "abcABC_-1234", 123);

//----------------------- password ---------------------------

var passwordParameterType = new ParameterType("password", [], "abc132¨ê$Ç+²", 123);

//----------------------- adminPermission ---------------------------

var adminPermissionParameterType = new ParameterType("adminPermission", [], 1, "123");

//----------------------- token ---------------------------

var tokenParameterType = new ParameterType("token", [], "abc132¨ê$Ç+²", 123);

require("../modelInit")(dbPath).then((model) => {
    model.User.create({
        lastname: "test",
        firstname: "test",
        username: "test",
        password: "testtest"
    });

    var controller = new Controller(model.User, logger);

    model.User.findAll().then((users) => {


        //------------------- getUsers -----------------------

        var checkGetUsers = new FunctionWithoutReturnTester(controller.getUsers, [{
            type: serverResponseParameterType,
            name: "res"
        }], controller, [{
            description: "serverResponse.status with parameter 200",
            parametersToTest: [mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [200],
            promise: true,
        }, {
            description: "serverResponse.send with users as parameters",
            parametersToTest: [mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [users],
            promise: true,
        }]);

        //------------------- getUserById -----------------------

        var checkGetUserById = new FunctionWithoutReturnTester(controller.getUserById, [{
            type: idParameterType,
            name: "id"
        }, {
            type: serverResponseParameterType,
            name: "res"
        }], controller, [{
            description: "serverResponse.send with parameter 404 if the user does not exist",
            parametersToTest: [100, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [404],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 200 if the user exists",
            parametersToTest: [1, mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [200],
            promise: true,
        }, {
            description: "serverResponse.send with user as parameter if the user exists",
            parametersToTest: [1, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [users[0]],
            promise: true,
        }]);

        //------------------- createUser -----------------------

        var checkCreateUser = new FunctionWithoutReturnTester(controller.createUser, [{
                type: nameParameterType,
                name: "lastname"
            },
            {
                type: nameParameterType,
                name: "firstname"
            },
            {
                type: usernameParameterType,
                name: "username"
            },
            {
                type: passwordParameterType,
                name: "password"
            }, {
                type: serverResponseParameterType,
                name: "res"
            }
        ], controller, [{
            description: "serverResponse.status with parameter 400 if the username already exists",
            parametersToTest: ["test", "test", "test", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [400],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 400 if the lastname is not correct",
            parametersToTest: ["test1", "test", "test", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [400],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Wrong lastname' if the lastname is not correct",
            parametersToTest: ["test1", "test", "test", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ['Wrong lastname'],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Wrong lastname,password' if the lastname and the password are not correct",
            parametersToTest: ["test1", "test", "test", "test", mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ['Wrong lastname,password'],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 201 if all parameters are correct",
            parametersToTest: ["test", "test", "test2", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [201],
            promise: true,
        }, {
            description: "user 3 should be found with username == test2",
            customTestFunction: () => {
                return model.User.findById(3).then((user) => {
                    assert.equal(user.username, "test2");
                });
            },
            promise: true,
        }, ]);

        //------------------- updateUser -----------------------

        var checkUpdateUser = new FunctionWithoutReturnTester(controller.updateUser, [{
            type: idParameterType,
            name: "id"
        }, {
            type: nameParameterType,
            name: "lastname"
        }, {
            type: nameParameterType,
            name: "firstname"
        }, {
            type: usernameParameterType,
            name: "username"
        }, {
            type: passwordParameterType,
            name: "password"
        }, {
            type: adminPermissionParameterType,
            name: "adminPermission"
        }, {
            type: serverResponseParameterType,
            name: "res"
        }], controller, [{
            description: "serverResponse.status with parameter 400 if the username already exists",
            parametersToTest: [1, "test", "test", "test2", "testtest", 1, mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [400],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Username already exists' if the username already exists",
            parametersToTest: [1, "test", "test", "test2", "testtest", 1, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ['Username already exists'],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 400 if the lastname is not correct",
            parametersToTest: [1, "test1", "test", "test", "testtest", 1, mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [400],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Wrong lastname' if the lastname is not correct",
            parametersToTest: [1, "test1", "test", "test", "testtest", 1, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ['Wrong lastname'],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Wrong lastname,password' if the lastname and the password are not correct",
            parametersToTest: [1, "test1", "test", "test", "test", 1, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ['Wrong lastname,password'],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 404 if the user does not exists",
            parametersToTest: [10, "test", "test", "test", "testtest", 1, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [404],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 201 if the user has been correctly updated",
            parametersToTest: [3, "testT", "testT", "test3", "testtest3", 1, mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [201],
            promise: true,
        }, {
            description: "The user 3 should be found updated",
            customTestFunction: () => {
                return model.User.findById(3).then((user) => {
                    assert.equal(user.lastname, "testT");
                    assert.equal(user.firstname, "testT");
                    assert.equal(user.username, "test3");
                    assert.equal(user.password, "testtest3");
                });
            },
            promise: true,
        }]);

        //------------------- updateUser -----------------------

        var checkDeleteUser = new FunctionWithoutReturnTester(controller.deleteUser, [{
            type: idParameterType,
            name: "id"
        }, {
            type: serverResponseParameterType,
            name: "res"
        }], controller, [{
            description: "serverResponse.send with parameter 404 if the user does not exists",
            parametersToTest: [10, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [404],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 200 if the user is correctly deleted",
            parametersToTest: [3, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [200],
            promise: true,
        }, {
            description: "The user 3 should be deleted",
            customTestFunction: () => {
                return model.User.findById(3).then((user) => {
                    assert.equal(user, null);
                });
            },
            promise: true,
        }, {
            description: "There should be only 1 users",
            customTestFunction: () => {
                return model.User.findAll().then((users) => {
                    assert.equal(users.length, 1);
                });
            },
            promise: true,
        }]);

        //------------------- login -----------------------

        var checkLogin = new FunctionWithoutReturnTester(controller.login, [{
            type: usernameParameterType,
            name: "username"
        }, {
            type: passwordParameterType,
            name: "password"
        }, {
            type: serverResponseParameterType,
            name: "res"
        }], controller, [{
            description: "serverResponse.status with parameter 401 if the username is not correct",
            parametersToTest: ["test2", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [401],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Wrong username / password' if the username is not correct",
            parametersToTest: ["test2", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ["Wrong username / password"],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Wrong username / password' if the password is not correct",
            parametersToTest: ["test", "testtest2", mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ["Wrong username / password"],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 200 if the username / password is correct",
            parametersToTest: ["abcABC_-1234", "abc132¨ê$Ç+²", mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [200],
            promise: true,
        }, {
            description: "The user should have 3 tokens",
            customTestFunction: () => {
                return controller.login("abcABC_-1234", "abc132¨ê$Ç+²", mockServerResponse).then((user) => {

                    return user.getTokens().then((tokens) => {
                        assert.equal(tokens.length, 3);
                        token = tokens[0].token;
                    });;
                });
            },
            promise: true,
        }]);

        //------------------- logout -----------------------

        var checkLogout = new FunctionWithoutReturnTester(controller.logout, [{
            type: usernameParameterType,
            name: "username"
        }, {
            type: tokenParameterType,
            name: "token"
        }, {
            type: serverResponseParameterType,
            name: "res"
        }], controller, [{
            description: "serverResponse.send with parameter 404 if the user does not exists",
            parametersToTest: ["test", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [404],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 404 if the token does not exists",
            parametersToTest: ["abcABC_-1234", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [404],
            promise: true,
        }, {
            description: "Token should still exists",
            customTestFunction: () => {
                return model.User.findById(2).then((user) => {
                    return user.getTokens({
                        where: {
                            token: token
                        }
                    }).then((tokens) => {
                        assert.equal(tokens.length,1);
                    });;
                });
            },
            promise: true,
        }, {
            description: "Token should not exist anymore after logout",
            customTestFunction: () => {
                return controller.logout("abcABC_-1234", token, mockServerResponse).then(() => {
                    return model.User.findById(2).then((user) => {
                        return user.getTokens({
                            where: {
                                token: token
                            }
                        }).then((tokens) => {
                            assert.equal(tokens.length,0);
                        });;
                    });
                });
            },
            promise: true,
        }]);

        //------------------- tryToken -----------------------

        var checkTryToken = new FunctionWithoutReturnTester(controller.tryToken, [{
            type: usernameParameterType,
            name: "username"
        }, {
            type: tokenParameterType,
            name: "token"
        }, {
            type: serverResponseParameterType,
            name: "res"
        }], controller, [{
            description: "serverResponse.send with parameter 404 if the user does not exists",
            parametersToTest: ["test", "testtest", mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [404],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 401 if the token is not correct",
            parametersToTest: ["abcABC_-1234", incorrectToken, mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [401],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Token is invalid' if the token is not correct",
            parametersToTest: ["abcABC_-1234", incorrectToken, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ["Token is invalid"],
            promise: true,
        }, {
            description: "serverResponse.status with parameter 401 if the token is expired",
            parametersToTest: ["abcABC_-1234", expiredToken, mockServerResponse],
            expectedFunction: mockServerResponse.status,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [401],
            promise: true,
        }, {
            description: "serverResponse.send with parameter 'Token has expired' if the token is expired",
            parametersToTest: ["abcABC_-1234", expiredToken, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: ["Token has expired"],
            promise: true,
        },{
            description: "serverResponse.send with parameter 404 if the token does not exists",
            parametersToTest: ["abcABC_-1234", notExistingToken, mockServerResponse],
            expectedFunction: mockServerResponse.send,
            expectedFunctionContext: mockServerResponse,
            expectedParameters: [404],
            promise: true,
        }, {
            description: "Should return true if the token is correct",
            customTestFunction: () => {
                return controller.tryToken("abcABC_-1234", token, mockServerResponse).then((res) => {
                    assert.equal(res,true);
                });
            },
            promise: true,
        }]);

        describe('Controller', function () {

            after(function () {
                fs.unlinkSync(dbPath);
            });
            checkGetUsers.testFunction();

            checkGetUserById.testFunction();

            checkCreateUser.testFunction();

            checkUpdateUser.testFunction();

            checkDeleteUser.testFunction();

            checkLogin.testFunction();

            checkTryToken.testFunction();

            checkLogout.testFunction();


        });

        run();
    });
});