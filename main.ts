namespace SpriteKind {
    export const Critter = SpriteKind.create()
    export const Door = SpriteKind.create()
    export const Sign = SpriteKind.create()
    export const CarriedFood = SpriteKind.create()
}

let randDirectionY = 0
let randDirectionX = 0
let happinessFactor = 0
let happinessDegradeFactor = 1
let healthDegradeFactor = 1

// Computer handles all the overall state (like number of adopted critters)
const savedGame = Computer.getSavedGame()

Player.init({
    savedGame
})
Environment.init({
    mainCharacter: Player.ginny,
    savedGame
})
Critters.init({
    map: Environment.map,
    savedGame
})
Events.init({
    map: Environment.map,
    critters: Critters.critters
})
Computer.init({
    map: Environment.map,
    player: Player.ginny,
    critters: Critters.critters,
    savedGame
})

// Loop over each critter and degrade health/happiness
forever(function () {
    pause(3000)
    Environment.fastTick()
    Critters.fastTick()
})

forever(function() {
    // 15 second ticks
    pause(15000)
    Critters.slowTick()
    Events.slowTick()
})
