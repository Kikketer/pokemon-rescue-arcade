Critters.critterDatabase = {
    bulbasaur: {
        oddsOfFinding: 10
    },
    charmander: {
        oddsOfFinding: 10
    },
    squirtle: {
        oddsOfFinding: 10
    },
    pikachu: {
        oddsOfFinding: 1
    }
}

Critters.possibleNames = ['Zizzi', 'Marvin', 'Asad', 
    'Tweak', 'Sugar', 'Dredd', 'Billabong', 
    'Squeak', 'Bentclaw', 'Bella', 'Linne', 
    'Stardust', 'Sammy', 'Leo', 'Bella', 'Milo', 'Lucy',
    'Loki', 'Chloe', 'Oreo', 'Ollie', 'Binx', 'Toby']

// Each level of each type, [left, right, left, right,....]
Critters.typeToImage = {
    bulbasaur: [assets.image`Bulbasaur0`, assets.image`Bulbasaur1`, assets.image`Bulbasaur2`, assets.image`Bulbasaur3`],
    charmander: [assets.image`Charmander0`, assets.image`Charmander1`, assets.image`Charmander2`, assets.image`Charmander3`],
    squirtle: [assets.image`Squirtle0`, assets.image`Squirtle1`, assets.image`Squirtle2`, assets.image`Squirtle3`],
    pikachu: [assets.image`Pikachu0`, assets.image`Pikachu1`, assets.image`Pikachu2`, assets.image`Pikachu3`]
}

// Names of the different levels (used when making a phone call)
Critters.levelNames = {
    bulbasaur: ['bulbasaur'],
    charmander: ['charmander'],
    squirtle: ['squirtle'],
    pikachu: ['pikachu']
}