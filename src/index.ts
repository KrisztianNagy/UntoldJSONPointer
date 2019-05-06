import parser from './parser';
import { QueryBuilder } from './query-builder';
import { QueryProcessor } from './query-processor';
import { MappedResult } from './models/mapped-result';
import { QueryElement } from './models/query-structure';
import { QueryResult } from './models/query-result';

export default class JSONPointer {
    public createQuery(query: string): QueryResult {
        try {
            const parsedQuery: QueryElement = parser.parse(query, {
                queryBuilder: new QueryBuilder()
            });

            return {
                isQueryValid: true,
                query: parsedQuery
            };
        } catch (ex) {
            return {
                error: ex,
                isQueryValid: false,
                query: null
            };
        }
    }

    public executeQuery(json: any, query: QueryResult | string): MappedResult {
        let parsedQuery = typeof query === 'string' ? this.createQuery(query) : query;

        if (parsedQuery.isQueryValid && parsedQuery.query) {
            const processor = new QueryProcessor();
            const result = processor.process(<QueryElement>parsedQuery.query, json);
            const mappedResult = new MappedResult(true, result);

            mappedResult.pointerHierarchy = processor.pointerHierarchy;

            return mappedResult;
        }

        return new MappedResult(false, null, parsedQuery.error);
    }
}
