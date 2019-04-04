import {
    QueryElement,
    IdentifierElement,
    ComparisonElement,
    ValueElement,
    OperatorHierarchyElementMember,
    OperatorHierarchyElement
} from './models/query-structure';
import { OperationType } from './models/operation-type';
import { MappedResult } from './models/mapped-result';
import { PropertyPointer } from './models/property-pointer';
import { PropertyPointerOperator } from './property-pointer-operator';

export class QueryProcessor extends PropertyPointerOperator {
    constructor() {
        super();
    }

    public process(parsedQuery: QueryElement, json: any): PropertyPointer {
        return this.resolveQuery(parsedQuery, null, json);
    }

    resolveQuery(parsedQuery: QueryElement, previousPointer: PropertyPointer | null, json?: any): PropertyPointer {
        let pointer: PropertyPointer = previousPointer
            ? this.getNextPointer(previousPointer)
            : {
                  singleTarget: {
                      propertyName: '',
                      targetPosition: json
                  },
                  eachElement: false
              };

        switch (parsedQuery.operationType) {
            case OperationType.Identifier:
                pointer.eachElement = (<IdentifierElement>parsedQuery).operationPayload.isFlat;

                if (pointer.multipleTargets) {
                    pointer.multipleTargets.forEach(target => {
                        target.propertyName = (<IdentifierElement>parsedQuery).operationPayload.memberName;
                    });
                } else {
                    (<any>pointer.singleTarget).propertyName = (<IdentifierElement>parsedQuery).operationPayload.memberName;
                }
                break;
            case OperationType.Comparison:
                const filterMatch = this.filterAll(<PropertyPointer>previousPointer, <OperatorHierarchyElement>parsedQuery);
                pointer = filterMatch;
                break;
            case OperationType.LogicalOperatorHierarchy:
                const combineMatch = this.filterAll(<PropertyPointer>previousPointer, <OperatorHierarchyElement>parsedQuery);
                pointer = combineMatch;
                break;
            default:
                throw 'Not implemented operation type on ' + JSON.stringify(parsedQuery);
        }

        if (parsedQuery.next) {
            return this.resolveQuery(parsedQuery.next, pointer);
        }

        return pointer;
    }

    private filterAll(pointer: PropertyPointer, filterElement: OperatorHierarchyElementMember): PropertyPointer {
        const mappedPosition = new MappedResult(true, pointer);
        const result: PropertyPointer = {
            eachElement: false
        };

        if (pointer.multipleTargets) {
            const targets = mappedPosition.getAll();

            result.multipleTargets = targets.map(target => {
                return {
                    targetPosition: target,
                    propertyName: this.filterSingle(target, filterElement)
                };
            });
        } else if (pointer.singleTarget) {
            const target = mappedPosition.getSingle();
            result.singleTarget = {
                targetPosition: target,
                propertyName: this.filterSingle(target, filterElement)
            };
        }

        return result;
    }

    private filterSingle(filterableArray: any[], filterElement: OperatorHierarchyElementMember): number[] {
        const matchingAt: number[] = [];

        if (filterableArray && Array.isArray(filterableArray)) {
            filterableArray.forEach((element, index) => {
                if (typeof element === 'object') {
                    const isTrue =
                        filterElement.operationType === OperationType.Comparison ? this.compare(element, filterElement) : this.combine(element, filterElement);

                    if (isTrue) {
                        matchingAt.push(index);
                    }
                }
            });
        }

        return matchingAt;
    }

    private combine(pointer: PropertyPointer, hierarchy: OperatorHierarchyElement): boolean {
        const isAnd = hierarchy.operationPayload.operator === '&&';

        for (let i = 0; i < hierarchy.operationPayload.comparisons.length; i++) {
            const currentComparison = hierarchy.operationPayload.comparisons[i];

            const isTrue =
                currentComparison.operationType === OperationType.Comparison
                    ? this.compare(pointer, currentComparison)
                    : this.combine(pointer, currentComparison);

            if (isTrue && !isAnd) {
                return true;
            } else if (!isTrue && isAnd) {
                return false;
            }
        }

        return isAnd;
    }

    private compare(pointer: PropertyPointer, comparison: ComparisonElement): boolean {
        const { left, comparer, right } = comparison.operationPayload;

        const leftValue = this.getComparisonSideValue(left, pointer);

        const rightValue = this.getComparisonSideValue(right, pointer);

        let isTrue = false;
        switch (comparer.operationPayload) {
            case '>=':
                isTrue = leftValue >= rightValue;
                break;
            case '>':
                isTrue = leftValue > rightValue;
                break;
            case '<=':
                isTrue = leftValue <= rightValue;
                break;
            case '<':
                isTrue = leftValue < rightValue;
                break;
            case '==':
                isTrue = leftValue == rightValue;
                break;
            case '===':
                isTrue = leftValue === rightValue;
                break;
            case '!=':
                isTrue = leftValue != rightValue;
                break;
            case '!==':
                isTrue = leftValue !== rightValue;
                break;
            case ':':
                isTrue = typeof leftValue === 'string' && typeof rightValue === 'string' && leftValue.indexOf(rightValue) > -1;
                break;
            default:
        }

        return isTrue;
    }

    getComparisonSideValue(side: IdentifierElement | ValueElement, json: any): any {
        if (side.operationType === OperationType.Identifier) {
            const queryPointer = this.resolveQuery(side, null, json);
            const mappedResult = new MappedResult(true, queryPointer);

            return mappedResult.getSingle();
        } else {
            return side.operationPayload;
        }
    }
}
