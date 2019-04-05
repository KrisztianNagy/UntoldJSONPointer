import { expect } from 'chai';

import { JSONPointer } from '../src/index';
import character from './data/character';

describe('Indexer - Key', () => {
    it('should get item by key', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.weapon["name"]');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq('sword');
    });

    it('should return null when key does not exist', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.weapon["nokey"]');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq(null);
    });

    it('should return null when used on non name ', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.nonname["nokey"]');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq(null);
    });
});
