Critters.critterDatabase = {
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

// Each level of each type, [left, right, left, right,....]
Critters.typeToImage = {
    charmander: [assets.image`Charmander0`, assets.image`Charmander1`],
    squirtle: [assets.image`Squirtle0`, assets.image`Squirtle1`],
    pikachu: [assets.image`Pikachu0`, assets.image`Pikachu1`]
}

// Names of the different levels (used when making a phone call)
Critters.levelNames = {
    charmander: ['charmander'],
    squirtle: ['squirtle'],
    pikachu: ['pikachu']
}