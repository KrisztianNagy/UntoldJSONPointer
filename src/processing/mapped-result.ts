import { PropertyPointer } from '../models/property-pointer';
import { PropertyPointerOperator } from './property-pointer-operator';

export class MappedResult extends PropertyPointerOperator {
    resultCount() {
        if (!this.propertyPointer || (!this.propertyPointer.singleTarget && !this.propertyPointer.multipleTargets)) {
            return 0;
        } else if (this.propertyPointer.singleTarget) {
            return 1;
        } else if (this.propertyPointer.multipleTargets) {
            return this.propertyPointer.multipleTargets.length;
        }

        return 0;
    }

    getAll(): any[] {
        if (!this.propertyPointer || (!this.propertyPointer.singleTarget && !this.propertyPointer.multipleTargets)) {
            return [];
        }

        const result = this.getNextValue(this.propertyPointer);

        if (typeof result === 'undefined') {
            return [];
        }

        return this.propertyPointer.eachElement || this.propertyPointer.multipleTargets ? <any>result.values : [result.value];
    }

    getSingle() {
        const all = this.getAll();

        return all.length ? all[0] : null;
    }

    getAt(index: number) {
        const values = this.getAll();

        if (values && values.length > index) {
            return values[index];
        }

        return null;
    }

    parents(): any[] {
        return this.parentsAt(0);
    }

    parentsAt(index: number): any[] {
        if (!this.propertyPointer || (!this.propertyPointer.singleTarget && !this.propertyPointer.multipleTargets)) {
            return [];
        }

        const value = this.getAt(index);

        const referenceArray = this.getParentReferenceArray(this.propertyPointer, value);
        return referenceArray;
    }

    setAll(value: any) {
        this.set(value);
    }

    setSingle(value: any) {
        this.set(value, 0);
    }

    setAt(value: any, index: number) {
        this.set(value, index);
    }

    private set(value: any, singleIndex?: number) {
        const singleOnly = typeof singleIndex === 'number';

        if (!this.propertyPointer || (!this.propertyPointer.singleTarget && !this.propertyPointer.multipleTargets)) {
            return;
        }

        if (this.propertyPointer.multipleTargets) {
            let count = 0;
            for (let targetCount = 0; targetCount < this.propertyPointer.multipleTargets.length; targetCount++) {
                const target = this.propertyPointer.multipleTargets[targetCount];

                if (Array.isArray(target.propertyName)) {
                    for (let propertyCount = 0; propertyCount < target.propertyName.length; propertyCount++) {
                        if (!singleOnly || singleIndex === count) {
                            const property = target.propertyName[propertyCount];
                            target.targetPosition[property] = value;

                            if (singleOnly) {
                                return;
                            }
                        }

                        count++;
                    }
                } else {
                    if (!singleOnly || singleIndex === count) {
                        target.targetPosition[<string | number>target.propertyName] = value;

                        if (singleOnly) {
                            return;
                        }
                    }

                    count++;
                }
            }
        } else if (this.propertyPointer.eachElement && this.propertyPointer.singleTarget) {
            if (Array.isArray(this.propertyPointer.singleTarget.targetPosition)) {
                for (let targetCount = 0; targetCount < this.propertyPointer.singleTarget.targetPosition.length; targetCount++) {
                    if (!singleOnly || singleIndex === targetCount) {
                        const target = this.propertyPointer.singleTarget.targetPosition[targetCount];
                        target[(<any>this.propertyPointer).singleTarget.propertyName] = value;

                        if (singleOnly) {
                            return;
                        }
                    }
                }
            }
        } else if (this.propertyPointer.singleTarget) {
            if (Array.isArray(this.propertyPointer.singleTarget.propertyName)) {
                for (let propertyCount = 0; propertyCount < this.propertyPointer.singleTarget.propertyName.length; propertyCount++) {
                    if (!singleOnly || singleIndex === propertyCount) {
                        const property = this.propertyPointer.singleTarget.propertyName[propertyCount];
                        (<any>this.propertyPointer).singleTarget.targetPosition[property] = value;

                        if (singleOnly) {
                            return;
                        }
                    }
                }
            } else {
                if (this.propertyPointer.singleTarget.targetPosition !== null) {
                    if (!singleOnly || singleIndex === 0) {
                        this.propertyPointer.singleTarget.targetPosition[<string | number>this.propertyPointer.singleTarget.propertyName] = value;
                    }
                }
            }
        }
    }

    private getParentReferenceArray(pointer: PropertyPointer, reference: any): any[] {
        if (pointer === null) {
            return [];
        }

        let currentPointer: PropertyPointer | undefined = pointer;

        let lastReference = reference;
        const references = [];

        while (currentPointer) {
            if (currentPointer.singleTarget) {
                if (currentPointer.eachElement) {
                    for (let i = 0; i < currentPointer.singleTarget.targetPosition.length; i++) {
                        const targetReference = currentPointer.singleTarget.targetPosition[i][<string>currentPointer.singleTarget.propertyName];

                        if (targetReference === lastReference) {
                            lastReference = currentPointer.singleTarget.targetPosition[i];
                        }
                    }
                } else {
                    lastReference = currentPointer.singleTarget.targetPosition;
                }
            } else if (currentPointer.multipleTargets) {
                for (let i = 0; i < currentPointer.multipleTargets.length; i++) {
                    const target = currentPointer.multipleTargets[i];

                    if (currentPointer.eachElement && target.propertyName) {
                        for (let j = 0; j < (<string[] | number[]>target.propertyName).length; j++) {
                            const targetReference = target.targetPosition[(<string[] | number[]>target.propertyName)[j]];

                            if (targetReference === lastReference) {
                                lastReference = targetReference;
                            }
                        }
                    } else {
                        const targetReference = target.targetPosition[<number | string>target.propertyName];

                        if (targetReference === lastReference) {
                            lastReference = targetReference;
                        }
                    }
                }
            }

            references.push(lastReference);
            // [previousPointer, currentPointer] = [previousPointer.previous, previousPointer];
            currentPointer = currentPointer.previous;
        }

        return references;
    }

    constructor(public isQueryValid: boolean, private propertyPointer: PropertyPointer | null, public error?: any) {
        super();
    }
}
