const UserUtils = require("../controller/userUtils");

const logger = require("../logger")("info");

const userUtils = new UserUtils(logger);

const FunctionWithReturnTester = require("../nodeMochaTestGenerator/FunctionWithReturnTester");
const ParameterType = require("../nodeMochaTestGenerator/ParameterType");
const SingleAssertEqualsTestParameters = require("../nodeMochaTestGenerator/SingleAssertEqualsTestParameters");

//----------------------- name -----------------------------


const nameTestParameters = [
    new SingleAssertEqualsTestParameters("is empty", "", false),
    new SingleAssertEqualsTestParameters("contains special characters", "+=$^", false),
    new SingleAssertEqualsTestParameters("contains space", "test test", false),
    new SingleAssertEqualsTestParameters("contains numerics", "test123", false),
    new SingleAssertEqualsTestParameters("is correct", "TestT_-éÉêËàÀçÇÿ", true)
];

var nameParameterType = new ParameterType("name", nameTestParameters, "TestT_-éÉêËàÀçÇÿ", 123);

var checkNameTester = new FunctionWithReturnTester(userUtils.checkName, [{
    type: nameParameterType,
    name: "name"
}], {
    "0": false
}, true, userUtils);

//----------------------- username -----------------------------

const usernameTestParameters = [
    new SingleAssertEqualsTestParameters("is empty", "", false),
    new SingleAssertEqualsTestParameters("contains special characters", "éàçè&+=", false),
    new SingleAssertEqualsTestParameters("is correct", "abcABC_-1234", true)
];

var usernameParameterType = new ParameterType("username", usernameTestParameters, "abcABC_-1234", 123);

var checkUsernameTester = new FunctionWithReturnTester(userUtils.checkUsername, [{
    type: usernameParameterType,
    name: "username"
}], {
    "0": false
}, true, userUtils);

//----------------------- password -----------------------------

const passwordTestParameters = [
    new SingleAssertEqualsTestParameters("is empty", "", false),
    new SingleAssertEqualsTestParameters("is less than 8 characters", "abc", false),
    new SingleAssertEqualsTestParameters("is correct", "abc132¨ê$Ç+²", true)
];


var passwordParameterType = new ParameterType("password", passwordTestParameters, "abc132¨ê$Ç+²", 123);

var checkPasswordTester = new FunctionWithReturnTester(userUtils.checkPassword, [{
    type: passwordParameterType,
    name: "password"
}], {
    "0": false
}, true, userUtils);

//----------------------- format -----------------------------

var checkUserFormatTester = new FunctionWithReturnTester(userUtils.checkUserFormat, [{
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
], {
    "0": "lastname",
    "0,1": "lastname,firstname",
    "0,2": "lastname,username",
    "0,1,2": "lastname,firstname,username",
    "0,3": "lastname,password",
    "0,1,3": "lastname,firstname,password",
    "0,2,3": "lastname,username,password",
    "0,1,2,3": "lastname,firstname,username,password",
    "1": "firstname",
    "1,2": "firstname,username",
    "1,3": "firstname,password",
    "1,2,3": "firstname,username,password",
    "2": "username",
    "2,3": "username,password",
    "3": "password",
}, "", userUtils);




describe('UserUtils', function () {

    checkNameTester.testFunction();

    checkUsernameTester.testFunction();

    checkPasswordTester.testFunction();

    checkUserFormatTester.testFunction();


});

run();