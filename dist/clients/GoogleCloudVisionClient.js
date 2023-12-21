"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudVisionClient = void 0;
const path = __importStar(require("path"));
const vision_1 = require("@google-cloud/vision");
class GoogleCloudVisionClient {
    constructor() {
        this.googleCloudVisionClient = new vision_1.ImageAnnotatorClient({
            keyFilename: path.resolve('./google-service-account.json'),
        });
        this.fullTextAnnotationByImagePath = {};
        this.getFullTextAnnotation = (imagePath, options) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (options.useCache && this.fullTextAnnotationByImagePath[imagePath]) {
                return this.fullTextAnnotationByImagePath[imagePath];
            }
            const documentTextDetectionResult = yield this.googleCloudVisionClient.documentTextDetection({
                image: {
                    source: {
                        filename: imagePath,
                    },
                },
                imageContext: {
                    languageHints: ['ja'],
                },
            });
            const fullTextAnnotation = documentTextDetectionResult[0].fullTextAnnotation;
            if (!fullTextAnnotation) {
                throw new Error('[GoogleCloudVisionClient]: Failed to get fullTextAnnotation');
            }
            if (!((_a = fullTextAnnotation.pages) === null || _a === void 0 ? void 0 : _a[0])) {
                throw new Error('[GoogleCloudVisionClient]: fullTextAnnotation has no pages');
            }
            this.fullTextAnnotationByImagePath[imagePath] = fullTextAnnotation.pages[0];
            return fullTextAnnotation.pages[0];
        });
    }
}
exports.GoogleCloudVisionClient = GoogleCloudVisionClient;
//# sourceMappingURL=GoogleCloudVisionClient.js.map