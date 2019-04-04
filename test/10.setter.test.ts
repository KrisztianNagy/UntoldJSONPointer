import { expect } from 'chai';
import JSONMapper from '../src';
import character from './data/character';

describe('Setter', () => {
    let characterCopy: any;

    beforeEach(() => {
        characterCopy = JSON.parse(JSON.stringify(character));
    });

    it('should handle setSingle()', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(characterCopy, '.name');

        expect(result.getSingle()).eq('Conan');
        result.setSingle('Joe');

        const updatedResult = mapper.executeQuery(characterCopy, '.name');
        expect(updatedResult.getSingle()).eq('Joe');
    });

    it('should handle setSingle() when has each operator', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(characterCopy, '.items{.equipped === false}|name');

        expect(result.getAll().length).eq(2);

        result.setSingle('noname');

        const updatedResult = mapper.executeQuery(characterCopy, '.items{.name === "noname"}');
        expect(updatedResult.getSingle().length).eq(1);
    });

    it('should handle setSingle() when has multiple operator', () => {
        const mapper = new JSONMapper();

        const originalNoname = mapper.executeQuery(characterCopy, '.items{.description.short === "noname"}|description.short');
        expect(originalNoname.getAll().length).eq(0);

        const result = mapper.executeQuery(characterCopy, '.items{.name === "flask" || .name === "meat"}|description.short');

        expect(result.getAll().length).eq(2);

        result.setSingle('noname');

        const updatedNoname = mapper.executeQuery(characterCopy, '.items{.description.short === "noname"}|description.short');
        expect(updatedNoname.getAll().length).eq(1);
    });

    it('should not fail on setSingle() when query is not matching', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(characterCopy, '.wrong.path');
        expect(result.getSingle()).eq(null);
        result.setSingle('Joe');

        const updatedResult = mapper.executeQuery(characterCopy, '.wrong.path');
        expect(updatedResult.getSingle()).eq(null);
    });

    it('should set property if only the last path member is missing', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(characterCopy, '.weapon.age');
        expect(result.getSingle()).eq(null);
        result.setSingle(1);

        const updatedResult = mapper.executeQuery(characterCopy, '.weapon.age');
        expect(updatedResult.getSingle()).eq(1);
    });

    it('should setAll() when has each operator', () => {
        const mapper = new JSONMapper();
        const result = mapper.executeQuery(characterCopy, '.items{.equipped === false}|name');
        expect(result.getAll().length).eq(2);

        result.setAll('noname');

        const updatedResult = mapper.executeQuery(characterCopy, '.items{.name === "noname"}');
        expect(updatedResult.getSingle().length).eq(2);
    });

    it('should handle setAll() when has multiple operator', () => {
        const mapper = new JSONMapper();

        const originalNoname = mapper.executeQuery(characterCopy, '.items{.description.short === "noname"}|description.short');
        expect(originalNoname.getAll().length).eq(0);

        const result = mapper.executeQuery(characterCopy, '.items{.name === "flask" || .name === "meat"}|description.short');

        expect(result.getAll().length).eq(2);

        result.setAll('noname');

        const updatedNoname = mapper.executeQuery(characterCopy, '.items{.description.short === "noname"}|description.short');
        expect(updatedNoname.getAll().length).eq(2);
    });
});
