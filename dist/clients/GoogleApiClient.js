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
exports.GoogleApiClient = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
class GoogleApiClient {
    constructor(googleServiceAccountJsonPath) {
        this.googleServiceAccountJsonPath = googleServiceAccountJsonPath;
        this.sheetsApi = null;
        this.driveApi = null;
        this.formsApi = null;
        if (!fs_1.default.existsSync(this.googleServiceAccountJsonPath)) {
            throw new Error(`google service account json is not found: ${this.googleServiceAccountJsonPath}`);
        }
    }
    authorize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sheetsApi || this.driveApi) {
                return;
            }
            const serviceAccountCredentialJson = fs_1.default.readFileSync(path_1.default.resolve(this.googleServiceAccountJsonPath), 'utf-8');
            const serviceAccountCredentials = JSON.parse(serviceAccountCredentialJson);
            if (!serviceAccountCredentials ||
                typeof serviceAccountCredentials !== 'object' ||
                !('client_email' in serviceAccountCredentials) ||
                !serviceAccountCredentials.client_email ||
                typeof serviceAccountCredentials.client_email !== 'string' ||
                !('private_key' in serviceAccountCredentials) ||
                !serviceAccountCredentials.private_key ||
                typeof serviceAccountCredentials.private_key !== 'string') {
                throw new Error('client_email or private_key is not found');
            }
            const jwtClient = new googleapis_1.google.auth.JWT(serviceAccountCredentials.client_email, undefined, serviceAccountCredentials.private_key, ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'], undefined);
            yield jwtClient.authorize();
            this.sheetsApi = googleapis_1.google.sheets({ version: 'v4', auth: jwtClient });
            this.driveApi = googleapis_1.google.drive({ version: 'v3', auth: jwtClient });
            this.formsApi = googleapis_1.google.forms({ version: 'v1', auth: jwtClient });
        });
    }
    getSheetContent(spreadsheetId, sheetTitle, range) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi) {
                throw new Error('sheets is not initialized');
            }
            const response = yield this.sheetsApi.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetTitle}!${range}`,
            });
            if (!response.data.values) {
                throw new Error('values is not found');
            }
            return response.data.values;
        });
    }
    updateSheetContent(spreadsheetId, sheetTitle, range, values) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi) {
                throw new Error('sheets is not initialized');
            }
            yield this.sheetsApi.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheetTitle}!${range}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values,
                },
            });
            return values;
        });
    }
    getSpreadsheet(spreadsheetId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi) {
                throw new Error('sheets is not initialized');
            }
            const response = yield this.sheetsApi.spreadsheets.get({
                spreadsheetId,
                fields: 'spreadsheetId,spreadsheetUrl,properties.title',
            });
            if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
                throw new Error('spreadsheetId or spreadsheetUrl is not found');
            }
            if (!((_a = response.data.properties) === null || _a === void 0 ? void 0 : _a.title)) {
                throw new Error('title is not found');
            }
            return {
                spreadsheetId: response.data.spreadsheetId,
                spreadsheetUrl: response.data.spreadsheetUrl,
                title: response.data.properties.title,
            };
        });
    }
    getAllSpreadsheets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi) {
                throw new Error('sheets is not initialized');
            }
            const response = yield this.sheetsApi.spreadsheets.get({
                fields: 'spreadsheetId,spreadsheetUrl,sheets.properties.title',
            });
            if (!response.data.sheets) {
                throw new Error('sheets is not found');
            }
            return response.data.sheets.map((sheet) => {
                var _a;
                if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
                    throw new Error('spreadsheetId or spreadsheetUrl is not found');
                }
                if (!((_a = sheet.properties) === null || _a === void 0 ? void 0 : _a.title)) {
                    throw new Error('title is not found');
                }
                return {
                    spreadsheetId: response.data.spreadsheetId,
                    spreadsheetUrl: response.data.spreadsheetUrl,
                    title: sheet.properties.title,
                };
            });
        });
    }
    createSpreadsheet(title) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi || !this.driveApi) {
                throw new Error('sheets or drive is not initialized');
            }
            const response = yield this.sheetsApi.spreadsheets.create({
                requestBody: {
                    properties: {
                        title,
                    },
                },
                fields: 'spreadsheetId,spreadsheetUrl',
            });
            if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
                throw new Error('spreadsheetId or spreadsheetUrl is not found');
            }
            // Set permission to anyone
            yield this.driveApi.permissions.create({
                fileId: response.data.spreadsheetId,
                requestBody: {
                    role: 'writer',
                    type: 'anyone',
                },
            });
            return {
                spreadsheetId: response.data.spreadsheetId,
                spreadsheetUrl: response.data.spreadsheetUrl,
            };
        });
    }
    updateSpreadsheet(spreadsheetId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi) {
                throw new Error('sheets is not initialized');
            }
            const response = yield this.sheetsApi.spreadsheets.get({
                spreadsheetId,
                fields: 'spreadsheetId,spreadsheetUrl',
            });
            if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
                throw new Error('spreadsheetId or spreadsheetUrl is not found');
            }
            yield this.sheetsApi.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            updateSpreadsheetProperties: {
                                properties: {
                                    title,
                                },
                                fields: 'title',
                            },
                        },
                    ],
                },
            });
            return {
                spreadsheetId: response.data.spreadsheetId,
                spreadsheetUrl: response.data.spreadsheetUrl,
            };
        });
    }
    createSheet(spreadsheetId, title, values) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi) {
                throw new Error('sheets is not initialized');
            }
            // Get spreadsheet info
            const spreadsheet = yield this.sheetsApi.spreadsheets.get({
                spreadsheetId,
                fields: 'sheets(properties(sheetId,title))',
            });
            if (!spreadsheet.data.sheets) {
                throw new Error('sheets is not found');
            }
            // Remove default sheet
            const isDefault = spreadsheet.data.sheets.length === 1 && ((_a = spreadsheet.data.sheets[0].properties) === null || _a === void 0 ? void 0 : _a.title) === 'Sheet1';
            let sheetId;
            if (isDefault) {
                sheetId = ((_b = spreadsheet.data.sheets[0].properties) === null || _b === void 0 ? void 0 : _b.sheetId) || 0;
            }
            else {
                // Create new sheet
                const sheet = yield this.sheetsApi.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                addSheet: {
                                    properties: {
                                        title,
                                    },
                                },
                            },
                        ],
                    },
                });
                sheetId = ((_f = (_e = (_d = (_c = sheet.data.replies) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.addSheet) === null || _e === void 0 ? void 0 : _e.properties) === null || _f === void 0 ? void 0 : _f.sheetId) || 0;
            }
            if (sheetId === undefined || sheetId === null) {
                throw new Error('sheetId is not found');
            }
            // Update sheet title
            yield this.sheetsApi.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            updateSheetProperties: {
                                properties: {
                                    sheetId,
                                    title,
                                },
                                fields: 'title',
                            },
                        },
                    ],
                },
            });
            yield this.sheetsApi.spreadsheets.values.append({
                spreadsheetId,
                range: `${title}!A1:Z1`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values,
                },
            });
            return {
                spreadsheetId,
                sheetId,
                spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`,
            };
        });
    }
    updateSheet(spreadsheetId, sheetId, title, values) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.sheetsApi) {
                throw new Error('sheets is not initialized');
            }
            // Update sheet title
            yield this.sheetsApi.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            updateSheetProperties: {
                                properties: {
                                    sheetId,
                                    title,
                                },
                                fields: 'title',
                            },
                        },
                    ],
                },
            });
            yield this.sheetsApi.spreadsheets.values.update({
                spreadsheetId,
                range: `${title}!A1:Z1`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values,
                },
            });
            return {
                spreadsheetId,
                sheetId,
                spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`,
            };
        });
    }
    createForm(title) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.formsApi) {
                throw new Error('forms is not initialized');
            }
            const response = yield this.formsApi.forms.create({
                requestBody: {
                    info: {
                        title
                    },
                },
                fields: 'formId,linkedSheetId,responderUri',
            });
            if (!response.data.formId) {
                throw new Error('formId is not found');
            }
            // if (!response.data.linkedSheetId) {
            //   throw new Error('linkedSheetId is not found')
            // }
            if (!response.data.responderUri) {
                throw new Error('responderUri is not found');
            }
            return {
                formId: response.data.formId,
                formUrl: `https://docs.google.com/forms/d/${response.data.formId}/edit`,
                linkedSheetId: (_a = response.data.linkedSheetId) !== null && _a !== void 0 ? _a : '',
                responderUri: response.data.responderUri,
            };
        });
    }
    updateFormInfo(formId, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.formsApi) {
                throw new Error('forms is not initialized');
            }
            const response = yield this.formsApi.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: [
                        {
                            updateFormInfo: {
                                info,
                                updateMask: '*',
                            },
                        },
                    ],
                },
            });
            return response.data;
        });
    }
    createItemsToForm(formId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorize();
            if (!this.formsApi) {
                throw new Error('forms is not initialized');
            }
            const response = yield this.formsApi.forms.batchUpdate({
                formId,
                requestBody: {
                    requests: items.map((item, i) => ({
                        createItem: {
                            item,
                            location: {
                                index: i,
                            },
                        },
                    })),
                },
            });
            return response.data;
        });
    }
}
exports.GoogleApiClient = GoogleApiClient;
//# sourceMappingURL=GoogleApiClient.js.map