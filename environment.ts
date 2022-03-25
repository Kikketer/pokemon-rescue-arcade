namespace Environment {
    let fieldDoor: Sprite 
    let foodDoorOne: Sprite
    let foodDoorTwo: Sprite
    let foodDoorThree: Sprite

    // Wilderness is x 240 over, top to bottom
    export const wildernessX = 240
    export const mapWidth = 500
    export const mapHeight = 375

    export function init({ mainCharacter }: { mainCharacter: Sprite }) {
        scene.setBackgroundColor(6)
        tiles.setTilemap(tilemap`farm`)
        scene.cameraFollowSprite(mainCharacter)
        setupDoors()
    }

    export function slowTick() {
        // Close any doors, cuz... we lazy
        fieldDoor.setImage(assets.tile`fieldDoorClosed`)
        foodDoorOne.setImage(assets.tile`innerFenceDoor`)
        foodDoorTwo.setImage(assets.tile`innerFenceDoorHorizontal`)
        foodDoorThree.setImage(assets.tile`innerFenceDoorHorizontal`)
    }

    function setupDoors() {
        // Create the doors
        fieldDoor = sprites.create(assets.tile`fieldDoorClosed`, SpriteKind.Door)
        fieldDoor.setPosition(64 + 8, 112 + 8)
        foodDoorOne = sprites.create(assets.tile`innerFenceDoor`, SpriteKind.Door)
        foodDoorOne.setPosition(88, 216)
        foodDoorTwo = sprites.create(assets.tile`innerFenceDoorHorizontal`, SpriteKind.Door)
        foodDoorTwo.setPosition(120, 264)
        foodDoorThree = sprites.create(assets.tile`innerFenceDoorHorizontal`, SpriteKind.Door)
        foodDoorThree.setPosition(184, 264)
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