import { PropertyPointer } from './models/property-pointer';
import { PropertyValue } from './models/property-value';
export declare class PropertyPointerOperator {
    protected getNextPointer(pointer: PropertyPointer): PropertyPointer;
    protected getNextValue(pointer: PropertyPointer): PropertyValue;
    private getProperty;
}
