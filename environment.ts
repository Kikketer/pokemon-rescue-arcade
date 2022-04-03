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

        const laptop = sprites.create(assets.image`laptop`)
        laptop.setPosition(152, 180)
        // Utils.setPosition(laptop, 9, 10.5)

        scene.setBackgroundColor(6)
        tiles.setTilemap(tilemap`farm`)
        scene.cameraFollowSprite(mainCharacter)
        setupDoors()
        setupHay()
        setupSigns()
    }

    export function fastTick() {
        // Close any doors, cuz... we lazy
        fieldDoor.setImage(assets.image`fieldDoorClosed`)
        fieldDoor.data.isOpen = false
        
        foodDoorOne.setImage(foodDoorOne.data.closedImage)
        foodDoorOne.data.isOpen = false

        foodDoorTwo.setImage(assets.image`innerFenceDoorHorizontal`)
        foodDoorTwo.data.isOpen = false

        foodDoorThree.setImage(assets.image`innerFenceDoorHorizontal`)
        foodDoorThree.data.isOpen = false
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
        fieldDoor = sprites.create(assets.image`fieldDoorClosed`, SpriteKind.Door)
        Utils.setPosition(fieldDoor, 4.5, 7)
        fieldDoor.data.isOpen = false
        fieldDoor.data.closedImage = assets.image`fieldDoorClosed`
        fieldDoor.data.openImage = assets.image`fieldDoorOpen`
        
        foodDoorOne = sprites.create(assets.image`innerFenceDoor`, SpriteKind.Door)
        Utils.setPosition(foodDoorOne, 5, 12.5)
        foodDoorOne.data.isOpen = false
        foodDoorOne.data.closedImage = assets.image`innerFenceDoor`
        foodDoorOne.data.openImage = assets.image`innerFenceDoorOpen`
        
        foodDoorTwo = sprites.create(assets.image`innerFenceDoorHorizontal`, SpriteKind.Door)
        Utils.setPosition(foodDoorTwo, 7.5, 16)
        foodDoorTwo.data.isOpen = false
        foodDoorTwo.data.closedImage = assets.image`innerFenceDoorHorizontal`
        foodDoorTwo.data.openImage = assets.image`innerFenceDoorHorizontalOpen`

        foodDoorThree = sprites.create(assets.image`innerFenceDoorHorizontal`, SpriteKind.Door)
        Utils.setPosition(foodDoorThree, 11.5, 16)
        foodDoorThree.data.isOpen = false
        foodDoorThree.data.closedImage = assets.image`innerFenceDoorHorizontal`
        foodDoorThree.data.openImage = assets.image`innerFenceDoorHorizontalOpen`

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Door, (player, door) => {
            console.log('Hit door')
            door.data.isOpen = true
            if (door.data.openImage) {
                door.setImage(door.data.openImage)
            }
        })

        sprites.onOverlap(SpriteKind.Critter, SpriteKind.Door, (critter, door) => {
            // TODO Figure out real 'sprite to sprite' collisions
            if (!door.data.isOpen) {
                critter.setVelocity(0, 0)
            }
        })
    }
}