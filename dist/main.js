"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var rpc = require("./RemoteInspector_vrpc");
var rpcGenerator_1 = require("./rpcGenerator");
var pipeTransport_1 = require("./pipeTransport");
var rpcManager_1 = require("./rpcManager");
var pipe;
function outgoingMessageGenerator(name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var message = { method: name, arguments: args };
    return message;
}
var client = (0, rpcGenerator_1.createClient)(rpc.RemoteInspector_methods, function (name, args) {
    var outgoingMessage = outgoingMessageGenerator(name, args);
    return Promise.resolve();
});
function argsToJson(nameOfMethod, args) {
    var jsonObj = {};
    for (var index = 0; index < args.length; index++) {
        jsonObj[rpc.RemoteInspector_arguments[nameOfMethod][index]] = args[index];
    }
    return jsonObj;
}
function DoStuff() {
    return __awaiter(this, void 0, void 0, function () {
        var transport, channel, client, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new pipeTransport_1.NamedPipeTransport("mypipe");
                    channel = new rpcManager_1.RpcChannel(transport);
                    client = (0, rpcGenerator_1.createClient)(rpc.RemoteInspector_methods, function (name, args) {
                        var outgoingMessage = outgoingMessageGenerator(name, args);
                        return channel.write(outgoingMessage);
                    });
                    return [4 /*yield*/, client.FindElement(10, "hello")];
                case 1:
                    result = _a.sent();
                    console.log("Got back : ".concat(JSON.stringify(result)));
                    return [2 /*return*/];
            }
        });
    });
}
DoStuff();
/*
var PIPE_NAME = "mypipe";
var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;
var L = console.log;

// == Client part == //
pipe = net.connect(PIPE_PATH, function() {
    L('Client: on connection');
})

pipe.on('data', function(data) {
    L('Client: on data:', data.toString());
    pipe.end('Thanks!');
});

pipe.on('end', function() {
    L('Client: on end');
})

*/ 
