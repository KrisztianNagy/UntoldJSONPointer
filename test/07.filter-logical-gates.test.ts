import { expect } from 'chai';

import { JSONPointer } from '../src/index';
import character from './data/character';

describe('Filter - Logical gates', () => {
    it('should handle AND', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .name : "a" && .quantity == 1}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(1);
        expect(result.getSingle()[0].name).eq('diamond');
    });

    it('should handle OR', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{.weight == 1 || .weight == 2}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(2);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
    });

    it('should handle precedence', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{.weight == 1 || .name: "a" && .weight == 2}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(2);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
    });

    it('should handle precedence other way', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{.weight == 1 && .name: "a" || .weight == 2}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(2);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
    });
});
