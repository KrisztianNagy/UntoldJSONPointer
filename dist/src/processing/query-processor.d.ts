import { QueryElement, IdentifierElement, ValueElement } from '../models/query-structure';
import { PropertyPointer } from '../models/property-pointer';
import { PropertyPointerOperator } from './property-pointer-operator';
export declare class QueryProcessor extends PropertyPointerOperator {
    constructor();
    process(parsedQuery: QueryElement, json: any): PropertyPointer;
    resolveQuery(parsedQuery: QueryElement, previousPointer: PropertyPointer | null, json?: any): PropertyPointer;
    private filterAll;
    private filterSingle;
    private combine;
    private compare;
    getComparisonSideValue(side: IdentifierElement | ValueElement, json: any): any;
}
