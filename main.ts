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
let randDirectionY = 0
let randDirectionX = 0
let thePause = 0
let happinessFactor = 0
let critterBeingCarried: Critter | null = null
let ginny: Sprite = null
type Critter = {
    name: string
    sprite: Sprite
    happiness: number
    health: number
}
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

        // Check to see if we are playing and with who
        
        // Actually degrade health and happiness
        theCritter.health -= healthDegradeFactor
        theCritter.happiness -= happinessDegradeFactor

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
    let totalHappiness = 0
    allCritters.forEach(critter => {
        const tileX = Math.floor(critter.sprite.x / 16)
        const tileY = Math.floor(critter.sprite.y / 16)
        // Check to see if the critter is in the play area
        if (tileX >= 3 && tileY >= 2 && tileX <= 13 && tileY <= 6) {
            totalHappiness++
        }
    })

    // Now with total happiness, we can provide that to all of them
    allCritters.forEach(critter => {
        const tileX = Math.floor(critter.sprite.x / 16)
        const tileY = Math.floor(critter.sprite.y / 16)
        // Check to see if the critter is in the play area
        if (tileX >= 3 && tileY >= 2 && tileX <= 13 && tileY <= 6) {
            critter.happiness += totalHappiness
        }
    })
    console.log(`Total happiness: ${totalHappiness}`)
}
