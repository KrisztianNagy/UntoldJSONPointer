import { expect } from 'chai';

import JSONMapper from '../src/index';
import character from './data/character';

describe('Indexer - Position', () => {
    it('should get item by position', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(character, '.items[0]');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).not.eq(null);
        expect(result.getSingle().name).eq('flask');
    });

    it('should be able to continue with path', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(character, '.items[0].name');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq('flask');
    });

    it('should return null when position is out of range', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(character, '.items[5]');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq(null);
    });

    it('should not fail with path when return null', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(character, '.items[5].name');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq(null);
    });

    it('should return null when used on non-array type', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(character, '.sword[0]');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq(null);
    });
});
