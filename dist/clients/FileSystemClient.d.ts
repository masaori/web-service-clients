export declare class FileSystemClient {
    private directoryPath;
    constructor(directoryPath: string, createDirectoryIfNotExists?: boolean);
    createFile(fileName: string, content: string): Promise<void>;
    readFile(fileName: string): Promise<string>;
    deleteFile(fileName: string): Promise<void>;
}
//# sourceMappingURL=FileSystemClient.d.ts.map