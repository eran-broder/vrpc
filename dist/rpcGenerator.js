"use strict";
exports.__esModule = true;
exports.createClient = void 0;
function createClient(methods, outgoingHandler) {
    var clientProxy = {};
    var _loop_1 = function (m) {
        clientProxy[m] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return outgoingHandler(m, args);
        };
    };
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var m = methods_1[_i];
        _loop_1(m);
    }
    var listeners = {};
    clientProxy['on'] = function (eventName, handler) {
        listeners[eventName] = handler;
    };
    function invoker(eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listener = listeners[eventName];
        if (listener)
            listener.apply(void 0, args);
    }
    return { client: clientProxy, eventPump: invoker };
}
exports.createClient = createClient;
