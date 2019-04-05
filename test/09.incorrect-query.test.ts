import { expect } from 'chai';
import { JSONPointer } from '../src/index';

describe('Incorrect Query', () => {
    it('should fail on missing "." character', () => {
        const mapper = new JSONPointer();
        const query = mapper.createQuery('name');

        expect(query.isQueryValid).eq(false);
    });

    it('should fail on incomplete indexer', () => {
        const mapper = new JSONPointer();
        const query = mapper.createQuery('name[');

        expect(query.isQueryValid).eq(false);
    });

    it('should fail on missing string in indexer', () => {
        const mapper = new JSONPointer();
        const query = mapper.createQuery('name[string]');

        expect(query.isQueryValid).eq(false);
    });

    it('should fail on incomplete filter', () => {
        const mapper = new JSONPointer();
        const query = mapper.createQuery('name{');

        expect(query.isQueryValid).eq(false);
    });
});
