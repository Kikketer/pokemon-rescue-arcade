type Critter = {
    name: string
    sprite?: Sprite
    spriteName: string
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