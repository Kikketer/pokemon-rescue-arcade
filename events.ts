namespace Events {
    let theMap: Map
    let theCritters: Array<Critter>
    let newCreatureOdds = 4 // chance at first, incrementing every slowTick
    let adoptOdds = 4 // chance someone will show up, incrementing every slowTick
    let visitors: Array<Sprite> = []
    export let currentlyEvent: boolean = false
    const minHealth = 0
    const minHappiness = 0

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
            story.printDialog('A creature was spotted!', 80, 100, 50, 150, 15, 1, story.TextSpeed.VeryFast)
            Critters.generateAndPlaceCritter({ map: theMap })
            currentlyEvent = false
        }
    }

    // Make the phone ring?
    function checkShouldAdopt({ critters }: { critters: Array<Critter> }) {
        // If an event is going on, abort (too bad!)
        if (currentlyEvent) return

        if (Math.percentChance(adoptOdds)) {
            // Now see if there any that can be adopted!
            if (getAdpotableCritters().length) {
                Environment.setPhoneRinging(true)
            }
            adoptOdds = 4
        } else {
            // Adopt odds improve over time
            adoptOdds += 1
        }
    }

    // Answer the phone (if it's ringing, we start adoption, if not we attempt to force it`)
    export function onPickupPhone() {
        if (Environment.isPhoneRinging) {
            Environment.setPhoneRinging(false)
            startAdoption(getAdpotableCritters())
        } else {
            // If you call someone when it's not ringing, you have a chance to adopt
            if (Math.percentChance(10)) {
                startAdoption(getAdpotableCritters())
            } else {
                story.printDialog('No one wants to adopt today', 80, 120, 100, 100)
            }
        }
    }

    function getAdpotableCritters() {
        // A person has shown up, now what is their chance they will adopt?
        let adoptableCritters = theCritters.reduce((acc: Array<Critter>, critter: Critter) => {
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

        return adoptableCritters
    }

    function startAdoption(adoptableCritters: Array<Critter>) {
        // If there are any adoptable critters, pick a random one
        if (adoptableCritters.length) {
            // Put the happiest/healthiest on top
            adoptableCritters.sort((critter1: Critter, critter2: Critter) => {
                if (critter1.happiness + critter1.health > critter2.happiness + critter2.health) {
                    return -1
                }
                return 1
            })

            // Pick the top 3 so the person can adopt
            const choices = adoptableCritters.slice(0, 3).map(c => c.name)

            story.startCutscene(() => {
                currentlyEvent = true
                controller.moveSprite(Player.ginny, 0, 0)
                const visitorFace = sprites.create(assets.image`visitor1`)
                visitorFace.setScale(2)
                visitorFace.setPosition(Player.ginny.x + 50, Player.ginny.y + 30)
                story.printDialog('Hi Ginny, I would like to adopt a Pokemon.', 60, 100, 100, 100)
                story.printDialog('Which ones are you willing to release?', 60, 100, 100, 100)
                story.showPlayerChoices(choices[0], choices[1], choices[2], 'Sorry none')
                visitorFace.destroy()

                // Find the one they picked
                const pickedCritter = choices.find(c => c === story.getLastAnswer())
                if (!pickedCritter) {
                    // You said no
                    story.printDialog('That\'s sad...', 80, 100, 50, 120)
                } else {
                    // Replace the name we took
                    Critters.adoptCritter(pickedCritter)
                    story.printDialog(`${pickedCritter} has been adopted!`, 80, 100, 50, 120)
                }
                controller.moveSprite(Player.ginny, 60, 60)
                currentlyEvent = false
            })
        }
    }
}