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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDatabaseClient = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const error_1 = require("../_shared/error");
const monads_1 = require("@sniptt/monads");
class JsonDatabaseClient {
    constructor(databaseDirectoryPath) {
        this.databaseDirectoryPath = databaseDirectoryPath;
        this.read = (entityName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const absoluteFilePath = path_1.default.join(this.databaseDirectoryPath, `${entityName}.json`);
                if (!fs_1.default.existsSync(absoluteFilePath)) {
                    return (0, error_1.unknownRuntimeError)(`Target file does not exist: ${absoluteFilePath}`);
                }
                const fileContent = yield fs_1.default.promises.readFile(absoluteFilePath, 'utf8');
                const entities = JSON.parse(fileContent); // eslint-disable-line no-type-assertion/no-type-assertion
                return (0, monads_1.Ok)(entities);
            }
            catch (e) {
                if (e instanceof Error) {
                    return (0, error_1.unknownRuntimeError)(e.message);
                }
                else {
                    return (0, error_1.unknownRuntimeError)(JSON.stringify(e));
                }
            }
        });
        this.write = (entityName, entities) => __awaiter(this, void 0, void 0, function* () {
            try {
                const absoluteFilePath = path_1.default.join(this.databaseDirectoryPath, `${entityName}.json`);
                if (!fs_1.default.existsSync(absoluteFilePath)) {
                    return (0, error_1.unknownRuntimeError)(`Target file does not exist: ${absoluteFilePath}`);
                }
                yield fs_1.default.promises.writeFile(absoluteFilePath, JSON.stringify(entities));
                return (0, monads_1.Ok)(undefined);
            }
            catch (e) {
                if (e instanceof Error) {
                    return (0, error_1.unknownRuntimeError)(e.message);
                }
                else {
                    return (0, error_1.unknownRuntimeError)(JSON.stringify(e));
                }
            }
        });
    }
}
exports.JsonDatabaseClient = JsonDatabaseClient;
//# sourceMappingURL=JsonDatabaseClient.js.map