const assert = require('assert');
const UserUtils = require("./../controller/userUtils");
const {
    createLogger,
    transports
} = require('winston');

const logger = createLogger({
    transports: [
        new transports.Console(),
    ]
});

const userUtils = new UserUtils(logger);


describe('UserUtils', function () {
    describe('checkPassword', function () {

        it('should return false if the password is empty', function () {
            assert.equal(userUtils.checkPassword(""), false);
        });

        it('should return false if the password is less than 8 characters', function () {
            assert.equal(userUtils.checkPassword("abc"), false);
        });

        it('should return false if the password is correct', function () {
            assert.equal(userUtils.checkPassword("abc132¨ê$Ç+²"), true);
        });
    });


});