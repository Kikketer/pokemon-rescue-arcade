namespace SpriteKind {
    export const Critter = SpriteKind.create()
    export const Door = SpriteKind.create()
}

let randDirectionY = 0
let randDirectionX = 0
let happinessFactor = 0
let happinessDegradeFactor = 1
let healthDegradeFactor = 1

let critterBeingCarried: Critter | null = null
let ginny: Sprite = null

// TODO Move this into the Environment and have "food" array
const playpen: Zone = { factor: -1, topLeft: { x: 3, y: 2 }, bottomRight: { x:13, y:6 } }
const foodOne: Zone = { factor: 2, topLeft: { x: 2, y: 11 }, bottomRight: { x: 4, y: 15 } }
const foodTwo: Zone = { factor: 2, topLeft: { x: 2, y: 7 }, bottomRight: { x: 8, y: 19 } }
const foodThree: Zone = { factor: 2, topLeft: { x: 10, y: 17 }, bottomRight: { x: 13, y: 19 } }

ginny = sprites.create(assets.image`ginny`, SpriteKind.Player)
controller.moveSprite(ginny, 60, 60)
Environment.init({
    mainCharacter: ginny
})
Critters.init({
    map: {
        wildernessX: Environment.wildernessX, 
        mapWidth: Environment.mapWidth, 
        mapHeight: Environment.mapHeight
    }
})
Events.init({
    map: {
        wildernessX: Environment.wildernessX,
        mapWidth: Environment.mapWidth,
        mapHeight: Environment.mapHeight
    },
    critters: Critters.critters
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
        Critters.critters.forEach((critter: Critter) => {
            if (critter.sprite) {
                if (ginny.overlapsWith(critter.sprite) && !critterBeingCarried) {
                    critterBeingCarried = critter
                    critter.sprite.follow(ginny)
                    critter.sprite.say(`H:${critter.health},F:${critter.happiness}`,2000)
                }
            }
        })
    }
})

// Loop over each critter and degrade health/happiness
forever(function () {
    pause(3000)
    Environment.slowTick()
    Critters.slowTick()
})

forever(function() {
    // 15 second ticks
    pause(15000)
    Events.slowTick()
})
