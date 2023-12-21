"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownRuntimeError = exports.alreadyExistsError = exports.notFoundError = void 0;
const monads_1 = require("@sniptt/monads");
const notFoundError = (message) => (0, monads_1.Err)({
    type: 'NotFoundError',
    message,
});
exports.notFoundError = notFoundError;
const alreadyExistsError = (message) => (0, monads_1.Err)({
    type: 'AlreadyExistsError',
    message,
});
exports.alreadyExistsError = alreadyExistsError;
const unknownRuntimeError = (message) => (0, monads_1.Err)({
    type: 'UnknownRuntimeError',
    message,
});
exports.unknownRuntimeError = unknownRuntimeError;
//# sourceMappingURL=error.js.map