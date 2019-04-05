import { expect } from 'chai';
import { JSONPointer } from '../src/index';
import character from './data/character';

describe('Combined', () => {
    it('should handle empty filter', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{true === true}|name');

        expect(result.getAll().length).eq(4);
    });

    it('should handle path filter path', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{.name==="flask"}|liquids');

        expect(result.getSingle().length).eq(2);
        expect(result.getAll().length).eq(1);
    });

    it('should handle path filter path filter', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{.name==="flask"}|liquids{.drinkable === true}');

        expect(result.getSingle()[0].type).eq('wine');
    });

    it('should handle path filter path filter path', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{.name==="flask"}|liquids{.drinkable === true}|type');

        expect(result.getSingle()).eq('wine');
    });
});
