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
exports.OpenAiClient = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const openai_1 = require("openai");
class OpenAiClient {
    constructor() {
        this.createEmbedding = (text) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.openAiClient.embeddings.create({
                model: 'text-embedding-ada-002',
                input: text,
            });
            console.log(`[OpenAiClient] createEmbedding: usage: ${JSON.stringify(result.usage, null, 2)}`);
            return result.data;
        });
        this.createChatCompletion = (messages) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.openAiClient.chat.completions.create({
                model: 'gpt-4',
                messages,
            });
            console.log(`[OpenAiClient] createChatCompletion: usage: ${JSON.stringify(result.usage, null, 2)}`);
            if (!((_a = result.choices[0]) === null || _a === void 0 ? void 0 : _a.message)) {
                throw new Error('[OpenAiClient]: Failed to get message');
            }
            return result.choices[0].message;
        });
        // './openapi_key.txt'
        const OPENAI_API_KEY = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'openapi_key.txt'), 'utf8').trim();
        this.openAiClient = new openai_1.OpenAI({
            apiKey: OPENAI_API_KEY,
        });
    }
}
exports.OpenAiClient = OpenAiClient;
//# sourceMappingURL=OpenAiClient.js.map