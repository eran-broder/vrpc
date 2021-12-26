"use strict";
exports.__esModule = true;
exports.PropertyType = exports.IRemoteInspector_arguments = exports.IRemoteInspector_methods = void 0;
var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["CachedProperty"] = 0] = "CachedProperty";
    PropertyType[PropertyType["Computed"] = 1] = "Computed";
})(PropertyType || (PropertyType = {}));
exports.PropertyType = PropertyType;
var IRemoteInspector_methods = ['CreateSession', 'RemoveSession', 'GetElementUnderMouse', 'GetElementDetails', 'GetParentName', 'GetParent', 'FindElement', 'ListenToNewWindows'];
exports.IRemoteInspector_methods = IRemoteInspector_methods;
var IRemoteInspector_arguments = { "CreateSession": [], "RemoveSession": ["token"], "GetElementUnderMouse": ["token"], "GetElementDetails": ["token"], "GetParentName": ["token"], "GetParent": ["childToken"], "FindElement": ["token", "signature"], "ListenToNewWindows": [] };
exports.IRemoteInspector_arguments = IRemoteInspector_arguments;
