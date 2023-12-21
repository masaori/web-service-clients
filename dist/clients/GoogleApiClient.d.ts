export declare class GoogleApiClient {
    private sheetsApi;
    private driveApi;
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
}
//# sourceMappingURL=GoogleApiClient.d.ts.map