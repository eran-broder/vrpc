"use strict";
exports.__esModule = true;
exports.createClient = void 0;
function createClient(methods, callback) {
    var clientDummy = {};
    var _loop_1 = function (m) {
        clientDummy[m] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return callback(m, args);
        };
    };
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var m = methods_1[_i];
        _loop_1(m);
    }
    return clientDummy;
}
exports.createClient = createClient;
