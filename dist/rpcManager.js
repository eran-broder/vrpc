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
exports.RpcChannel = void 0;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Request"] = 0] = "Request";
    MessageType[MessageType["Response"] = 1] = "Response";
    MessageType[MessageType["Event"] = 2] = "Event";
    MessageType[MessageType["Error"] = 3] = "Error";
})(MessageType || (MessageType = {}));
//TODO: support events
var RpcChannel = /** @class */ (function () {
    function RpcChannel(transport) {
        this.transport = transport;
        this._runningId = 0;
        this._awaitingPromises = {};
        this.doRead(); //TODO: not the place...don't abuse constructor
    }
    RpcChannel.prototype.doRead = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.transport.on("data", function (data) {
                    var raw = data.toString();
                    var msg = JSON.parse(raw);
                    //TODO: really??? if else? no way man...no way... perhaps map an enum to an interface handler?
                    if (msg.messageType == MessageType.Response) {
                        var matchigPromise = _this._awaitingPromises[msg.id];
                        //TODO: how should I handle a non existing message?
                        matchigPromise[0](msg.payload);
                    }
                    else if (msg.messageType == MessageType.Event) {
                        if (_this._eventListener) {
                            console.log(msg);
                            console.log(JSON.stringify(msg));
                            var eventPyload = msg.payload; //TODO: What is this crap??????
                            _this._eventListener(eventPyload.name, eventPyload.argument);
                        }
                    }
                    else if (msg.messageType == MessageType.Error) {
                        var matchigPromise = _this._awaitingPromises[msg.id];
                        matchigPromise[1](msg.payload);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    RpcChannel.prototype.createRequestMessage = function (payload) {
        return { id: this._runningId++, payload: payload, messageType: MessageType.Request };
    };
    RpcChannel.prototype.write = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, futurePromise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg = this.createRequestMessage(payload);
                        futurePromise = new Promise(function (resolve, reject) {
                            _this._awaitingPromises[msg.id] = [resolve, reject];
                        });
                        return [4 /*yield*/, this.transport.write(JSON.stringify(msg))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, futurePromise];
                }
            });
        });
    };
    RpcChannel.prototype.listen = function (listener) {
        if (this._eventListener)
            throw Error("Cannot have multiple event handlers");
        this._eventListener = listener;
    };
    return RpcChannel;
}());
exports.RpcChannel = RpcChannel;
