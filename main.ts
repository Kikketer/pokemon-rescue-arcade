namespace SpriteKind {
    export const Critter = SpriteKind.create()
    export const Door = SpriteKind.create()
    export const Sign = SpriteKind.create()
}

let randDirectionY = 0
let randDirectionX = 0
let happinessFactor = 0
let happinessDegradeFactor = 1
let healthDegradeFactor = 1

// TODO Move this into the Environment and have "food" array
const playpen: Zone = { factor: -1, topLeft: { x: 3, y: 2 }, bottomRight: { x:13, y:6 } }
const foodOne: Zone = { factor: 2, topLeft: { x: 2, y: 11 }, bottomRight: { x: 4, y: 15 } }
const foodTwo: Zone = { factor: 2, topLeft: { x: 2, y: 7 }, bottomRight: { x: 8, y: 19 } }
const foodThree: Zone = { factor: 2, topLeft: { x: 10, y: 17 }, bottomRight: { x: 13, y: 19 } }

const saveGameString = blockSettings.readString('savegame')
let saveGame
console.log(saveGameString)
if (saveGameString) {
    try {
        saveGame = JSON.parse(saveGameString)
    } catch(err) {
        // Nom nom nom
        console.log('Unable to load savegame')
    }
}

Player.init({
    saveGame
})
Environment.init({
    mainCharacter: Player.ginny,
    saveGame
})
Critters.init({
    map: Environment.map,
    saveGame
})
Events.init({
    map: Environment.map,
    critters: Critters.critters
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
