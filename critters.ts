namespace Critters {
    let theMap: Map

    export let critters: Array<Critter> = []
    export let critterDatabase: CritterDatabase = {}
    export let typeToImage: CritterImageDatabase = {}
    export let levelNames: { [T: string]: Array<string> } = {}
    
    /** 
     * Exported functions 
     * NOTE: These are "global" and take the resulting critter(s) as a param
    */
    export function init({ map, savedGame }: { map: Map, savedGame?: SaveGame }) {
        theMap = map

        // console.log(JSON.stringify(savedGame.critters))

        if (savedGame && savedGame.critters) {
            // If savedGame exists, rehydrate it!
            critters = savedGame.critters.map(critter => {
                critter.sprite = sprites.create(typeToImage[critter.critterType][critter.level * 2], SpriteKind.Critter)
                // And place the sprite
                critter.sprite.setPosition(critter.locationX, critter.locationY)
                // And give it life!
                critter.tickTimer = setTimeout(() => critterOnTick(critter), Math.randomRange(100, 3000))
                return critter
            })
        } else {
            // Create the first Critters
            generateAndPlaceCritter({ map: theMap })
            generateAndPlaceCritter({ map: theMap })
        }
    }

    export function fastTick() {
        adjustHappiness(critters)
    }

    export function slowTick() {
        // All critters tick at the same time for this one
    }

    // When the player picks me up, what do I do and say?
    export function onPickup(critter: Critter) {
        // Right now we just say some interesting facts
        critter.sprite.say(`${critter.name}`, 2000)
        setTimeout(() => critter.sprite.say(`Hunger:${Math.floor(critter.health / 10)}`, 2000), 2000)
        setTimeout(() => critter.sprite.say(`Happy:${Math.floor(critter.happiness / 10)}`, 2000), 4000)
    }

    export function generateAndPlaceCritter({ critterType, map }: { critterType?: string, map: Map }) {
        if (!critterType) {
            // Sum up all the critter database odds, and determine the overall odds of a single
            // The pick array is [4, 2, 6, etc] tied to the array of critters
            // Then we pick a random number in there, add them as we increment to find the index
            const pickArray: Array<number> = []
            // Get the possible critters based on adoptionLevel
            const possibleCritterTypes = Object.keys(critterDatabase).filter(critterType => {
                return critterDatabase[critterType].minLevelToAppear <= Computer.getNumberOfAdoptions()
            })

            const totalOdds = possibleCritterTypes.reduce((acc: number, critterType: string) => {
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
            critterType,
            level: 0,
            // The health and happiness are +/- 20% of their base number (base = 70)
            health: Math.floor(70 * (Math.randomRange(80, 120) / 100)),
            happiness: Math.floor(70 * (Math.randomRange(80, 120) / 100)),
            // Place the critter in the Map
            locationX: Math.randomRange(map.wildernessX, map.mapWidth - 8),
            locationY: Math.randomRange(8, map.mapHeight - 8),
            timerCount: 0,
            levelProgress: 0
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

    // The blob of stuff to save
    export function getSaveJson() {
        const result: Array<Critter> = critters.map((critter) => {
            return {
                name: critter.name,
                critterType: critter.critterType,
                level: critter.level,
                health: critter.health,
                happiness: critter.happiness,
                locationX: critter.sprite.x,
                locationY: critter.sprite.y,
                timerCount: 0,
                levelProgress: critter.levelProgress
            }
        })

        return result
    }

    /**
     * Internal functions used by the exported ones
     */

    // Adjust health, happiness and move (100 to 3000 ms timer)
    // Average around 1.5ish seconds
    function critterOnTick(critter: Critter) {
        moveCritter(critter)
        adjustLevel(critter)
        critter.timerCount++

        // Use this for slow ticks
        if (critter.timerCount > 10) {
            critter.timerCount = 0
        }

        if (critter.timerCount === 10) {
            // Display the emoji if they are not healthy/happy
            if (critter.health < 30) {
                critter.sprite.sayText("I'm hungry", 2000)
            } else if (critter.happiness < 30) {
                critter.sprite.sayText("I'm bored", 2000)
            }
        }

        clearTimeout(critter.tickTimer)
        critter.tickTimer = setTimeout(() => critterOnTick(critter), Math.randomRange(100, 3000))
    }

    function moveCritter(critter: Critter) {
        if (critter.sprite.vx == 0 && critter.sprite.vy == 0) {
            // Move the critter
            randDirectionX = Math.randomRange(-20, 20)
            randDirectionY = Math.randomRange(-20, 20)

            // Moving right, make it the "second index" of the level
            if (randDirectionX <= 0) {
                critter.sprite.setImage(typeToImage[critter.critterType][critter.level * 2])
            } else {
                critter.sprite.setImage(typeToImage[critter.critterType][(critter.level * 2) + 1])
            }

            critter.sprite.setVelocity(randDirectionX, randDirectionY)
        } else {
            // Stop any movement
            critter.sprite.setVelocity(0, 0)
            // Record where we are for save-game needs
            critter.locationX = critter.sprite.x
            critter.locationY = critter.sprite.y
        }
    }

    function adjustLevel(critter: Critter) {
        if (isWellCaredFor(critter)) {
            critter.levelProgress++
            // Level up!
            if (critter.levelProgress > (critter.level + 1) * 200) {
                // You have to keep it happy/healthy for this long
                // Level 0 = base creature
                // 1.5 average seconds success lvl1 * 200 = 5min
                // 1.5 average seconds success lvl2 * 200 = 10min
                // 1.5 average seconds success lvl3 * 200 = 15min (epic)
                critter.levelProgress = 0

                if (critter.level < 2) {
                    critter.level++
                    // TODO music!
                    story.printDialog(`${critter.name} has evolved!`, 80, 100, 50, 150, 15, 1)
                } else {
                    // Just to be safe:
                    critter.level = 2
                    // TODO make the critter an epic something?!
                    story.printDialog(`${critter.name} has become epic!`, 80, 100, 50, 150, 15, 1)
                }
            }
        } else {
            critter.levelProgress--

            // Min
            if (critter.levelProgress < 0) {
                critter.levelProgress = 0
            }
        }
    }

    /**
     * Adjusts the happiness of critters
     * @param Array<Critter> allCritters
     */
    function adjustHappiness(allCritters: Array<Critter>) {
        // We need at least two creatures to start recovering
        const foodConstantFactor = 30
        Environment.playpen.factor = -2
        // Environment.foodOne.factor = Environment.hay[0].quantity
        // Environment.foodTwo.factor = Environment.hay[1].quantity
        // Environment.foodThree.factor = Environment.hay[2].quantity

        allCritters.forEach(critter => {
            if (critter.sprite) {
                // Check to see if the critter is in the play area
                if (Utils.isInZone(critter.sprite.x, critter.sprite.y, Environment.playpen)) {
                    Environment.playpen.factor++
                    critter.health--
                } else {
                    let isInFoodCourt = false
                    Environment.foodCourts.forEach((foodCourt) => {
                        if (Utils.isInZone(critter.sprite.x, critter.sprite.y, foodCourt)) {
                            isInFoodCourt = true
                            critter.health += Math.floor(foodCourt.factor * Math.ceil((100 - critter.health) / foodConstantFactor))
                            Environment.reduceFood(foodCourt)
                            // Environment.foodOne.factor--
                            // if (Environment.foodOne.factor < 0) {
                            //     Environment.foodOne.factor = 0
                            // }
                        }
                    })

                    if (!isInFoodCourt) {
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
        if (Environment.playpen.factor === 0) {
            Environment.playpen.factor = 1
        }

        // Now with total happiness, we can provide that to all of them
        allCritters.forEach(critter => {
            if (critter.sprite) {
                // Check to see if the critter is in the play area
                if (Utils.isInZone(critter.sprite.x, critter.sprite.y, Environment.playpen)) {
                    critter.happiness += Environment.playpen.factor
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

    export let possibleNames: Array<string> = []
    const availableNames: Array<string> = possibleNames.slice()

    // is the critter happy and healthy enough to increase level counter?
    function isWellCaredFor(critter: Critter): boolean {
        const cuttoffPerLevel = [60, 70, 80]
        const isHappyEnough = critter.happiness > cuttoffPerLevel[critter.level]
        const isHealthyEnough = critter.health > cuttoffPerLevel[critter.level]

        return isHappyEnough && isHealthyEnough
    }

    // Get a random available name
    function getName(): string {
        const index = Math.randomRange(0, possibleNames.length - 1)
        const name = possibleNames[index]
        possibleNames.splice(index, 1)
        return name
    }

    // put a name back in the pool of names
    function addName(name: string) {
        possibleNames.push(name)
    }
}