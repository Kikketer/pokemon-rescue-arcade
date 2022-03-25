namespace Critters {
    let theMap: Map

    export let critters: Array<Critter> = []
    export let critterDatabase: CritterDatabase = {}
    export let typeToImage: CritterImageDatabase = {}
    
    export function init({ map }: { map: Map }) {
        theMap = map
        // Create the first Critters
        generateAndPlaceCritter({ critterType: 'charmander', map: theMap })
    }

    export function slowTick() {
        adjustHappiness(critters)
    }

    export function generateAndPlaceCritter({ critterType, map }: { critterType?: string, map: Map }) {
        if (!critterType) {
            critterType = Math.pickRandom(Object.keys(Critters.critterDatabase))
        }
        // Copy it out of the DB (first index, aka level 0)
        const critter = JSON.parse(JSON.stringify(Critters.critterDatabase[critterType][0]))
        // The health and happiness are +/- 20% of their base number
        critter.health = Math.floor(critter.health * (Math.randomRange(80, 120) / 100))
        critter.happiness = Math.floor(critter.happiness * (Math.randomRange(80, 120) / 100))

        // Place the critter in the Map
        critter.locationX = Math.randomRange(map.wildernessX, map.mapWidth - 8)
        critter.locationY = Math.randomRange(8, map.mapHeight - 8)

        // Set sprite and start the tick
        critter.sprite = sprites.create(typeToImage[critterType][0], SpriteKind.Critter)
        critter.sprite.setPosition(critter.locationX, critter.locationY)
        critter.tickTimer = setTimeout(() => critterOnTick(critter), 3000)

        critters.push(critter)

        return critter
    }

    function moveCritter(critter: Critter) {
        if (critter.sprite.vx == 0 && critter.sprite.vy == 0) {
            // Move the critter
            randDirectionX = Math.randomRange(-20, 20)
            randDirectionY = Math.randomRange(-20, 20)
            critter.sprite.setVelocity(randDirectionX, randDirectionY)
        } else {
            // Stop any movement
            critter.sprite.setVelocity(0, 0)
            // Record where we are for save-game needs
            critter.locationX = critter.sprite.x
            critter.locationY = critter.sprite.y
        }
    }

    // Adjust health, happiness and move
    function critterOnTick(critter: Critter) {
        moveCritter(critter)
        // Display the emoji if they are not healthy/happy
        if (critter.health < 30) {
            critter.sprite.sayText("(-o-)", 2000)
        } else if (critter.happiness < 30) {
            critter.sprite.sayText("🤮", 2000)
        }

        clearTimeout(critter.tickTimer)
        critter.tickTimer = setTimeout(() => critterOnTick(critter), Math.randomRange(100, 3000))
    }

    /**
     * Adjusts the happiness of critters
     * @param Array<Critter> allCritters
     */
    function adjustHappiness(allCritters: Array<Critter>) {
        // We need at least two creatures to start recovering
        playpen.factor = -2
        foodOne.factor = 1
        foodTwo.factor = 1
        foodThree.factor = 1

        allCritters.forEach(critter => {
            if (critter.sprite) {
                const tileX = Math.floor(critter.sprite.x / 16)
                const tileY = Math.floor(critter.sprite.y / 16)
                // Check to see if the critter is in the play area
                if (Utils.isInZone(tileX, tileY, playpen)) {
                    playpen.factor++
                    critter.health--
                } else {
                    if (Utils.isInZone(tileX, tileY, foodOne)) {
                        // Feed the critter now (the first to eat gets it!)
                        critter.health += foodOne.factor
                        foodOne.factor--
                        if (foodOne.factor < 0) {
                            foodOne.factor = 0
                        }
                    } else if (Utils.isInZone(tileX, tileY, foodTwo)) {
                        // Feed the critter now (the first to eat gets it!)
                        critter.health += foodTwo.factor
                        foodTwo.factor--
                        if (foodTwo.factor < 0) {
                            foodTwo.factor = 0
                        }
                    } else if (Utils.isInZone(tileX, tileY, foodThree)) {
                        // Feed the critter now (the first to eat gets it!)
                        critter.health += foodThree.factor
                        foodThree.factor--
                        if (foodThree.factor < 0) {
                            foodThree.factor = 0
                        }
                    } else {
                        // Degrade Health
                        critter.health--
                    }
                }
                // Cap it
                if (critter.health < 0) {
                    critter.health = 0
                } else if (critter.health > 100) {
                    critter.health = 100
                }
            }
        })

        // If there are two critters in the pen they start to get happy
        if (playpen.factor === 0) {
            playpen.factor = 1
        }

        // Now with total happiness, we can provide that to all of them
        allCritters.forEach(critter => {
            if (critter.sprite) {
                const tileX = Math.floor(critter.sprite.x / 16)
                const tileY = Math.floor(critter.sprite.y / 16)
                // Check to see if the critter is in the play area
                if (Utils.isInZone(tileX, tileY, playpen)) {
                    critter.happiness += playpen.factor
                    if (critter.happiness > 100) {
                        critter.happiness = 100
                    }
                } else {
                    // Degrade happiness
                    critter.happiness -= happinessDegradeFactor
                    if (critter.happiness < 0) {
                        critter.happiness = 0
                    }
                }
            }
        })
    }
}