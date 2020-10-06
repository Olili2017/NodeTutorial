/**
 * These are the request handlers
 */

//  Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users handler
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the users sub-methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
    var firstName =
        typeof data.payload.firstName === 'string' && data.payload.firstName > 0
            ? data.payload.firstName.trim()
            : false;
    var lastName =
        typeof data.payload.lastName === 'string' && data.payload.lastName > 0
            ? data.payload.lastName.trim()
            : false;
    var phone =
        typeof data.payload.phone === 'string' && data.payload.phone > 10
            ? data.payload.phone.trim()
            : false;
    var password =
        typeof data.payload.password === 'string' && data.payload.password > 0
            ? data.payload.password.trim()
            : false;
    var tosAgreement =
        typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement === true
            ? true
            : false;

    console.log(data.payload);

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    // Create the user object
                    var userObject = {
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone,
                        hashedPassword: hashedPassword,
                        tosAgreement: tosAgreement,
                    };

                    // Store the user
                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { Error: 'Could not create a new user' });
                        }
                    });
                } else {
                    callback(500, { Error: "Could not has the user's password" });
                }
            } else {
                callback(400, { Error: 'A user with that phone number already exists' });
            }
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
};

// Users - get
handlers._users.get = function (data, callback) {};

// Users - put
handlers._users.put = function (data, callback) {};

// Users - delete
handlers._users.delete = function (data, callback) {};

// ping handler
handlers.ping = function (data, callback) {
    // callback a http status code, and payload object
    callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Export the handlers
module.exports = handlers;