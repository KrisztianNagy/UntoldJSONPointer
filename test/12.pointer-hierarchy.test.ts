import { expect } from 'chai';
import JSONPointer from '../src/index';
import character from './data/character';

describe('Pointer hierarchy', () => {
    it('should contain previous references', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.weapon.name');

        expect(result.parents()).not.eq(null);
        expect(result.parents().length).eq(2);
    });

    it('should contain previous references for filters', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight >= 1}');

        expect(result.parentsAt(1)).not.eq(null);
        expect(result.parentsAt(1).length).eq(2);
    });

    it('should contain previous references for filter properties', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight >= 1}|name');

        expect(result.parentsAt(1)).not.eq(null);
        expect(result.parentsAt(1).length).eq(3);

        expect(result.parentsAt(2)).not.eq(null);
        expect(result.parentsAt(2).length).eq(3);
    });
});
