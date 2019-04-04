import { MappedResult } from './models/mapped-result';
import { QueryResult } from './models/query-result';
declare class JSONMapper {
    createQuery(query: string): QueryResult;
    executeQuery(json: any, query: QueryResult | string): MappedResult;
}
export default JSONMapper;
