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
        newArrival({ map: theMap, critters: theCritters })
        adopter({ critters: theCritters })
    }

    function newArrival({ map, critters }: { map: Map, critters: Array<Critter> }) {
        // Don't have more than 6 critters
        if (critters.length >= 6) {
            newCreatureOdds = 4
            return
        }

        if (Math.percentChance(newCreatureOdds)) {
            // Create a new creature in the wilderness
            newCreatureOdds = 4
            game.showLongText('A creature was found!', DialogLayout.Bottom)
            Critters.generateAndPlaceCritter({ map: theMap })
        } else {
            // Odds improve over time
            newCreatureOdds += 1
        }
    }

    function adopter({ critters }: { critters: Array<Critter> }) {
        const minHealth = 0
        const minHappiness = 0

        if (Math.percentChance(adoptOdds)) {
            // A person has shown up, now what is their chance they will adopt?
            // Figure out this complicated odds...
            adoptOdds = 4
            const adoptableCritters = critters.reduce((acc: Array<Critter>, critter: Critter) => {
                if (critter.happiness > minHappiness && critter.health > minHealth) {
                    acc.push(critter)
                }
                // TODO add another entry if they are higher level
                return acc
            }, [])
            // Put the happiest/healthiest on top
            adoptableCritters.sort((critter1: Critter, critter2: Critter) => {
                if (critter1.happiness + critter1.health > critter2.happiness + critter2.health) {
                    return -1
                }
                return 1
            })

            // If there are any adoptable critters, pick a random one
            if (adoptableCritters.length) {
                // Pick the top 3 so the person can adopt
                const choices = adoptableCritters.slice(0, 3).map(c => c.name)
                // const adoptCritter = Math.pickRandom(adoptableCritters)
                story.startCutscene(function () {
                    controller.moveSprite(ginny, 0, 0)
                    story.printDialog(`Hey there! I would like to adopt a pokemon!`, 80, 90, 50, 150, 15, 1, story.TextSpeed.VeryFast)
                    story.printDialog(`Which ones are available?`, 80, 90, 50, 150, 15, 1, story.TextSpeed.VeryFast)
                    // Can't ...choices or apply(null, choices) :(
                    story.showPlayerChoices(choices[0], choices[1], choices[2], 'Sorry no')
                    controller.moveSprite(ginny, 60, 60)
                })
                // game.showLongText(`I'd like to adopt ${adoptCritter.name}`, DialogLayout.Top)
            }
        } else {
            // Adopt odds improve over time
            adoptOdds += 1
        }
    }

}