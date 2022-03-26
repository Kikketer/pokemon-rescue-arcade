type CritterDatabase = {
    [T: string]: {
        oddsOfFinding: number
    }
}

type CritterImageDatabase = {
    [T: string]: Array<Image>
}

interface Critter {
    sprite?: Sprite
    tickTimer?: number
    locationX: number
    locationY: number
    level: number
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

type Map = {
    wildernessX: number,
    mapWidth: number,
    mapHeight: number
}