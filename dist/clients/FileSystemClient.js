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
exports.FileSystemClient = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileSystemClient {
    constructor(directoryPath, createDirectoryIfNotExists = false) {
        this.directoryPath = directoryPath;
        if (createDirectoryIfNotExists && !fs_1.default.existsSync(directoryPath)) {
            fs_1.default.mkdirSync(directoryPath, { recursive: true });
        }
    }
    createFile(fileName, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.default.promises.writeFile(path_1.default.join(this.directoryPath, fileName), content);
        });
    }
    readFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = yield fs_1.default.promises.readFile(path_1.default.join(this.directoryPath, fileName));
            return fileContent.toString();
        });
    }
    deleteFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.default.promises.unlink(path_1.default.join(this.directoryPath, fileName));
        });
    }
}
exports.FileSystemClient = FileSystemClient;
//# sourceMappingURL=FileSystemClient.js.map