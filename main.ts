namespace SpriteKind {
    export const Critter = SpriteKind.create()
}
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
    if (ginny.isHittingTile(CollisionDirection.Top)) {
        console.log("Hit tile top?")
    }
})
// Drop critters with B
controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Released, function () {
    if (critterBeingCarried) {
        critterBeingCarried.sprite.follow(null)
        critterBeingCarried.sprite.setVelocity(20, 0)
        critterBeingCarried = null
console.log("Drop the critter")
    } else {
        critters.forEach(critter => {
            if (ginny.overlapsWith(critter.sprite) && !critterBeingCarried) {
                console.log('Pick up the critter!')
                critterBeingCarried = critter
                critter.sprite.follow(ginny)
            }
        })
    }
})
type Critter = {
    name: string
    sprite: Sprite
    happiness: number
    health: number
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
let thePause = 0
let happinessFactor = 0
let critterBeingCarried: Critter | null = null
let ginny: Sprite = null
const playpen: Zone = { factor: -1, topLeft: { x: 3, y: 2 }, bottomRight: { x:13, y:6 } }
const foodOne: Zone = { factor: 2, topLeft: { x: 2, y: 11 }, bottomRight: { x: 4, y: 15 } }

scene.setBackgroundColor(6)
tiles.setTilemap(tilemap`farm`)
ginny = sprites.create(assets.image`ginny`, SpriteKind.Player)
controller.moveSprite(ginny, 60, 60)
scene.cameraFollowSprite(ginny)
let foodFactorLeft = 3
let foodFactorMiddle = 3
let foodFactorRight = 3
let happinessDegradeFactor = 1
let healthDegradeFactor = 1
let critters = [{
        name: 'CritterOne',
        sprite: sprites.create(assets.image`critterOne`, SpriteKind.Critter),
        happiness: 90,
        health: 70
    }]
// Place all the critters on load (temp)
for (let critter of critters) {
    critter.sprite.setPosition(15, 15)
}
// Loop over each critter and degrade health/happiness
forever(function () {
    thePause = Math.randomRange(100, 5000)
    pause(thePause)
    adjustHappiness(critters)
    for (let theCritter of critters) {
        moveCritter(theCritter)

        // Display the emoji if they are not healthy/happy
        if (theCritter.health < 30) {
            theCritter.sprite.sayText(":o", 2000)
        } else if (theCritter.happiness < 30) {
            theCritter.sprite.sayText(":(", 2000)
        }
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
        } else {
            // Degrade happiness
            critter.happiness -= happinessDegradeFactor
        }   
    })
    console.log(`Pen: ${playpen.factor}, Food: ${foodOne.factor}`)
    console.log(`Health: ${allCritters[0].health}, Hap: ${allCritters[0].happiness}`)
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
