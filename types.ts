type CritterDatabase = {
    [T: string]: {
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
    levelName: string
    sprite?: Sprite
    tickTimer?: number
    locationX: number
    locationY: number
    previousFacing: Facing // Used to know if we should flip the sprite
    level: number
    happiness: number
    health: number
    timerCount: number
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

type Map = {
    wildernessX: number,
    mapWidth: number,
    mapHeight: number
}

type Hay = {
    sprite: Sprite,
    quantity: number
}