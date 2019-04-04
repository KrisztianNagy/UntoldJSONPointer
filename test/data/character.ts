const character = {
    name: 'Conan',
    weapon: {
        name: 'sword',
        price: 1,
        style: {
            color: 'red'
        }
    },
    items: [
        {
            name: 'flask',
            weight: 0.1,
            quantity: 10,
            equipped: true,
            price: 100,
            description: {
                short: 'Cheap flask',
                long: 'Really. Just a flask'
            },
            liquids: [
                {
                    type: 'wine',
                    drinkable: true
                },
                {
                    type: 'oil',
                    drinkable: false
                }
            ]
        },
        {
            name: 'meat',
            weight: 1,
            quantity: 3,
            equipped: false,
            price: 1,
            description: {
                short: 'Cow',
                long: 'Dried cow meat. Good for 2 weeks.'
            }
        },
        {
            name: 'diamond',
            weight: 2,
            quantity: 1,
            equipped: false
        },
        {
            name: 'golden key',
            weight: 0.5,
            quantity: 1,
            equipped: null
        }
    ]
};

export default character;
