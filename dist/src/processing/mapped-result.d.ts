import { PropertyPointer } from '../models/property-pointer';
import { PropertyPointerOperator } from './property-pointer-operator';
export declare class MappedResult extends PropertyPointerOperator {
    isQueryValid: boolean;
    private propertyPointer;
    error?: any;
    resultCount(): number;
    getAll(): any[];
    getSingle(): any;
    getAt(index: number): any;
    parents(): any[];
    parentsAt(index: number): any[];
    setAll(value: any): void;
    setSingle(value: any): void;
    setAt(value: any, index: number): void;
    private set;
    private getParentReferenceArray;
    constructor(isQueryValid: boolean, propertyPointer: PropertyPointer | null, error?: any);
}
