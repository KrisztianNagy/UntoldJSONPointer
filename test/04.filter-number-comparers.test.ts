import { expect } from 'chai';

import JSONPointer from '../src/index';
import character from './data/character';

describe('Filter - Number Comparers', () => {
    it('should handle greater than', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight > 1}');
        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(1);
        expect(result.getSingle()[0].name).eq('diamond');
    });

    it('should handle greater or equal than', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight >= 1}');
        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(2);
        expect(result.getSingle()[0].name).eq('meat');
        expect(result.getSingle()[1].name).eq('diamond');
    });

    it('should handle less than', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight < 1}');
        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(2);
        expect(result.getSingle()[0].name).eq('flask');
        expect(result.getSingle()[1].name).eq('golden key');
    });

    it('should handle less or equal than', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight <= 1}');
        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(3);
        expect(result.getSingle()[0].name).eq('flask');
        expect(result.getSingle()[1].name).eq('meat');
        expect(result.getSingle()[2].name).eq('golden key');
    });

    it('should handle not equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight != 1}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(3);
        expect(result.getSingle()[0].name).eq('flask');
        expect(result.getSingle()[1].name).eq('diamond');
        expect(result.getSingle()[2].name).eq('golden key');
    });

    it('should handle typesafe not equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight !== 1}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(3);
        expect(result.getSingle()[0].name).eq('flask');
        expect(result.getSingle()[1].name).eq('diamond');
        expect(result.getSingle()[2].name).eq('golden key');
    });

    it('should handle equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight == 1}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(1);
        expect(result.getSingle()[0].name).eq('meat');
    });

    it('should handle typesafe equal to', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .weight === 1}');

        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().length).eq(1);
        expect(result.getSingle()[0].name).eq('meat');
    });

    it('should return empty on non array', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.weapon{ .weight == 1}');

        expect(result.getSingle().length).eq(0);
        expect(result.getSingle().length).eq(0);
    });

    it('should return empty on wrong scope', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.wrongscope { .weight == 1 }[0]');

        expect(result.getSingle()).eq(null);
    });

    it('should return empty on wrong property', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items{ .wrong == 0.1}[0]');

        expect(result.getSingle()).eq(null);
    });
});
