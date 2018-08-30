const FunctionWithoutReturnTester = require("../nodeMochaTestGenerator/FunctionWithoutReturnTester");
const ParameterType = require("../nodeMochaTestGenerator/ParameterType");

const Controller = require("./../controller/controller");

const logger = require("../logger")("error");

class ServerResponse {
    constructor() {
        this.statusCode = undefined;
    }

    status(code) {
        this.statusCode = code;
        console.log("aaaaaaaaaaaaaaaaaa");
        return this;
    }

    send(truc) {
        return this;
    }
}

mockServerResponse = new ServerResponse();

require("../modelInit")().then((model) => {

    // model.userModel.create("test","test","test","testtest");

    let controller = new Controller(model.User, logger);

    // const idTestParameters = [
    //     new SingleAssertEqualsTestParameters("is negative", -1, false),
    //     new SingleAssertEqualsTestParameters("is a float", 2.75, false),
    //     new SingleAssertEqualsTestParameters("is correct", 153, true)
    // ];

    // var idParameterType = new ParameterType("integer", idTestParameters, 153, "TEST");

    const serverResponseTestParameters = [];

    var serverResponseParameterType = new ParameterType("ServerResponse", serverResponseTestParameters, mockServerResponse, undefined);

    var checkGetUser = new FunctionWithoutReturnTester(controller.getUsers, [{
        type: serverResponseParameterType,
        name: "res"
    }], controller, [{
        description: "serverResponse.status with parameter 200",
        parametersToTest: [mockServerResponse],
        expectedFunction: mockServerResponse.status,
        expectedFunctionContext: mockServerResponse,
        expectedParameters: [200],
        promise: true,
    }]);



    describe('Controller', function () {
        checkGetUser.testFunction();
    });
});