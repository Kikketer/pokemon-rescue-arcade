namespace Environment {
    let fieldDoor: Sprite 
    let foodDoorOne: Sprite
    let foodDoorTwo: Sprite
    let foodDoorThree: Sprite
    export let map: Map
    export let signs: Array<Sprite> = []

    const hayLevels: Array<Image> = [
        assets.tile`Haybale3`,
        assets.tile`Haybale2`,
        assets.tile`Haybale1`
    ]

    export let hay: Array<Hay> = [
        {
            sprite: sprites.create(hayLevels[2]),
            quantity: 2
        },
        {
            sprite: sprites.create(hayLevels[2]),
            quantity: 2
        },
        {
            sprite: sprites.create(hayLevels[2]),
            quantity: 2
        }
    ]

    export function init({ mainCharacter }: { mainCharacter: Sprite }) {
        map = {
            wildernessX: 240,
            mapWidth: 500,
            mapHeight: 375
        }

        scene.setBackgroundColor(6)
        tiles.setTilemap(tilemap`farm`)
        scene.cameraFollowSprite(mainCharacter)
        setupDoors()
        setupHay()
        setupSigns()
    }

    export function slowTick() {
        // Close any doors, cuz... we lazy
        fieldDoor.setImage(assets.tile`fieldDoorClosed`)
        foodDoorOne.setImage(assets.tile`innerFenceDoor`)
        foodDoorTwo.setImage(assets.tile`innerFenceDoorHorizontal`)
        foodDoorThree.setImage(assets.tile`innerFenceDoorHorizontal`)
    }

    function setupSigns() {
        signs[0] = sprites.create(assets.image`signEmpty`, SpriteKind.Sign)
        signs[1] = sprites.create(assets.image`signEmpty`, SpriteKind.Sign)
        Utils.setPosition(signs[0], 0, 20)
        Utils.setPosition(signs[1], 11, 13)
    }

    function setupHay() {
        Utils.setPosition(hay[0].sprite, 3, 14)
        Utils.setPosition(hay[1].sprite, 4, 18)
        Utils.setPosition(hay[2].sprite, 10, 19)
    }

    function setupDoors() {
        // Create the doors
        fieldDoor = sprites.create(assets.tile`fieldDoorClosed`, SpriteKind.Door)
        Utils.setPosition(fieldDoor, 4, 7)
        //fieldDoor.setPosition(64 + 8, 112 + 8)
        foodDoorOne = sprites.create(assets.tile`innerFenceDoor`, SpriteKind.Door)
        // foodDoorOne.setPosition(88, 216)
        Utils.setPosition(foodDoorOne, 5, 13)
        foodDoorTwo = sprites.create(assets.tile`innerFenceDoorHorizontal`, SpriteKind.Door)
        Utils.setPosition(foodDoorTwo, 7, 16)
        foodDoorThree = sprites.create(assets.tile`innerFenceDoorHorizontal`, SpriteKind.Door)
        Utils.setPosition(foodDoorThree, 11, 16)

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Door, (player, door) => {
            if (door.image === assets.tile`fieldDoorClosed`) {
                door.setImage(assets.tile`fieldDoorOpen`)
            } else if (door.image === assets.tile`innerFenceDoor`) {
                door.setImage(assets.tile`innerFenceDoorOpen`)
            } else if (door.image === assets.tile`innerFenceDoorHorizontal`) {
                door.setImage(assets.tile`innerFenceDoorHorizontalOpen`)
            }

        })
        sprites.onOverlap(SpriteKind.Critter, SpriteKind.Door, (critter, door) => {
            // TODO Figure out real 'sprite to sprite' collisions
            if (door.image === assets.tile`fieldDoorClosed` ||
                door.image === assets.tile`innerFenceDoor` ||
                door.image === assets.tile`innerFenceDoorHorizontal`) {
                critter.setVelocity(0, 0)
            }
        })
    }
}