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

var tokenParameterType = new ParameterType("token", [], notExistingToken, 123);

require("../modelInit")(dbPath).then((model) => {
    model.User.create({
        lastname: "test",
        firstname: "test",
        username: "test",
        password: "testtest"
    });

    var controller = new Controller(model.User, logger);

    model.User.findAll().then((users) => {

        //------------------- getAllUsers -----------------------

        var checkGetUsers = new FunctionWithoutReturnTester(controller.getUsers, [], controller, [{
            description: "should return the users",
            promise: true,
            customTestFunction: () => {
                return controller.getUsers().then((res) => {
                    assert.equal(res.length, 1);
                    assert.equal(res[0].lastname, "test");
                    assert.equal(res[0].firstname, "test");
                    assert.equal(res[0].username, "test");
                    assert.equal(res[0].password, "testtest");
                });
            }
        }]);


        //------------------- getUserById -----------------------

        var checkGetUserById = new FunctionWithoutReturnTester(controller.getUserById, [{
            type: idParameterType,
            name: "id"
        }], controller, [{
            description: "null if the user does not exist",
            parametersToTest: [100],
            expectedResult: null,
            promise: true,
        }, {
            description: "should return the user if it exists",
            promise: true,
            customTestFunction: () => {
                return controller.getUserById(1).then((res) => {
                    assert.equal(res.lastname, "test");
                    assert.equal(res.firstname, "test");
                    assert.equal(res.username, "test");
                    assert.equal(res.password, "testtest");
                });
            }
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
            }
        ], controller, [{
            description: "should throw an error if the username already exists",
            promise: true,
            customTestFunction: () => {
                return controller.createUser("test", "test", "test", "testtest").catch((error) => {
                    assert.equal(error.message, "Username already exists");
                });
            }
        }, {
            description: "should throw an error if the lastname is not correct",
            promise: true,
            customTestFunction: () => {
                return controller.createUser("test1", "test", "test", "testtest").catch((error) => {
                    assert.equal(error.message, "Wrong lastname");
                });
            }
        }, {
            description: "should throw an error if the lastname and password is not correct",
            promise: true,
            customTestFunction: () => {
                return controller.createUser("test1", "test", "test", "test").catch((error) => {
                    assert.equal(error.message, "Wrong lastname,password");
                });
            }
        }, {
            description: "should return the user if all parameters are correct",
            promise: true,
            customTestFunction: () => {
                return controller.createUser("test", "test", "test2", "testtest").then((user) => {
                    assert.equal(user.id, 3);
                    assert.equal(user.lastname, "test");
                    assert.equal(user.firstname, "test");
                    assert.equal(user.username, "test2");
                    assert.equal(user.password, "testtest");
                });
            }
        }, {
            description: "user 3 should be found with username == test2",
            customTestFunction: () => {
                return model.User.findById(2).then((user) => {
                    assert.equal(user.username, "abcABC_-1234");
                    return user.destroy().then();
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
        }], controller, [{
            description: "should throw an error if the username already exists",
            promise: true,
            customTestFunction: () => {
                return controller.updateUser(1, "test", "test", "test2", "testtest", 1).catch((error) => {
                    assert.equal(error.message, "Username already exists");
                });
            }
        }, {
            description: "should throw an error if the lastname is not correct",
            promise: true,
            customTestFunction: () => {
                return controller.updateUser(1, "test1", "test", "test", "testtest", 1).catch((error) => {
                    assert.equal(error.message, "Wrong lastname");
                });
            }
        }, {
            description: "should throw an error if the lastname and password is not correct",
            promise: true,
            customTestFunction: () => {
                return controller.updateUser(1, "test1", "test", "test", "test", 1).catch((error) => {
                    assert.equal(error.message, "Wrong lastname,password");
                });
            }
        }, {
            description: "null if the user does not exists",
            parametersToTest: [10, "test", "test", "test", "testtest", 1],
            expectedResult: null,
            promise: true,
        }, {
            description: "should return the user if the user has been correctly updated",
            promise: true,
            customTestFunction: () => {
                return controller.updateUser(3, "testT", "testT", "test3", "testtest3", 1).then((user) => {
                    assert.equal(user.id, 3);
                    assert.equal(user.lastname, "testT");
                    assert.equal(user.firstname, "testT");
                    assert.equal(user.username, "test3");
                    assert.equal(user.password, "testtest3");
                    assert.equal(user.adminPermission, 1);
                });
            }
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

        //------------------- deleteUser -----------------------

        var checkDeleteUser = new FunctionWithoutReturnTester(controller.deleteUser, [{
            type: idParameterType,
            name: "id"
        }], controller, [{
            description: "should throw an error if the user does not exist",
            promise: true,
            customTestFunction: () => {
                return controller.deleteUser(10).catch((error) => {
                    assert.equal(error.message, "User does not exist");
                });
            }
        }, {
            description: "should return true if the user is correctly destroyed",
            promise: true,
            customTestFunction: () => {
                return controller.deleteUser(3).then((res) => {
                    assert.equal(res, true);
                });
            }
        }, {
            description: "The user 3 should be deleted",
            customTestFunction: () => {
                return model.User.findById(3).then((user) => {
                    assert.equal(user, null);
                });
            },
            promise: true,
        }, {
            description: "There should not be users",
            customTestFunction: () => {
                return model.User.findAll().then((users) => {
                    assert.equal(users.length, 0);
                    model.User.create({
                        lastname: "TestT_-éÉêËàÀçÇÿ",
                        firstname: "TestT_-éÉêËàÀçÇÿ",
                        username: "abcABC_-1234",
                        password: "abc132¨ê$Ç+²"
                    });
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
        }], controller, [{
            description: "null if the username is not correct",
            parametersToTest: ["test", "abc132¨ê$Ç+²"],
            expectedResult: null,
            promise: true,
        }, {
            description: "null if the password is not correct",
            parametersToTest: ["abcABC_-1234", "testtest2"],
            expectedResult: null,
            promise: true,
        }, {
            description: "should return the user if the username / password is correct",
            promise: true,
            customTestFunction: () => {
                return controller.login("abcABC_-1234", "abc132¨ê$Ç+²").then((user) => {
                    assert.equal(user.id, 4);
                    assert.equal(user.lastname, "TestT_-éÉêËàÀçÇÿ");
                    assert.equal(user.firstname, "TestT_-éÉêËàÀçÇÿ");
                    assert.equal(user.username, "abcABC_-1234");
                    assert.equal(user.password, undefined);
                });
            }
        }, {
            description: "The user should have 3 tokens",
            customTestFunction: () => {
                return controller.login("abcABC_-1234", "abc132¨ê$Ç+²").then((user) => {

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
        }], controller, [{
            description: "should throw an error if the user does not exist",
            promise: true,
            customTestFunction: () => {
                return controller.logout("test", "testtest").catch((error) => {
                    assert.equal(error.message, "User does not exist");
                });
            }
        }, {
            description: "should throw an error if the token does not exist",
            promise: true,
            customTestFunction: () => {
                return controller.logout("abcABC_-1234", notExistingToken).catch((error) => {
                    assert.equal(error.message, "Token does not exist");
                });
            }
        }, {
            description: "Token should still exists",
            customTestFunction: () => {
                return model.User.findById(4).then((user) => {
                    return user.getTokens({
                        where: {
                            token: token
                        }
                    }).then((tokens) => {
                        assert.equal(tokens.length, 1);
                    });;
                });
            },
            promise: true,
        }, {
            description: "should return true if the user is correctly logged out",
            promise: true,
            customTestFunction: () => {
                return controller.logout("abcABC_-1234", token).then((res) => {
                    assert.equal(res, true);
                });
            }
        }, {
            description: "Token should not exist anymore after logout",
            customTestFunction: () => {
                return model.User.findById(4).then((user) => {
                    return user.getTokens({
                        where: {
                            token: token
                        }
                    }).then((tokens) => {
                        assert.equal(tokens.length, 0);
                    });;
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
        }], controller, [{
            description: "null if the user does not exist",
            parametersToTest: ["test2", "testtest"],
            expectedResult: null,
            promise: true,
        }, {
            description: "should throw an error if the token is not correct",
            promise: true,
            customTestFunction: () => {
                return controller.tryToken("abcABC_-1234", incorrectToken).catch((error) => {
                    assert.equal(error.message, "Token is invalid");
                });
            }
        }, {
            description: "should throw an error if the token is not correct",
            promise: true,
            customTestFunction: () => {
                return controller.tryToken("abcABC_-1234", expiredToken).catch((error) => {
                    assert.equal(error.message, "Token has expired");
                });
            }
        }, {
            description: "false if the token does not exist",
            parametersToTest: ["abcABC_-1234", notExistingToken],
            expectedResult: false,
            promise: true,
        }, {
            description: "Should return true if the token is correct",
            customTestFunction: () => {
                return controller.tryToken("abcABC_-1234", token).then((res) => {
                    assert.equal(res, true);
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