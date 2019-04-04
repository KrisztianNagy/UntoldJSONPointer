import { QueryElement } from './query-structure';

export class QueryResult {
    isQueryValid: boolean;
    error?: any;
    query: QueryElement | null;
}
