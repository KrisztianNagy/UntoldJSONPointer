import { PropertyPointer } from './property-pointer';
import { PropertyPointerOperator } from '../property-pointer-operator';
export declare class MappedResult extends PropertyPointerOperator {
    isQueryValid: boolean;
    private propertyPointer;
    error?: any;
    getAll(): any[];
    getSingle(): any;
    setAll(value: any): void;
    setSingle(value: any): void;
    private set;
    constructor(isQueryValid: boolean, propertyPointer: PropertyPointer | null, error?: any);
}
