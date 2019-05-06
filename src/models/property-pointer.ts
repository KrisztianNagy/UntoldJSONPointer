export interface PropertyPointerTarget {
    targetPosition: any;
    propertyName: string | number | string[] | number[] | null;
}

export interface PropertyPointer {
    singleTarget?: PropertyPointerTarget;
    multipleTargets?: PropertyPointerTarget[];
    eachElement: boolean;
    pointerHierarchy?: [];
}
