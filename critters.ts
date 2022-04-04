namespace Critters {
    let theMap: Map

    export let critters: Array<Critter> = []
    export let critterDatabase: CritterDatabase = {}
    export let typeToImage: CritterImageDatabase = {}
    export let levelNames: { [T: string]: Array<string> } = {}
    
    export function init({ map }: { map: Map }) {
        theMap = map
        // Create the first Critters
        generateAndPlaceCritter({ map: theMap })
    }

    export function fastTick() {
        adjustHappiness(critters)
    }

    export function slowTick() {
        // All critters tick at the same time for this one
    }

    export function generateAndPlaceCritter({ critterType, map }: { critterType?: string, map: Map }) {
        if (!critterType) {
            // Sum up all the critter database odds, and determine the overall odds of a single
            // The pick array is [4, 2, 6, etc] tied to the array of critters
            // Then we pick a random number in there, add them as we increment to find the index
            const pickArray: Array<number> = []
            const totalOdds = Object.keys(critterDatabase).reduce((acc: number, critterType: string) => {
                acc += critterDatabase[critterType].oddsOfFinding
                pickArray.push(critterDatabase[critterType].oddsOfFinding)
                return acc
            }, 0)
            const pickedNumber = Math.randomRange(0, totalOdds)
            // Loop through the pickArray, adding them until we equal the pickedIndex
            let pickedIndex = 0
            let found = false
            pickArray.reduce((acc: number, arrayNumber: number, index: number) => {
                acc += arrayNumber
                // Only set if it hasn't been set yet
                if (acc >= pickedNumber && !found) {
                    pickedIndex = index
                    found = true
                }
                return acc
            }, 0)

            critterType = Object.keys(Critters.critterDatabase)[pickedIndex]
        }

        const critter: Critter = {
            sprite: sprites.create(typeToImage[critterType][0], SpriteKind.Critter),
            name: getName(),
            levelName: levelNames[critterType][0],
            level: 0,
            previousFacing: Facing.Right, // Critters are drawn facing right
            // The health and happiness are +/- 20% of their base number (base = 70)
            health: Math.floor(70 * (Math.randomRange(80, 120) / 100)),
            happiness: Math.floor(70 * (Math.randomRange(80, 120) / 100)),
            // Place the critter in the Map
            locationX: Math.randomRange(map.wildernessX, map.mapWidth - 8),
            locationY: Math.randomRange(8, map.mapHeight - 8),
            timerCount: 0
        }

        // Set sprite and start the tick
        critter.sprite.setPosition(critter.locationX, critter.locationY)
        critter.tickTimer = setTimeout(() => critterOnTick(critter), Math.randomRange(100, 3000))

        critters.push(critter)

        return critter
    }

    // Adopt a creature by name (key)
    export function adoptCritter(name: string) {
        // Add the name back into the available pool
        addName(name)
        const critter = critters.find(c => c.name === name)
        critter.sprite.destroy()
        critters.removeElement(critter)
    }

    function moveCritter(critter: Critter) {
        if (critter.sprite.vx == 0 && critter.sprite.vy == 0) {
            // Move the critter
            randDirectionX = Math.randomRange(-20, 20)
            randDirectionY = Math.randomRange(-20, 20)

            // Facing = direction we are moving based on directionX
            let facing
            // Point the sprite
            if (randDirectionX > 0) {
                facing = Facing.Right
            } else if (randDirectionX >= 0) {
                facing = Facing.Left
            }
            
            // Flip the icon if needed
            if (facing !== critter.previousFacing) {
                critter.sprite.image.flipX()
            }
            // Save this facing for next round
            critter.previousFacing = facing
            critter.sprite.setVelocity(randDirectionX, randDirectionY)
        } else {
            // Stop any movement
            critter.sprite.setVelocity(0, 0)
            // Record where we are for save-game needs
            critter.locationX = critter.sprite.x
            critter.locationY = critter.sprite.y
        }
    }

    // Adjust health, happiness and move (100 to 3000 ms timer)
    function critterOnTick(critter: Critter) {
        moveCritter(critter)
        critter.timerCount++

        // Use this for slow ticks
        if (critter.timerCount > 10) {
            critter.timerCount = 0
        }

        if (critter.timerCount === 10) {
            // Display the emoji if they are not healthy/happy
            if (critter.health < 30) {
                // story.spriteSayText(critter.sprite, "I'm hungry")
                critter.sprite.sayText("I'm hungry", 2000)
            } else if (critter.happiness < 30) {
                // story.spriteSayText(critter.sprite, "I'm bored")
                critter.sprite.sayText("I'm bored", 2000)
            }
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
        const foodConstantFactor = 30
        playpen.factor = -2
        foodOne.factor = Environment.hay[0].quantity
        foodTwo.factor = Environment.hay[1].quantity
        foodThree.factor = Environment.hay[2].quantity

        allCritters.forEach(critter => {
            if (critter.sprite) {
                // Check to see if the critter is in the play area
                if (Utils.isInZone(critter.sprite.x, critter.sprite.y, playpen)) {
                    playpen.factor++
                    critter.health--
                } else {
                    if (Utils.isInZone(critter.sprite.x, critter.sprite.y, foodOne)) {
                        // Feed the critter now (the first to eat gets it!)
                        // Health regains faster when lower
                        critter.health += Math.floor(foodOne.factor * Math.ceil((100 - critter.health) / foodConstantFactor))
                        foodOne.factor--
                        if (foodOne.factor < 0) {
                            foodOne.factor = 0
                        }
                    } else if (Utils.isInZone(critter.sprite.x, critter.sprite.y, foodTwo)) {
                        // Feed the critter now (the first to eat gets it!)
                        critter.health += Math.floor(foodTwo.factor * Math.ceil((100 - critter.health) / foodConstantFactor))
                        foodTwo.factor--
                        if (foodTwo.factor < 0) {
                            foodTwo.factor = 0
                        }
                    } else if (Utils.isInZone(critter.sprite.x, critter.sprite.y, foodThree)) {
                        // Feed the critter now (the first to eat gets it!)
                        critter.health += Math.floor(foodThree.factor * Math.ceil((100 - critter.health) / foodConstantFactor))
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
                // Check to see if the critter is in the play area
                if (Utils.isInZone(critter.sprite.x, critter.sprite.y, playpen)) {
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

    const names: Array<string> = ['Zizzi', 'Marvin', 'Asad', 'Tweak', 'Sugar', 'Dredd', 'Billabong', 'Squeak', 'Bentclaw', 'Bella', 'Linne', 'Stardust', 'Sammy']
    const availableNames: Array<string> = names.slice()

    // Get a random available name
    function getName(): string {
        const index = Math.randomRange(0, names.length - 1)
        const name = names[index]
        names.splice(index, 1)
        return name
    }

    // put a name back in the pool of names
    function addName(name: string) {
        names.push(name)
    }
}