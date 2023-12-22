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
const path = __importStar(require("path"));
const GoogleApiClient_1 = require("./GoogleApiClient");
describe('GoogleApiClient', () => {
    let googleApiClient;
    beforeEach(() => {
        const googleServiceAccountJsonPath = path.join(__dirname, '../../google-service-account.json');
        googleApiClient = new GoogleApiClient_1.GoogleApiClient(googleServiceAccountJsonPath);
    });
    describe('create and update form', () => {
        it('should return a google maps client', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResult = yield googleApiClient.createForm('Test form', 'Test form updated document title');
            console.log(createResult);
            expect(createResult).toBeDefined();
            const updateResult = yield googleApiClient.updateFormInfo(createResult.formId, {
                title: 'Test form updated',
                description: 'Test form updated',
            });
            console.log(updateResult);
            expect(updateResult).toBeDefined();
            const createItemsResult = yield googleApiClient.createItemsToForm(createResult.formId, [
                {
                    title: 'Test item',
                    description: 'Test item description',
                    questionItem: {
                        question: {
                            choiceQuestion: {
                                type: 'RADIO',
                                options: [
                                    {
                                        value: 'test option 1'
                                    },
                                    {
                                        value: 'test option 2'
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    title: 'Test item 2',
                    description: 'Test item description 2',
                    textItem: {},
                },
            ]);
            console.log(createItemsResult);
            expect(createItemsResult).toBeDefined();
        }), 100000);
    });
});
//# sourceMappingURL=GoogleApiClient.test.js.map