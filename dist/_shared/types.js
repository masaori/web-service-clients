"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNever = exports.check2dArrayOfStringOrNumbers = void 0;
const check2dArrayOfStringOrNumbers = (array) => {
    if (!Array.isArray(array)) {
        return false;
    }
    for (const el of array) {
        if (!Array.isArray(el)) {
            return false;
        }
        for (const el2 of el) {
            if (typeof el2 !== 'string' && typeof el2 !== 'number') {
                return false;
            }
        }
    }
    return true;
};
exports.check2dArrayOfStringOrNumbers = check2dArrayOfStringOrNumbers;
const assertNever = (_value) => {
    throw new Error(`Unexpected value`);
};
exports.assertNever = assertNever;
//# sourceMappingURL=types.js.map