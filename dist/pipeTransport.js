"use strict";
exports.__esModule = true;
exports.NamedPipeTransport = void 0;
var net = require("net");
var PIPE_PATH = "\\\\.\\pipe\\";
var NamedPipeTransport = /** @class */ (function () {
    function NamedPipeTransport(name) {
        //TODO: no protection here...wrap it with a static async creator
        this._pipe = net.connect("".concat(PIPE_PATH).concat(name), function () {
            console.log("CONNECTED!");
        });
    }
    NamedPipeTransport.prototype.on = function (event, listener) {
        this._pipe.on("data", listener);
    };
    NamedPipeTransport.prototype.write = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._pipe.write(msg, function () { return resolve(); });
        });
    };
    return NamedPipeTransport;
}());
exports.NamedPipeTransport = NamedPipeTransport;
