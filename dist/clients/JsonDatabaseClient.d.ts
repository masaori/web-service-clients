import { PromisedResult, UnknownRuntimeError } from '../_shared/error';
export declare class JsonDatabaseClient {
    private readonly databaseDirectoryPath;
    constructor(databaseDirectoryPath: string);
    read: <T>(entityName: string) => PromisedResult<T[], UnknownRuntimeError>;
    write: <T>(entityName: string, entities: T[]) => PromisedResult<void, UnknownRuntimeError>;
}
//# sourceMappingURL=JsonDatabaseClient.d.ts.map