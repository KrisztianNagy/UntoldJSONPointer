import { expect } from 'chai';
import JSONMapper from '../src';

describe('Incorrect Query', () => {
    it('should fail on missing "." character', () => {
        const mapper = new JSONMapper();
        const query = mapper.createQuery('name');

        expect(query.isQueryValid).eq(false);
    });

    it('should fail on incomplete indexer', () => {
        const mapper = new JSONMapper();
        const query = mapper.createQuery('name[');

        expect(query.isQueryValid).eq(false);
    });

    it('should fail on missing string in indexer', () => {
        const mapper = new JSONMapper();
        const query = mapper.createQuery('name[string]');

        expect(query.isQueryValid).eq(false);
    });

    it('should fail on incomplete filter', () => {
        const mapper = new JSONMapper();
        const query = mapper.createQuery('name{');

        expect(query.isQueryValid).eq(false);
    });
});
