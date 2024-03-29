type CritterDatabase = {
    [T: string]: {
        // How many adoptions needed to have this critter appear
        minLevelToAppear: number
        // The overall odds of finding once minLevelToAppear is reached
        oddsOfFinding: number
    }
}

type CritterImageDatabase = {
    [T: string]: Array<Image>
}

enum Facing {
    Left,
    Right
}

interface Critter {
    name: string
    critterType: string
    sprite?: Sprite
    tickTimer?: number
    locationX: number
    locationY: number
    level: number
    happiness: number // 0-100
    health: number // 0-100
    timerCount: number
    levelProgress: number
}

type MainCharacter = {
    adoptionLevel: number
    ginny: Sprite
}

type Loc = {
    x: number
    y: number
}

type Zone = {
    topLeft: Loc,
    bottomRight: Loc
    spawnCoords?: Loc
}

type PlayPen = {
    factor: number
}

type FoodCourt = {
    factor: number,
    spriteLocation: { x: number, y: number },
    foodQuantity: number,
    sprite?: Sprite
}

type Map = {
    wildernessX: number,
    mapWidth: number,
    mapHeight: number
}

type SaveGame = {
    critters?: Array<Critter>
    foodCourts?: Array<FoodCourt>
    player?: {}
    computer?: { numberOfAdoptions: number }
}

enum PhoneResult {
    adopted,
    canceled
}