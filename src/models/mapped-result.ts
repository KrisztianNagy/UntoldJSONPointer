import { PropertyPointer } from './property-pointer';
import { PropertyPointerOperator } from '../property-pointer-operator';

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

    constructor(public isQueryValid: boolean, private propertyPointer: PropertyPointer | null, public error?: any) {
        super();
    }
}
