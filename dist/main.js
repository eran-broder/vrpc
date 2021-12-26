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
var rpc = require("./IRemoteInspector_vrpc");
var rpcGenerator_1 = require("./rpcGenerator");
var pipeTransport_1 = require("./pipeTransport");
var rpcManager_1 = require("./rpcManager");
var elements = require("./elements");
function outgoingMessageGenerator(name, args) {
    var message = { method: name, arguments: args };
    return message;
}
function createSessionFactory(client) {
    function withSession(action) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.CreateSession()];
                    case 1:
                        sessionToken = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 6]);
                        return [4 /*yield*/, action(sessionToken)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, client.RemoveSession(sessionToken)];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    ;
    return withSession;
}
function DoStuff() {
    return __awaiter(this, void 0, void 0, function () {
        function fetchOne() {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, withSession(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                var liveToken, elementDetails, parentName, parentElement, parentName2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, client.GetElementUnderMouse(session)];
                                        case 1:
                                            liveToken = _a.sent();
                                            return [4 /*yield*/, client.GetElementDetails(liveToken)];
                                        case 2:
                                            elementDetails = _a.sent();
                                            console.log("Element details : ".concat(elementDetails.name));
                                            return [4 /*yield*/, client.GetParentName(liveToken)];
                                        case 3:
                                            parentName = _a.sent();
                                            console.log('Parent name = ' + parentName);
                                            return [4 /*yield*/, client.GetParent(liveToken)];
                                        case 4:
                                            parentElement = _a.sent();
                                            return [4 /*yield*/, client.GetElementDetails(parentElement)];
                                        case 5:
                                            parentName2 = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            setTimeout(fetchOne, 10000);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var transport, channel, _a, client, eventPump, withSession;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    transport = new pipeTransport_1.NamedPipeTransport("mypipe");
                    channel = new rpcManager_1.RpcChannel(transport);
                    _a = (0, rpcGenerator_1.createClient)(rpc.IRemoteInspector_methods, function (name, args) {
                        var outgoingMessage = outgoingMessageGenerator(name, args);
                        return channel.write(outgoingMessage);
                    }), client = _a.client, eventPump = _a.eventPump;
                    channel.listen(eventPump);
                    withSession = createSessionFactory(client);
                    client.on("NewWindowOpened", function (a) {
                        console.log("NewWindowOpened : " + a.handle);
                    });
                    client.on("WindowClosed", function (a) {
                        console.log("WindowClosed:" + a.handle);
                    });
                    //await client.ListenToNewWindows();
                    return [4 /*yield*/, withSession(function (session) { return __awaiter(_this, void 0, void 0, function () {
                            var elementToken, name;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.FindElement(session, elements.login_button)];
                                    case 1:
                                        elementToken = _a.sent();
                                        return [4 /*yield*/, client.GetElementDetails(elementToken)];
                                    case 2:
                                        name = _a.sent();
                                        console.log("WELL WELL WELL... here is my first element : [".concat(name.name, "]"));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    //await client.ListenToNewWindows();
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
DoStuff();
