namespace Events {
    let theMap: Map
    let theCritters: Array<Critter>
    let newCreatureOdds = 4 // chance at first, incrementing every slowTick
    let adoptOdds = 4 // chance someone will show up, incrementing every slowTick
    let currentlyEvent: boolean = false

    export function init({ map, critters }: { map: Map, critters: Array<Critter> }) {
        theMap = map
        theCritters = critters

        // sprites.onOverlap(SpriteKind.Player, SpriteKind.Player, (sprite: Sprite, otherSprite: Sprite) => {

        // })
    }

    export function slowTick() {
        checkForNewArrival({ map: theMap, critters: theCritters })
        checkShouldAdopt({ critters: theCritters })
    }

    function checkForNewArrival({ map, critters }: { map: Map, critters: Array<Critter> }) {
        if (currentlyEvent) return

        if (Math.percentChance(newCreatureOdds)) {
            newArrival({ map, critters })
            newCreatureOdds = 4
        } else {
            // Odds improve over time
            newCreatureOdds += 1
        }
    }

    export function newArrival({ map, critters }: { map: Map, critters: Array<Critter> }) {
        // Don't have more than 6 critters
        if (critters.length >= 6) {
            newCreatureOdds = 4
        } else {
            currentlyEvent = true
            // Create a new creature in the wilderness
            game.showLongText('A creature was found!', DialogLayout.Bottom)
            Critters.generateAndPlaceCritter({ map: theMap })
            currentlyEvent = false
        }
    }

    function checkShouldAdopt({ critters }: { critters: Array<Critter> }) {
        // If an event is going on, abort (too bad!)
        if (currentlyEvent) return

        if (Math.percentChance(adoptOdds)) {
            startAdoption({ critters })
            adoptOdds = 4
        } else {
            // Adopt odds improve over time
            adoptOdds += 1
        }
    }

    export function startAdoption({ critters }: { critters: Array<Critter> }) {
        const minHealth = 0
        const minHappiness = 0

        // A person has shown up, now what is their chance they will adopt?
        const adoptableCritters = critters.reduce((acc: Array<Critter>, critter: Critter) => {
            const inzone = Utils.isInZone(critter.locationX, critter.locationY, foodOne)
            console.log(`in zone? ${inzone}`)
            if (critter.happiness > minHappiness && 
                critter.health > minHealth &&
                    (
                        Utils.isInZone(critter.locationX, critter.locationY, foodOne) ||
                        Utils.isInZone(critter.locationX, critter.locationY, foodTwo) ||
                        Utils.isInZone(critter.locationX, critter.locationY, foodThree) ||
                        Utils.isInZone(critter.locationX, critter.locationY, playpen)
                    )
                ) {
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
                currentlyEvent = true
                controller.moveSprite(Player.ginny, 0, 0)
                story.printDialog(`Hey there! I would like to adopt a pokemon!`, 80, 90, 50, 150, 15, 1, story.TextSpeed.VeryFast)
                story.printDialog(`Which ones are available?`, 80, 90, 50, 150, 15, 1, story.TextSpeed.VeryFast)
                // Can't ...choices or apply(null, choices) :(
                story.showPlayerChoices(choices[0], choices[1], choices[2], 'Sorry no')
                controller.moveSprite(Player.ginny, 60, 60)
                currentlyEvent = false
            })
        }
    }
}