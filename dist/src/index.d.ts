import { MappedResult } from './processing/mapped-result';
import { QueryResult } from './models/query-result';
export default class JSONPointer {
    createQuery(query: string): QueryResult;
    executeQuery(json: any, query: QueryResult | string): MappedResult;
}
