namespace Events {
    let theMap: Map
    let theCritters: Array<Critter>
    let newCreatureOdds = 4 // chance at first, incrementing every slowTick
    let adoptOdds = 4 // chance someone will show up, incrementing every slowTick

    export function init({ map, critters }: { map: Map, critters: Array<Critter> }) {
        theMap = map
        theCritters = critters
    }

    export function slowTick() {
        newArrival({ map: theMap })
        adopter({ critters: theCritters })
    }

    function newArrival({ map }: { map: Map }) {
        if (Math.percentChance(newCreatureOdds)) {
            // Create a new creature in the wilderness
            newCreatureOdds = 4
            game.showLongText('A creature was found!', DialogLayout.Bottom)
            // Create a random X location (>wildernessX but <mapWidth)
            // Create a random Y location (>0 but <mapHeight)
        } else {
            // Odds improve over time
            newCreatureOdds += 1
        }
    }

    function adopter({ critters }: { critters: Array<Critter> }) {
        if(Math.percentChance(adoptOdds)) {
            // A person has shown up, now what is their chance they will adopt?
            // Figure out this complicated odds...
            adoptOdds = 4
            const adoptableCritters = critters.reduce((acc: Array<Critter>, critter: Critter) => {
                if (critter.happiness > 50 && critter.health > 50) {
                    acc.push(critter)
                }
                // TODO add another entry if they are higher level
                return acc
            }, [])

            // If there are any adoptable critters, pick a random one
            game.showLongText('Someone wishes to adopt!', DialogLayout.Bottom)
        } else {
            // Adopt odds improve over time
            adoptOdds += 1
        }
    }

}