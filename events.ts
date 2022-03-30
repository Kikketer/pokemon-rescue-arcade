namespace Events {
    let theMap: Map
    let theCritters: Array<Critter>
    let newCreatureOdds = 4 // chance at first, incrementing every slowTick
    let adoptOdds = 4 // chance someone will show up, incrementing every slowTick
    let currentlyEvent: boolean = false
    let visitors: Array<Sprite> = []

    export function init({ map, critters }: { map: Map, critters: Array<Critter> }) {
        theMap = map
        theCritters = critters
    }

    export function slowTick() {
        checkForNewArrival({ map: theMap, critters: theCritters })
        checkShouldAdopt({ critters: theCritters })
    }

    function checkForNewArrival({ map, critters }: { map: Map, critters: Array<Critter> }) {
        if (currentlyEvent) return

        if (Math.percentChance(newCreatureOdds)) {
            _newArrival({ map, critters })
            newCreatureOdds = 4
        } else {
            // Odds improve over time
            newCreatureOdds += 1
        }
    }

    export function _newArrival({ map, critters }: { map: Map, critters: Array<Critter> }) {
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
            _startAdoption({ critters })
            adoptOdds = 4
        } else {
            // Adopt odds improve over time
            adoptOdds += 1
        }
    }

    export function _startAdoption({ critters }: { critters: Array<Critter> }) {
        const minHealth = 0
        const minHappiness = 0

        // A person has shown up, now what is their chance they will adopt?
        const adoptableCritters = critters.reduce((acc: Array<Critter>, critter: Critter) => {
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

            story.startCutscene(() => {
                currentlyEvent = true
                controller.moveSprite(Player.ginny, 0, 0)
                visitors.push(sprites.create(assets.image`visitor1`))
                visitors[0].setScale(2)
                visitors[0].setPosition(130, 90)
                story.printDialog('Hi Ginny, I would like to adopt a Pokemon.', 60, 100, 100, 100)
                story.printDialog('Which ones are you willing to release?', 60, 100, 100, 100)
                story.showPlayerChoices(choices[0], choices[1], choices[2], 'Sorry none')
                visitors[0].destroy()
                story.printDialog('They have adopted!', 80, 100, 50, 200)
                controller.moveSprite(Player.ginny, 60, 60)
                currentlyEvent = false
            })
        }
    }
}