import { forms_v1 } from 'googleapis';
export declare class GoogleApiClient {
    readonly googleServiceAccountJsonPath: string;
    constructor(googleServiceAccountJsonPath: string);
    private sheetsApi;
    private driveApi;
    private formsApi;
    private authorize;
    getSheetContent(spreadsheetId: string, sheetTitle: string, range: string): Promise<(string | number)[][]>;
    updateSheetContent(spreadsheetId: string, sheetTitle: string, range: string, values: (string | number)[][]): Promise<(string | number)[][]>;
    getSpreadsheet(spreadsheetId: string): Promise<{
        spreadsheetId: string;
        spreadsheetUrl: string;
        title: string;
    }>;
    getAllSpreadsheets(): Promise<{
        spreadsheetId: string;
        spreadsheetUrl: string;
        title: string;
    }[]>;
    createSpreadsheet(title: string): Promise<{
        spreadsheetId: string;
        spreadsheetUrl: string;
    }>;
    updateSpreadsheet(spreadsheetId: string, title: string): Promise<{
        spreadsheetId: string;
        spreadsheetUrl: string;
    }>;
    createSheet(spreadsheetId: string, title: string, values: (string | number)[][]): Promise<{
        spreadsheetId: string;
        sheetId: number;
        spreadsheetUrl: string;
    }>;
    updateSheet(spreadsheetId: string, sheetId: number, title: string, values: (string | number)[][]): Promise<{
        spreadsheetId: string;
        sheetId: number;
        spreadsheetUrl: string;
    }>;
    createForm(title: string, documentTitle: string): Promise<{
        formId: string;
        formUrl: string;
        linkedSheetId: string;
        responderUri: string;
    }>;
    updateFormInfo(formId: string, info: forms_v1.Schema$Info): Promise<forms_v1.Schema$BatchUpdateFormResponse>;
    createItemsToForm(formId: string, items: forms_v1.Schema$Item[]): Promise<forms_v1.Schema$BatchUpdateFormResponse>;
    moveDriveFileToDriveFolder(fileId: string, folderId: string): Promise<void>;
}
//# sourceMappingURL=GoogleApiClient.d.ts.map