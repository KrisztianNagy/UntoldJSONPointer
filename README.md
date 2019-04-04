# Untold JSON Pointer

The JSON Pointer was created to get the reference of properties in a JSON object. It has its own simple query system which helps you traverse the property tree.
It is also "null-safe" safe you don't have to check if every single step in your path exists or not.

Since JSON Pointer works with references, you can use it to update the selected property.

## Installing

The project is available as an npm package. You can install it with the following command:

```
npm install untold-json-pointer -S
```

## Usage

For the purpose of this example we will write queries for the [Character](test/data/character.ts) JSON object.

### Your first query

First, import the mapper.

```javascript
import JSONMapper from '../src/index';
```

Next, you should create a new instance from the JSON Pointer:

```javascript
const mapper = new JSONMapper();
```

Let's say you want to get the name property of the character object. You have 2 ways to do this. You can pass the string into the mapper:

```javascript
const result = mapper.executeQuery(character, '.name');
```

Or you can create a query object first

```javascript
const query = mapper.createQuery('.name');
const result = mapper.executeQuery(character, query);
```

The second aproach is useful when you want to execute the same query on different objects because you save time on parsing.

### Using the result object

The result object has the following methods and properties.

The _isQueryValid_ property tells you if the parser was able to process your query

```javascript
result.isQueryValid;
```

The _error_ property stores the error message from the parser if the _isQueryValid_ property is false

```javascript
result.error;
```

The _getAll()_ method returns all properties matching our query. The result is an array and every item in the array represents one of the properties. The length
of the array is empty if nothing matches your query. It becomes useful when we we are using the onEach operator which is represented by a _|_ character.

```javascript
result.getAll();
```

The _getSingle()_ method returns the first property which maches our query. The result is null if nothing matches our query. If you are only using paths and
indexers then you should always use this method because multiple results can only occure for filters.

```javascript
result.getSingle();
```

### Working with Path

Every member in the path are being identified with the '.' character. That's also true for the root member.

```javascript
const nameOfCharacter = mapper.executeQuery(character, '.name');
const nameOfWeapon = mapper.executeQuery(character, '.weapon.name');

console.log(nameOfCharacter.getSingle()); // 'Conan'
console.log(nameOfWeapon.getSingle()); // 'sword'
```

You don't have to worry about missing members in your JSON.

```javascript
const wrongPath = mapper.executeQuery(character, '.wrong.path');

console.log(wrongPath.getSingle()); // null
```

### Working with Indexers

Indexers are very similar to their JavaScript counterparts. You can use numbers or string to access members of an object.

```javascript
const nameOfTheFirstItem = mapper.executeQuery(character, '.items[0].name');
const nameOfTheWeapon = mapper.executeQuery(character, '.weapon["name"]');

console.log(nameOfTheFirstItem.getSingle()); // 'flask'
console.log(nameOfTheWeapon.getSingle()); // 'sword'
```

It is also null-safe so you don't have to worry about going out of bounds.

```javascript
const indexerOverLength = mapper.executeQuery(character, '.items[5].name');

console.log(indexerOverLength.getSingle()); // null
```

### Accessing each item in an array simultaneously

It is possible to access every single item in an array at the same time. The _|_ operator iterates through the array and returns the specified property from
each element.

```javascript
const itemNames = mapper.executeQuery(character, '.items|name');

console.log(itemNames.getSingle()); // "flask"
console.log(itemNames.getAll()); // ["flask", "meat", "diamond", "golden key"]
```

When your query has a filter, you can start using the _getAll()_ and _setAll()_ methods because you can never be sure that it only matches one item.

### Working with Filters

Filters can be very powerful because you can write a condition which will be executed against every single member of the array and identifies the matching ones.

Usually a filter looks like this: { lefthandSide operator righHandSide } The sides can be path or value. All of the regular javascript number and string
operators are available (<, <=, >, >=, ==, ===, !=, !==) and also we have a special operator for contains which is the ':' character.

```javascript
const itemsWhereWeightGreateThanOne = mapper.executeQuery(character, '.items{ .weight > 1}');
console.log(itemsWhereWeightGreateThanOne); // [{"name":"diamond","weight":2,"quantity":1,"equipped":false}]
```

The _true_, _false_, _null_ keywords are also avilable in the queries.

```javascript
const equipped = mapper.executeQuery(character, '.items{ .equipped == true}');
const notEquipped = mapper.executeQuery(character, '.items{ .equipped == true}');
const withoutPrice = mapper.executeQuery(character, '.items{ .price == null}');
```

### Setting values

For simple queries you can use the _setSingle()_ method to set the value of the selected property.

```javascript
const mapper = new JSONMapper();
const result = mapper.executeQuery(character, '.name');
result.setSingle('Joe');

console.log(character.name); // "Joe"
```

If you are pointing to multiple items using the _|_ operator then the _setSingle()_ method will only update the first matching item. In that case you should use
the _setAll()_ method.

## Built With

-   [TypeScript](https://www.typescriptlang.org/) - The language being used
-   [PEGjs](https://pegjs.org/) - Parse generator for the query

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as
appropriate.

Building the application:

```
npm run build
```

Generating types for TypeScript:

```
npm run build:types
```

Executing tests in chrome:

```
npm run test
```

## Authors

-   **Krisztian Nagy** - [LinkedIn](https://www.linkedin.com/in/krisztian-nagy-1523a231/)

## License

[MIT](https://choosealicense.com/licenses/mit/)

```

```
