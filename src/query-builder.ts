import {
    IdentifierElement,
    ValueElement,
    ComparisonElement,
    OperatorPlusComparisonElement,
    QueryElement,
    OperatorHierarchyElement,
    OperatorHierarchyElementMember,
    OperatorPlusFilterScopeElement
} from './models/query-structure';
import { OperationType } from './models/operation-type';

export class QueryBuilder {
    json: any;

    buildPath(identifiers: IdentifierElement[], filter: ComparisonElement): QueryElement {
        let sourceStructure: any = null;
        let lastStructure: any = null;

        identifiers.forEach(identifier => {
            if (!sourceStructure) {
                sourceStructure = identifier;
                lastStructure = sourceStructure;
            } else {
                lastStructure.next = identifier;
                lastStructure = lastStructure.next;
            }
        });

        if (filter) {
            if (lastStructure) {
                lastStructure.next = filter;
            } else {
                return filter;
            }
        }

        return sourceStructure;
    }

    buildPathCombination(elements: QueryElement[]) {
        let sourceStructure: any = null;
        let lastStructure: any = null;

        elements.forEach(element => {
            if (!sourceStructure) {
                sourceStructure = element;
                lastStructure = sourceStructure;
            } else {
                lastStructure.next = element;
            }

            while (lastStructure.next) {
                lastStructure = lastStructure.next;
            }
        });

        return sourceStructure;
    }

    buildIdentifier(name: string | number, isFlat: boolean): IdentifierElement {
        return {
            operationPayload: {
                memberName: name,
                isFlat: isFlat
            },
            operationType: OperationType.Identifier
        };
    }

    buildValue(value: number | string | boolean | null): ValueElement {
        return {
            operationPayload: value,
            operationType: OperationType.Value
        };
    }

    buildComparison(left: IdentifierElement | ValueElement, comparer: string, right: IdentifierElement | ValueElement): ComparisonElement {
        return {
            operationPayload: {
                left: left,
                comparer: {
                    operationType: OperationType.Comparer,
                    operationPayload: comparer
                },
                right: right
            },
            operationType: OperationType.Comparison
        };
    }

    buildOperatorPlusComparer(operator: string, comparison: ComparisonElement): OperatorPlusComparisonElement {
        return {
            operationPayload: {
                operator: operator,
                comparison: comparison
            },
            operationType: OperationType.LogicalOperatorPlusComparison
        };
    }

    buildOperatorPlusFilterScope(operator: string, scope: OperatorHierarchyElement): OperatorPlusFilterScopeElement {
        return {
            operationPayload: {
                operator: operator,
                scope: scope
            },
            operationType: OperationType.LogicalOperatorPlusFilterScope
        };
    }

    buildCombinedFilter(startFilter: ComparisonElement, additionalFilters: OperatorPlusComparisonElement[]) {
        const hierarcyRoot: OperatorHierarchyElement = {
            operationType: OperationType.LogicalOperatorHierarchy,
            operationPayload: {
                operator: '' /*additionalFilters.length ? additionalFilters[0].operationPayload.operator :  '&&'*/,
                comparisons: [startFilter]
            }
        };

        return this.mergeFilters(hierarcyRoot, additionalFilters);
    }

    buildParenthesis(filter: OperatorHierarchyElement) {
        const encapsulated: OperatorHierarchyElement = {
            operationType: OperationType.LogicalOperatorHierarchy,
            operationPayload: {
                operator: '',
                comparisons: [filter]
            }
        };

        return encapsulated;
    }

    buildFilterContent(startFilterScope: OperatorHierarchyElement, additionalFilterScopes: OperatorPlusFilterScopeElement[]) {
        if (additionalFilterScopes.length) {
            return this.mergeFilters(startFilterScope, additionalFilterScopes);
        } else {
            return startFilterScope;
        }
    }

    private mergeFilters(startFilter: OperatorHierarchyElement, filters: OperatorPlusFilterScopeElement[] | OperatorPlusComparisonElement[]) {
        const stack: OperatorHierarchyElement[] = [];

        let hierarcyRoot: OperatorHierarchyElement = startFilter; /*{
            operationType: OperationType.LogicalOperatorHierarchy,
            operationPayload: {
                operator: filters.length ? filters[0].operationPayload.operator : '&&',
                comparisons: [startFilter]
            }
        };*/

        let hierarcyCurrent = hierarcyRoot;
        stack.push(hierarcyRoot);

        filters.forEach((filter: OperatorPlusFilterScopeElement | OperatorPlusComparisonElement) => {
            if (!hierarcyRoot) {
                hierarcyCurrent = hierarcyRoot;
                stack.push(hierarcyRoot);
            }

            const comparisons = (<OperatorPlusFilterScopeElement>filter).operationPayload.scope
                ? (<OperatorPlusFilterScopeElement>filter).operationPayload.scope.operationPayload.comparisons
                : [(<OperatorPlusComparisonElement>filter).operationPayload.comparison];

            if (hierarcyCurrent.operationPayload.operator === '' || filter.operationPayload.operator === hierarcyCurrent.operationPayload.operator) {
                hierarcyCurrent.operationPayload.operator = filter.operationPayload.operator;
                hierarcyCurrent.operationPayload.comparisons = [...hierarcyCurrent.operationPayload.comparisons, ...comparisons];
            } else {
                const isAnd = filter.operationPayload.operator === '&&';

                if (isAnd) {
                    const lastComparison = <OperatorHierarchyElementMember>hierarcyCurrent.operationPayload.comparisons.pop();

                    const hierarchyElement: OperatorHierarchyElement = {
                        operationType: OperationType.LogicalOperatorHierarchy,
                        operationPayload: {
                            operator: filter.operationPayload.operator,
                            comparisons: [lastComparison, ...comparisons]
                        }
                    };

                    hierarcyCurrent.operationPayload.comparisons.push(hierarchyElement);
                    stack.push(hierarchyElement);
                } else {
                    const parent = <OperatorHierarchyElement>stack.pop();

                    const hierarchyElement: OperatorHierarchyElement = {
                        operationType: OperationType.LogicalOperatorHierarchy,
                        operationPayload: {
                            operator: filter.operationPayload.operator,
                            comparisons: [parent, ...comparisons]
                        }
                    };

                    hierarcyCurrent = hierarchyElement;

                    if (!stack.length) {
                        hierarcyRoot = hierarcyCurrent;
                    }

                    stack.push(hierarchyElement);
                }
            }
        });

        return hierarcyRoot;
    }
}
