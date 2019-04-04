import { PropertyPointer } from './property-pointer';
import { PropertyPointerOperator } from '../property-pointer-operator';

export class MappedResult extends PropertyPointerOperator {
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

    setAll(value: any) {
        this.set(value, false);
    }

    setSingle(value: any) {
        this.set(value, true);
    }

    private set(value: any, firstOnly: boolean) {
        if (!this.propertyPointer || (!this.propertyPointer.singleTarget && !this.propertyPointer.multipleTargets)) {
            return;
        }

        if (this.propertyPointer.multipleTargets) {
            for (let targetCount = 0; targetCount < this.propertyPointer.multipleTargets.length; targetCount++) {
                const target = this.propertyPointer.multipleTargets[targetCount];

                if (Array.isArray(target.propertyName)) {
                    for (let propertyCount = 0; propertyCount < target.propertyName.length; propertyCount++) {
                        const property = target.propertyName[propertyCount];
                        target.targetPosition[property] = value;

                        if (firstOnly) {
                            return;
                        }
                    }
                } else {
                    target.targetPosition[<string | number>target.propertyName] = value;
                }

                if (firstOnly) {
                    return;
                }
            }
        } else if (this.propertyPointer.eachElement && this.propertyPointer.singleTarget) {
            if (Array.isArray(this.propertyPointer.singleTarget.targetPosition)) {
                for (let targetCount = 0; targetCount < this.propertyPointer.singleTarget.targetPosition.length; targetCount++) {
                    const target = this.propertyPointer.singleTarget.targetPosition[targetCount];
                    target[(<any>this.propertyPointer).singleTarget.propertyName] = value;

                    if (firstOnly) {
                        return;
                    }
                }
            }
        } else if (this.propertyPointer.singleTarget) {
            if (Array.isArray(this.propertyPointer.singleTarget.propertyName)) {
                for (let propertyCount = 0; propertyCount < this.propertyPointer.singleTarget.propertyName.length; propertyCount++) {
                    const property = this.propertyPointer.singleTarget.propertyName[propertyCount];
                    (<any>this.propertyPointer).singleTarget.targetPosition[property] = value;

                    if (firstOnly) {
                        return;
                    }
                }
            } else {
                if (this.propertyPointer.singleTarget.targetPosition !== null) {
                    this.propertyPointer.singleTarget.targetPosition[<string | number>this.propertyPointer.singleTarget.propertyName] = value;
                }
            }
        }
    }

    constructor(public isQueryValid: boolean, private propertyPointer: PropertyPointer | null, public error?: any) {
        super();
    }
}
