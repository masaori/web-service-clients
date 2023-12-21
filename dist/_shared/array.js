"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomElements = exports.excludeNull = void 0;
const excludeNull = (array) => {
    return array.filter((e) => !!e);
};
exports.excludeNull = excludeNull;
// get elements at random by specific number
const getRandomElements = (array, number) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, number);
};
exports.getRandomElements = getRandomElements;
//# sourceMappingURL=array.js.map