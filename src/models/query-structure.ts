import { OperationType } from './operation-type';

export interface QueryElement {
    operationType: OperationType;
    operationPayload:
        | string
        | number
        | boolean
        | null
        | IdentifierPayload
        | ComparisionPayload
        | OperatorPlusComparisonPayload
        | OperatorHierarchyPayload
        | OperatorPlusFilterScopePayload;
    next?: QueryElement;
}

export interface IdentifierElement extends QueryElement {
    operationType: OperationType.Identifier;
    operationPayload: IdentifierPayload;
}

export interface ValueElement extends QueryElement {
    operationType: OperationType.Value;
    operationPayload: string | number | boolean | null;
}

export interface ComparerElement extends QueryElement {
    operationType: OperationType.Comparer;
    operationPayload: string;
}

export interface ComparisonElement extends QueryElement {
    operationType: OperationType.Comparison;
    operationPayload: ComparisionPayload;
}

export interface OperatorPlusComparisonElement extends QueryElement {
    operationType: OperationType.LogicalOperatorPlusComparison;
    operationPayload: OperatorPlusComparisonPayload;
}

export interface OperatorPlusFilterScopeElement extends QueryElement {
    operationType: OperationType.LogicalOperatorPlusFilterScope;
    operationPayload: OperatorPlusFilterScopePayload;
}

export interface OperatorHierarchyElement extends QueryElement {
    operationType: OperationType.LogicalOperatorHierarchy;
    operationPayload: OperatorHierarchyPayload;
}

export interface IdentifierPayload {
    isFlat: boolean;
    memberName: string | number;
}

export interface ComparisionPayload {
    left: IdentifierElement | ValueElement;
    comparer: ComparerElement;
    right: IdentifierElement | ValueElement;
}

export interface OperatorPlusComparisonPayload {
    operator: string;
    comparison: ComparisonElement;
}

export interface OperatorPlusFilterScopePayload {
    operator: string;
    scope: OperatorHierarchyElement;
}

export type OperatorHierarchyElementMember = OperatorHierarchyElement | ComparisonElement;

export interface OperatorHierarchyPayload {
    comparisons: OperatorHierarchyElementMember[];
    operator: string;
}
