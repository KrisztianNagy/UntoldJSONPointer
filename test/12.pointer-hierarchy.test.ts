import { expect } from 'chai';
import JSONPointer from '../src/index';
import character from './data/character';

describe('Pointer hierarchy', () => {
    it('should contain previous references', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.weapon.name');

        expect(result.pointerHierarchy).not.eq(null);
        expect(result.pointerHierarchy.length).eq(2);
    });

    it('should contain previous references for filters', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight >= 1}');

        expect(result.pointerHierarchy).not.eq(null);
        expect(result.pointerHierarchy.length).eq(2);
    });

    it('should contain previous references for filter properties', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight >= 1}.name');

        expect(result.pointerHierarchy).not.eq(null);
        expect(result.pointerHierarchy.length).eq(3);
    });
});
