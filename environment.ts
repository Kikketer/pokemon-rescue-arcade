namespace Environment {
    let fieldDoor: Sprite 
    let foodDoorOne: Sprite
    let foodDoorTwo: Sprite
    let foodDoorThree: Sprite
    let phone: Sprite
    let laptop: Sprite
    let phoneRingTimer: number
    const MAX_FOOD_QUANTITY = 20
    export let map: Map
    export let signs: Array<Sprite> = []
    export let isPhoneRinging: boolean = false
    // Zones where when A pressed, will trigger an event [x,y,x,y]
    export const phoneZone: Zone = { topLeft: { x:7, y:11 }, bottomRight: { x: 8, y: 12 } }
    export const computerZone: Zone = { topLeft: { x: 9, y: 11 }, bottomRight: { x: 10, y: 12 } }
    export const feedZone: Zone = { topLeft: { x: 12, y: 11 }, bottomRight: { x: 15, y: 14 }, spawnCoords: { x: 208, y: 208 } }
    export const playpen: Zone & PlayPen = { factor: -1, topLeft: { x: 3, y: 2 }, bottomRight: { x: 13, y: 6 } }
    export let foodCourts: Array<Zone & FoodCourt> = [
        { factor: 2, topLeft: { x: 2, y: 11 }, bottomRight: { x: 4, y: 15 }, foodQuantity: MAX_FOOD_QUANTITY, spriteLocation: { x: 3, y: 14 } },
        { factor: 2, topLeft: { x: 2, y: 7 }, bottomRight: { x: 8, y: 19 }, foodQuantity: MAX_FOOD_QUANTITY, spriteLocation: { x: 4, y: 18 } },
        { factor: 2, topLeft: { x: 10, y: 17 }, bottomRight: { x: 13, y: 19 }, foodQuantity: MAX_FOOD_QUANTITY, spriteLocation: { x: 10, y: 19 } }
    ]

    const hayLevels: Array<Image> = [
        assets.tile`Haybale3`,
        assets.tile`Haybale2`,
        assets.tile`Haybale1`
    ]

    export function init({ mainCharacter }: { mainCharacter: Sprite, savedGame?: SaveGame }) {
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
        setupFoodCourts(savedGame)
        setupSigns()
    }

    export const getSaveJson = () => {
        return { 
            foodCourts: foodCourts.map((foodCourt) => {
                return { foodQuantity: foodCourt.foodQuantity }
            })
        }
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
            music.playMelody('B4 G4 D5 G4 D5 E5 D5 G4 E5 D5 G4', 352)
            music.playMelody('D5', 176)
            music.playMelody('-', 352)
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

    function setupFoodCourts(saveGame?: SaveGame) {
        foodCourts.forEach((foodCourt: FoodCourt, index) => {
            if (saveGame && saveGame.foodCourts) {
                foodCourts[index].foodQuantity = saveGame.foodCourts[index].foodQuantity
            }
            foodCourts[index].sprite = sprites.create(getFoodImagePerQty(foodCourts[index].foodQuantity))
            Utils.setPosition(foodCourts[index].sprite, foodCourt.spriteLocation.x, foodCourt.spriteLocation.y)
        })
    }

    export const reduceFood = (foodCourt: FoodCourt) => {

    }

    const getFoodImagePerQty = (quantity: number) => {
        let level = Math.floor(quantity / (MAX_FOOD_QUANTITY / 3))
        if (level > 2) level = 2
        if (level < 0) level = 0
        return hayLevels[level]
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