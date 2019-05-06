import { PropertyPointer } from './models/property-pointer';
import { PropertyValue } from './models/property-value';

export class PropertyPointerOperator {
    public pointerHierarchy: PropertyPointer[];

    constructor() {
        this.pointerHierarchy = [];
    }

    protected getNextPointer(pointer: PropertyPointer): PropertyPointer {
        let nextValue = this.getNextValue(pointer);

        const result: PropertyPointer = {
            eachElement: false
        };

        if (nextValue.values) {
            result.multipleTargets = nextValue.values.map(val => {
                return {
                    targetPosition: val,
                    propertyName: ''
                };
            });
        } else {
            result.singleTarget = {
                propertyName: '',
                targetPosition: nextValue.value
            };
        }

        this.pointerHierarchy = [nextValue.values ? nextValue.values : nextValue.value, ...this.pointerHierarchy];

        return result;
    }

    protected getNextValue(pointer: PropertyPointer): PropertyValue {
        let value: PropertyValue = {};

        if (pointer.multipleTargets) {
            if (pointer.eachElement) {
                value = {
                    values: []
                };

                pointer.multipleTargets.forEach(parallelItem => {
                    if (Array.isArray(parallelItem.targetPosition)) {
                        parallelItem.targetPosition.forEach(item => {
                            value.values = [...(<any[]>value.values), ...this.getProperty(item, parallelItem.propertyName)];
                        });
                    } else {
                        value.values = [...(<any[]>value.values), null];
                    }
                });
            } else {
                value = {
                    values: pointer.multipleTargets.map(parallelItem => {
                        return this.getProperty(parallelItem.targetPosition, parallelItem.propertyName);
                    })
                };
            }
        } else if (pointer.singleTarget) {
            if (pointer.eachElement) {
                const isArray = Array.isArray(pointer.singleTarget.targetPosition);

                if (isArray) {
                    value = {
                        values: pointer.singleTarget.targetPosition.map((item: any) => {
                            const prop = this.getProperty(item, (<any>pointer.singleTarget).propertyName);
                            return typeof prop === 'undefined' ? null : prop;
                        })
                    };
                } else {
                    value = {
                        values: []
                    };
                }
            } else {
                const prop = this.getProperty(pointer.singleTarget.targetPosition, pointer.singleTarget.propertyName);

                value = {
                    value: typeof prop === 'undefined' ? null : prop
                };
            }
        } else {
            value = {};
        }

        return value;
    }

    private getProperty(position: any, propertyName: string | string[] | number | number[] | null): any | any[] {
        const isArray = Array.isArray(propertyName);

        if (isArray) {
            return (<string[]>propertyName).map(propertyElement => {
                return position ? position[propertyElement] : null;
            });
        } else {
            return position ? position[<string>propertyName] : null;
        }
    }
}
