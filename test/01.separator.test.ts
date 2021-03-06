import { expect } from 'chai';

import JSONPointer from '../src/index';
import character from './data/character';

describe('Separator', () => {
    it('should parse simple member from root scope', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.name');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq('Conan');
    });

    it('should parse space containing member from root scope', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '."has space"');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq('this has space');
    });

    it('should parse deep members', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.weapon.name');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq('sword');
    });

    it('should parse deep members containing space', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.weapon."original owner"');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq('Bob');
    });

    it('should return null when path does not exist', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.wrong.path');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq(null);
    });

    it('should parse flat array', () => {
        const mapper = new JSONPointer();
        const result = mapper.executeQuery(character, '.items|name');

        expect(result.isQueryValid).eq(true);
        expect(result.getSingle()).eq('flask');
        expect(result.getAll().length).eq(4);
    });
});
