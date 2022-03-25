type CritterDatabase = {
    [T: string]: Array<CritterBase>
}

type CritterImageDatabase = {
    [T: string]: Array<Image>
}

interface CritterBase {
    spriteImage: Image
    level: number
    happiness: number
    health: number
}

interface Critter extends CritterBase {
    sprite?: Sprite
    tickTimer?: number
    locationX: number
    locationY: number
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