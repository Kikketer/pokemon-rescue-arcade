namespace SpriteKind {
    export const Critter = SpriteKind.create()
    export const Door = SpriteKind.create()
}
type Critter = {
    name: string
    sprite: Sprite
    happiness: number
    health: number
    tickTimer?: number
}
type Loc = {
    x: number
    y: number
}
type Zone = {
    factor?: number
    topLeft: Loc,
    bottomRight: Loc
}
let randDirectionY = 0
let randDirectionX = 0
let happinessFactor = 0
let newCreatureOdds = 4
// Wilderness is x 240 over, top to bottom
const wildernessX = 240
let critterBeingCarried: Critter | null = null
let ginny: Sprite = null
const playpen: Zone = { factor: -1, topLeft: { x: 3, y: 2 }, bottomRight: { x:13, y:6 } }
const foodOne: Zone = { factor: 2, topLeft: { x: 2, y: 11 }, bottomRight: { x: 4, y: 15 } }
const foodTwo: Zone = { factor: 2, topLeft: { x: 2, y: 7 }, bottomRight: { x: 8, y: 19 } }
const foodThree: Zone = { factor: 2, topLeft: { x: 10, y: 17 }, bottomRight: { x: 13, y: 19 } }
let happinessDegradeFactor = 1
let healthDegradeFactor = 1
let critters = [{
    name: 'CritterOne',
    sprite: sprites.create(assets.image`critterOne`, SpriteKind.Critter),
    happiness: 90,
    health: 70
},
{
    name: 'CritterTwo',
    sprite: sprites.create(assets.image`critterOne`, SpriteKind.Critter),
    happiness: 90,
    health: 70
}]

scene.setBackgroundColor(6)
tiles.setTilemap(tilemap`farm`)
ginny = sprites.create(assets.image`ginny`, SpriteKind.Player)
controller.moveSprite(ginny, 60, 60)
scene.cameraFollowSprite(ginny)

// Adjust health, happiness and move
function critterOnTick(critter: Critter) {
    moveCritter(critter)
    // Display the emoji if they are not healthy/happy
    if (critter.health < 30) {
        critter.sprite.sayText(":O", 2000)
    } else if (critter.happiness < 30) {
        critter.sprite.sayText(":(", 2000)
    }

    clearTimeout(critter.tickTimer)
    critter.tickTimer = setTimeout(() => critterOnTick(critter), Math.randomRange(100,3000))
}

// Start critter move/tick timers
critters.forEach((critter: Critter) => {
    critter.sprite.setPosition(Math.randomRange(256, 500), Math.randomRange(8, 375))
    critter.tickTimer = setTimeout(() => critterOnTick(critter), 3000)
})

// Create the doors
const fieldDoor = sprites.create(assets.tile`fieldDoorClosed`, SpriteKind.Door)
fieldDoor.setPosition(64 + 8,112 + 8)
const foodDoorOne = sprites.create(assets.tile`innerFenceDoor`, SpriteKind.Door)
foodDoorOne.setPosition(88, 216)
const foodDoorTwo = sprites.create(assets.tile`innerFenceDoorHorizontal`, SpriteKind.Door)
foodDoorTwo.setPosition(120, 264)
const foodDoorThree = sprites.create(assets.tile`innerFenceDoorHorizontal`, SpriteKind.Door)
foodDoorThree.setPosition(184, 264)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Door, (player, door) => {
    if (door.image === assets.tile`fieldDoorClosed`) {
        door.setImage(assets.tile`fieldDoorOpen`)
    } else if (door.image === assets.tile`innerFenceDoor`) {
        door.setImage(assets.tile`innerFenceDoorOpen`)
    } else if (door.image === assets.tile`innerFenceDoorHorizontal`) {
        door.setImage(assets.tile`innerFenceDoorHorizontalOpen`)
    }
    
})
sprites.onOverlap(SpriteKind.Critter, SpriteKind.Door, (critter, door) => {
    // TODO Figure out real 'sprite to sprite' collisions
    if (door.image === assets.tile`fieldDoorClosed` || 
        door.image === assets.tile`innerFenceDoor` ||
        door.image === assets.tile`innerFenceDoorHorizontal`) {
        critter.setVelocity(0, 0)
    }
})

