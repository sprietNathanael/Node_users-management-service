const fs = require('fs');
const assert = require("assert");
const dbPath = "test/usersCheckAPI.sqlite";
const should = require("should");
const jwt = require("jsonwebtoken");

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const request = require('supertest');
const express = require('express');
const router = require("../controller/router");
const Controller = require("../controller/controller");

const logger = require("../logger")("error");

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

require("../modelInit")(dbPath).then((model) => {
    model.User.create({
        lastname: "test",
        firstname: "test",
        username: "test",
        password: "testtest"
    });

    let controller = new Controller(model.User, logger);
    var app = express();
    router.initilizeRoutes(app, controller, logger);
    let server = require('http').Server(app);


    const requestsToTest = [
        //-------------------------- GET /users ---------------------
        {
            description: "GET /users",
            function: request(app).get,
            tests: [{
            route: "/users",
            description: "Response should be 200 with users list",
            code: 200,
            format: "application/json",
            function: (res) => {
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0].id, 1);
                assert.equal(res.body[0].username, "test");
                assert.equal(res.body[0].password, undefined);
                assert.equal(res.body[0].createdAt, undefined);
                assert.equal(res.body[0].updatedAt, undefined);
            }
        }]
    },
    //-------------------------- GET /users:id ---------------------
    {
        description: "GET /users:id",
        function: request(app).get,
        tests: [{
            route: "/users/a",
            description: "Response should be 400 if the id is not a number",
            code: 400,
            format: "application/json"
        }, {
            route: "/users/10",
            description: "Response should be 404 if the id is 10",
            code: 404,
            format: "application/json"
        }, {
            route: "/users/1",
            description: "Response should be 200 if the id is 1",
            code: 200,
            format: "application/json",
            function: (res) => {
                assert.equal(res.body.id, 1);
                assert.equal(res.body.username, "test");
            }
        }, ]
    },
    //-------------------------- POST /users ---------------------
    {
        description: "POST /users",
        function: request(app).post,
        tests: [{
            route: "/users",
            sending: {
                lastname: 1,
                firstname: "testT",
                username: "test2",
                password: "testtest2"
            },
            description: "Response should be 400 if the lastname is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "lastname is wrong : number is not a string");
            }
        }, {
            route: "/users",
            sending: {
                lastname: "testT",
                firstname: 1,
                username: "test2",
                password: "testtest2"
            },
            description: "Response should be 400 if the firstname is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "firstname is wrong : number is not a string");
            }
        }, {
            route: "/users",
            sending: {
                lastname: "testT",
                firstname: "testT",
                username: 1,
                password: "testtest2"
            },
            description: "Response should be 400 if the username is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "username is wrong : number is not a string");
            }
        }, {
            route: "/users",
            sending: {
                lastname: "testT",
                firstname: "testT",
                username: "test2",
                password: 1
            },
            description: "Response should be 400 if the password is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "password is wrong : number is not a string");
            }
        }, {
            route: "/users",
            sending: {
                lastname: "test1",
                firstname: "testT",
                username: "test2",
                password: "testtest2"
            },
            description: "Response should be 400 if the lastname is not correct",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Wrong lastname");
            }
        }, {
            route: "/users",
            sending: {
                lastname: "test1",
                firstname: "testT",
                username: "testé",
                password: "testtest2"
            },
            description: "Response should be 400 if the lastname and username are not correct",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Wrong lastname,username");
            }
        }, {
            route: "/users",
            sending: {
                lastname: "test",
                firstname: "test",
                username: "test",
                password: "testtest"
            },
            description: "Response should be 400 if the username already exists",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Username already exists");
            }
        }, {
            route: "/users",
            sending: {
                lastname: "testT",
                firstname: "testT",
                username: "test2",
                password: "testtest2"
            },
            description: "Response should be 201 if the user is correct",
            code: 201,
            format: "application/body",
            function: (res) => {
                assert.equal(res.body.id, 2);
                assert.equal(res.body.lastname, "testT");
                assert.equal(res.body.firstname, "testT");
                assert.equal(res.body.username, "test2");
                assert.equal(res.body.password, undefined);
                assert.equal(res.body.createdAt, undefined);
                assert.equal(res.body.updatedAt, undefined);
            }
        }]
    },
    //-------------------------- PUT /users:id ---------------------
    {
        description: "PUT /users:id",
        function: request(app).put,
        tests: [{
            route: "/users/a",
            sending: {
                lastname: "testT",
                firstname: "testT",
                username: "test20",
                password: "testtest20",
                adminPermission: 0
            },
            description: "Response should be 400 if the id is not a number",
            code: 400,
            format: "application/text"
        }, {
            route: "/users/10",
            sending: {
                lastname: "testT",
                firstname: "testT",
                username: "test20",
                password: "testtest20",
                adminPermission: 0
            },
            description: "Response should be 404 if the id is not found",
            code: 404,
            format: "application/text"
        }, {
            route: "/users/2",
            sending: {
                lastname: 1,
                firstname: "testT",
                username: "test2",
                password: "testtest2",
                adminPermission: 0
            },
            description: "Response should be 400 if the lastname is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "lastname is wrong : number is not a string");
            }
        }, {
            route: "/users/2",
            sending: {
                lastname: "testT",
                firstname: 1,
                username: "test2",
                password: "testtest2",
                adminPermission: 0
            },
            description: "Response should be 400 if the firstname is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "firstname is wrong : number is not a string");
            }
        }, {
            route: "/users/2",
            sending: {
                lastname: "testT",
                firstname: "testT",
                username: 1,
                password: "testtest2",
                adminPermission: 0
            },
            description: "Response should be 400 if the username is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "username is wrong : number is not a string");
            }
        }, {
            route: "/users/2",
            sending: {
                lastname: "testT",
                firstname: "testT",
                username: "test2",
                password: 1,
                adminPermission: 0
            },
            description: "Response should be 400 if the password is a number",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "password is wrong : number is not a string");
            }
        }, {
            route: "/users/2",
            sending: {
                lastname: "test1",
                firstname: "testT",
                username: "test2",
                password: "testtest2",
                adminPermission: 0
            },
            description: "Response should be 400 if the lastname is not correct",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Wrong lastname");
            }
        }, {
            route: "/users/2",
            sending: {
                lastname: "test1",
                firstname: "testT",
                username: "testé",
                password: "testtest2",
                adminPermission: 0
            },
            description: "Response should be 400 if the lastname and username are not correct",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Wrong lastname,username");
            }
        }, {
            route: "/users/2",
            sending: {
                lastname: "test",
                firstname: "test",
                username: "test",
                password: "testtest",
                adminPermission: 0
            },
            description: "Response should be 400 if the username already exists",
            code: 400,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Username already exists");
            }
        }, {
            route: "/users/2",
            sending: {
                lastname: "testR",
                firstname: "testR",
                username: "test5",
                password: "testtest5",
                adminPermission: 0
            },
            description: "Response should be 201 if the user is correct",
            code: 201,
            format: "application/body",
            function: (res) => {
                assert.equal(res.body.id, 2);
                assert.equal(res.body.lastname, "testR");
                assert.equal(res.body.firstname, "testR");
                assert.equal(res.body.username, "test5");
                assert.equal(res.body.password, undefined);
                assert.equal(res.body.createdAt, undefined);
                assert.equal(res.body.updatedAt, undefined);
            }
        }]
    },
    //-------------------------- POST /login ---------------------
    {
        description: "POST /login",
        function: request(app).post,
        tests: [{
            route: "/login",
            sending: {
                username: 1,
                password: "testtest5"
            },
            description: "Response should be 400 if the username is not a string",
            code: 400,
            format: "application/text"
        },{
            route: "/login",
            sending: {
                username: "test5",
                password: 1
            },
            description: "Response should be 400 if the password is not a string",
            code: 400,
            format: "application/text"
        },{
            route: "/login",
            sending: {
                username: "testFalse",
                password: "testtest5"
            },
            description: "Response should be 401 if the user is not correct",
            code: 401,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Wrong username / password");
            }
        },{
            route: "/login",
            sending: {
                username: "testFalse",
                password: "testtestFalse"
            },
            description: "Response should be 401 if the password is not correct",
            code: 401,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Wrong username / password");
            }
        },{
            route: "/login",
            sending: {
                username: "test5",
                password: "testtest5"
            },
            description: "Response should be 200 if the user can log",
            code: 200,
            format: "application/body",
            function: (res) => {
                assert.equal(res.body.id, 2);
                assert.equal(res.body.lastname, "testR");
                assert.equal(res.body.firstname, "testR");
                assert.equal(res.body.username, "test5");
                assert.equal(res.body.password, undefined);
                assert.equal(res.body.createdAt, undefined);
                assert.equal(res.body.updatedAt, undefined);
                assert.equal(typeof res.body.token, "string");
                token = res.body.token;
            }
        }]
    },
    //-------------------------- POST /tryToken ---------------------
    {
        description: "POST /tryToken",
        function: request(app).post,
        tests: [{
            route: "/tryToken",
            sending: {
                username: 1,
                token: "testtest5"
            },
            description: "Response should be 400 if the username is not a string",
            code: 400,
            format: "application/text"
        },{
            route: "/tryToken",
            sending: {
                username: "test5",
                token: 1
            },
            description: "Response should be 400 if the token is not a string",
            code: 400,
            format: "application/text"
        },{
            route: "/tryToken",
            sending: {
                username: "testFalse",
                token: "testtest"
            },
            description: "Response should be 404 if the user does not exists",
            code: 401,
            format: "application/text"
        },{
            route: "/tryToken",
            sending: {
                username: "test",
                token: incorrectToken
            },
            description: "Response should be 401 if the token is not correct",
            code: 401,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Token is invalid");
            }
        },{
            route: "/tryToken",
            sending: {
                username: "test",
                token: expiredToken
            },
            description: "Response should be 401 if the token is expired",
            code: 401,
            format: "application/text",
            function: (res) => {
                assert.equal(res.text, "Token has expired");
            }
        },{
            route: "/tryToken",
            sending: {
                username: "test",
                token: notExistingToken
            },
            description: "Response should be 404 if the token does not exists",
            code: 401,
            format: "application/text"
        }]
    },
    //-------------------------- POST /logout ---------------------
    {
        description: "POST /logout",
        function: request(app).post,
        tests: [{
            route: "/logout",
            sending: {
                username: 1,
                token: "testtest5"
            },
            description: "Response should be 400 if the username is not a string",
            code: 400,
            format: "application/text"
        },{
            route: "/logout",
            sending: {
                username: "test5",
                token: 1
            },
            description: "Response should be 400 if the token is not a string",
            code: 400,
            format: "application/text"
        },{
            route: "/logout",
            sending: {
                username: "testFalse",
                token: "testtest"
            },
            description: "Response should be 404 if the user does not exists",
            code: 404,
            format: "application/text"
        },{
            route: "/logout",
            sending: {
                username: "test",
                token: notExistingToken
            },
            description: "Response should be 404 if the token does not exists",
            code: 404,
            format: "application/text"
        }]
    },
    //-------------------------- DELETE /users:id ---------------------
    {
        description: "DELETE /users/:id",
        function: request(app).delete,
        tests: [{
            route: "/users/a",
            description: "Response should be 400 if the id is not a number",
            code: 400,
            format: "application/text"
        }, {
            route: "/users/10",
            description: "Response should be 404 if the id is not found",
            code: 404,
            format: "application/text"
        }, {
            route: "/users/2",
            description: "Response should be 200 if user has been deleted",
            code: 200,
            format: "application/text"
        }]
    },
    //-------------------------- GET /test ---------------------
    {
        description: "GET /test",
        function: request(app).get,
        tests: [{
            route: "/test",
            description: "Response should be 404 if the URL is different from /users",
            code: 404,
            format: "application/text"
        }]
    }];

    server.listen(5801);
    describe("Test API", function () {
        for (let req of requestsToTest) {
            describe(req.description, function () {
                for (let test of req.tests) {
                    it(test.description, function (done) {
                        req.function(test.route)
                            .send(test.sending)
                            .set('Accept', test.format)
                            .expect(test.code)
                            .expect(function (res) {
                                if (test.function !== undefined) {
                                    test.function(res);
                                }
                            })
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                } else {
                                    return done();
                                }
                            });

                    });
                }
            });
        }
        after(function () {
            fs.unlinkSync(dbPath);
            server.close();
        });
    });

    run();
});