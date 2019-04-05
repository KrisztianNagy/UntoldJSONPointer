import { expect } from 'chai';

import JSONPointer from '../src/index';
import character from './data/character';

describe('Filter - String Comparers', () => {
    it('should handle not equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .name != "flask"}');

        expect(result.getSingle().length).eq(3);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
        expect(result.getSingle()[2].name).eq('golden key');
    });

    it('should handle typesafe not equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .name !== "flask"}');

        expect(result.getSingle().length).eq(3);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
        expect(result.getSingle()[2].name).eq('golden key');
    });

    it('should handle equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .name == "flask"}');

        expect(result.getSingle().length).eq(1);
        expect(result.getSingle()[0].name).eq('flask');
    });

    it('should handle typesafe equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .name === "flask"}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(1);
        expect(result.getSingle()[0].name).eq('flask');
    });

    it('should handle contains', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .name : "a"}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(3);
        expect(result.getSingle()[0].name).eq('flask');
        expect(result.getSingle()[1].name).eq('meat');
        expect(result.getSingle()[2].name).eq('diamond');
    });
});