// Controller events
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    animation.stopAnimation(animation.AnimationTypes.All, ginny)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
        ginny,
        assets.animation`walkDown`,
        200,
        true
    )
})
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Released, function () {
    // Check if a creature is near, if so pick it up
    // if (ginny.isHittingTile(CollisionDirection.Top)) {
    //     console.log("Hit tile top?")
    // }
})
// Drop critters with B
controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Released, function () {
    if (critterBeingCarried) {
        critterBeingCarried.sprite.follow(null)
        critterBeingCarried.sprite.setVelocity(20, 0)
        critterBeingCarried = null
    } else {
        critters.forEach(critter => {
            if (ginny.overlapsWith(critter.sprite) && !critterBeingCarried) {
                critterBeingCarried = critter
                critter.sprite.follow(ginny)
                critter.sprite.say(`H:${critter.health},F:${critter.happiness}`,2000)
            }
        })
    }
})

// Loop over each critter and degrade health/happiness
forever(function () {
    // Close any doors, cuz... we lazy
    fieldDoor.setImage(assets.tile`fieldDoorClosed`)
    foodDoorOne.setImage(assets.tile`innerFenceDoor`)
    foodDoorTwo.setImage(assets.tile`innerFenceDoorHorizontal`)
    foodDoorThree.setImage(assets.tile`innerFenceDoorHorizontal`)
    // Adjust happiness of critters every 3 seconds
    pause(3000)
    adjustHappiness(critters)
})

forever(function() {
    // 15 second ticks
    pause(15000)
    if (Math.percentChance(newCreatureOdds)) {
        // Create a new creature in the wilderness
        newCreatureOdds = 4
        game.showLongText('Spawned Critter!', DialogLayout.Bottom)
    } else {
        // Odds improve over time
        newCreatureOdds += 1
    }
})

function moveCritter(critter: Critter) {
    if (critter.sprite.vx == 0 && critter.sprite.vy == 0) {
        // Move the critter
        randDirectionX = Math.randomRange(-20, 20)
        randDirectionY = Math.randomRange(-20, 20)
        critter.sprite.setVelocity(randDirectionX, randDirectionY)
    } else {
        // Stop any movement
        critter.sprite.setVelocity(0, 0)
    }
}

/**
 * Adjusts the happiness of critters
 * @param Array<Critter> allCritters
 */
function adjustHappiness(allCritters: Array<Critter>) {
    // We need at least two creatures to start recovering
    playpen.factor = -2
    foodOne.factor = 1

    allCritters.forEach(critter => {
        const tileX = Math.floor(critter.sprite.x / 16)
        const tileY = Math.floor(critter.sprite.y / 16)
        // Check to see if the critter is in the play area
        if (isInZone(tileX, tileY, playpen)) {
            playpen.factor++
            critter.health--
        } else {
            if (isInZone(tileX, tileY, foodOne)) {
                // Feed the critter now (the first to eat gets it!)
                critter.health += foodOne.factor                
                foodOne.factor--
                if (foodOne.factor < 0) {
                    foodOne.factor = 0
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
    })

    // If there are two critters in the pen they start to get happy
    if (playpen.factor === 0) {
        playpen.factor = 1
    }

    // Now with total happiness, we can provide that to all of them
    allCritters.forEach(critter => {
        const tileX = Math.floor(critter.sprite.x / 16)
        const tileY = Math.floor(critter.sprite.y / 16)
        // Check to see if the critter is in the play area
        if (isInZone(tileX, tileY, playpen)) {
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
    })
}

function isInZone(currentX: number, currentY: number, zone: Zone) {
    let isInZone = false
    if (currentX >= zone.topLeft.x &&
        currentY >= zone.topLeft.y &&
        currentX <= zone.bottomRight.x &&
        currentY <= zone.bottomRight.y) {
            isInZone = true
        }
    return isInZone
}
