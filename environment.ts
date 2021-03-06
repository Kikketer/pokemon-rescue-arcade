namespace Environment {
    let fieldDoor: Sprite 
    let foodDoorOne: Sprite
    let foodDoorTwo: Sprite
    let foodDoorThree: Sprite
    let phone: Sprite
    let laptop: Sprite
    let phoneRingTimer: number
    export let map: Map
    export let signs: Array<Sprite> = []
    export let isPhoneRinging: boolean = false
    // Zones where when A pressed, will trigger an event [x,y,x,y]
    export const phoneZone: Zone = {topLeft: { x:7, y:11 }, bottomRight: { x: 8, y: 12 }}
    export const computerZone: Zone = { topLeft: { x: 9, y: 11 }, bottomRight: { x: 10, y: 12 } }

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

    export function init({ mainCharacter }: { mainCharacter: Sprite, saveGame?: SaveGame }) {
        map = {
            wildernessX: 240,
            mapWidth: 500,
            mapHeight: 375
        }

        scene.setBackgroundColor(6)
        tiles.setTilemap(tilemap`farm`)
        scene.cameraFollowSprite(mainCharacter)

        laptop = sprites.create(assets.image`laptop`)
        laptop.setPosition(152, 180)
        phone = sprites.create(assets.image`phone`)
        phone.setPosition(138, 180)

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

        // Play the ring sound for the phone
        if (isPhoneRinging) {
            music.playMelody("B G D G D E D G", 320)
            music.playMelody("E D G D -", 320)
        }
    }

    export function setPhoneRinging(shouldRing: boolean) {
        isPhoneRinging = shouldRing
        if (shouldRing) {
            clearTimeout(phoneRingTimer)
            phoneRingTimer = setTimeout(() => {
                isPhoneRinging = false
                animation.stopAnimation(animation.AnimationTypes.ImageAnimation, phone)
                phone.setImage(assets.image`phone`)
            }, 15000)

            animation.runImageAnimation(phone, assets.animation`phoneRing`, 200, true)
        } else {
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation, phone)
        }
    }

    function setupSigns() {
        // signs[0] = sprites.create(assets.image`signEmpty`, SpriteKind.Sign)
        // signs[1] = sprites.create(assets.image`signEmpty`, SpriteKind.Sign)
        // Utils.setPosition(signs[0], 0, 20)
        // Utils.setPosition(signs[1], 11, 13)
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