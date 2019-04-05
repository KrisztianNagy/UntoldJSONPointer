import { expect } from 'chai';

import { JSONPointer } from '../src/index';
import character from './data/character';

describe('Filter - Parenthesis', () => {
    it('should handle ( || ) &&)', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{(.weight == 1 || .name: "a") && .weight == 2}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(1);
        expect(result.getSingle()[0].name).eq('diamond');
    });

    it('should handle complex 1', () => {
        const mapper = new JSONPointer();
        const query = mapper.createQuery('.items{(.weight == 1 || (.name: "a" && .name:"o") && (.weight == 2 || .name:"b"))}');
        console.log(query);

        const result = mapper.executeQuery(character, query);

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(2);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
    });

    it('should handle complex 2', () => {
        const mapper = new JSONPointer();
        const query = mapper.createQuery('.items{.weight == 1 || (.name: "a" && .name:"o") && (.weight == 2 || .name:"b")}');
        console.log(query);

        const result = mapper.executeQuery(character, query);

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(2);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
    });

    it('should handle complex 3', () => {
        const mapper = new JSONPointer();
        const query = mapper.createQuery('.items{.weight !== 2 || (.name: "a" && .name:"o") && (.weight == 2 || .name:"b")}');
        const result = mapper.executeQuery(character, query);

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(4);
    });
});
