import { MappedResult } from './models/mapped-result';
import { QueryResult } from './models/query-result';
export declare class JSONPointer {
    createQuery(query: string): QueryResult;
    executeQuery(json: any, query: QueryResult | string): MappedResult;
}
