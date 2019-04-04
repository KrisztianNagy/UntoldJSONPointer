import { IdentifierElement, ValueElement, ComparisonElement, OperatorPlusComparisonElement, QueryElement, OperatorHierarchyElement, OperatorPlusFilterScopeElement } from './models/query-structure';
export declare class QueryBuilder {
    json: any;
    buildPath(identifiers: IdentifierElement[], filter: ComparisonElement): QueryElement;
    buildPathCombination(elements: QueryElement[]): any;
    buildIdentifier(name: string | number, isFlat: boolean): IdentifierElement;
    buildValue(value: number | string | boolean | null): ValueElement;
    buildComparison(left: IdentifierElement | ValueElement, comparer: string, right: IdentifierElement | ValueElement): ComparisonElement;
    buildOperatorPlusComparer(operator: string, comparison: ComparisonElement): OperatorPlusComparisonElement;
    buildOperatorPlusFilterScope(operator: string, scope: OperatorHierarchyElement): OperatorPlusFilterScopeElement;
    buildCombinedFilter(startFilter: ComparisonElement, additionalFilters: OperatorPlusComparisonElement[]): OperatorHierarchyElement;
    buildParenthesis(filter: OperatorHierarchyElement): OperatorHierarchyElement;
    buildFilterContent(startFilterScope: OperatorHierarchyElement, additionalFilterScopes: OperatorPlusFilterScopeElement[]): OperatorHierarchyElement;
    private mergeFilters;
}
