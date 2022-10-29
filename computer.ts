// The compouter to display status and such
namespace Computer {
    let cursor: Sprite = null
    let closeIcon: Sprite = null
    let saveIcon: Sprite = null
    let listBox: Sprite = null
    let window: Sprite = null
    let listSprites: Sprite[] = []
    let critters: Array<Critter> = []
    let currentTopCritterList = 0
    let currentHotSpotIndex = 0
    let numberOfAdoptions = 0
    let player: Sprite
    let map: Map
    let menuLocation = { top: 0, left: 0 }
    let onCloseCallback = () => {}
    const screenCenter = { top: 60, left: 80 }
    const listBoxTopOffset = 35
    const iconsPerHappy = [assets.image`happy0`, assets.image`happy1`, assets.image`happy2`, assets.image`happy3`]
    const iconsPerHungry = [assets.image`hunger0`, assets.image`hunger1`, assets.image`hunger2`, assets.image`hunger3`]

    /**
     * Exported functions and data
     */
    export function init({ map: theMap, player: thePlayer, critters: theCritters, savedGame }: 
        { map: Map, player: Sprite, critters: Critter[], savedGame?: SaveGame }) {
        // Keep a local reference to these so we can save them
        map = theMap
        player = thePlayer
        critters = theCritters

        // Load any saved game info
        if(savedGame && savedGame.computer) {
            numberOfAdoptions = savedGame.computer.numberOfAdoptions
        }
    }

    export function getSavedGame(): SaveGame | undefined {
        // Get the saved game and return it for others to use
        const saveGameString = blockSettings.readString('savegame')
        let savedGame
        if (saveGameString) {
            try {
                savedGame = JSON.parse(saveGameString)
            } catch (err) {
                // Nom nom nom
                console.log('Unable to load savegame')
            }
        }

        return savedGame
    }

    /** Exported functions */
    export const startup = ({ top, left, onClose: whenClose }: { top: number, left: number, onClose: () => void }) => {
        // find the top left of the screen
        menuLocation = { top: top - 60, left: left - 80 }
        onCloseCallback = whenClose

        currentTopCritterList = 0
        currentHotSpotIndex = 0
        window = sprites.create(assets.image`uiBackground`)
        window.setPosition(menuLocation.left + screenCenter.left, menuLocation.top + screenCenter.top)
        listBox = sprites.create(assets.image`listBox`)
        saveIcon = sprites.create(assets.image`saveIcon`, SpriteKind.Button)
        closeIcon = sprites.create(assets.image`closeIcon`, SpriteKind.Button)
        cursor = sprites.create(assets.image`cursor`, SpriteKind.Cursor)
        // Looking at hotspot locations specifically for this (cuz I'm lazy)
        closeIcon.setPosition(hotSpots[0].location.left + menuLocation.left, hotSpots[0].location.top + menuLocation.top)
        saveIcon.setPosition(hotSpots[1].location.left + menuLocation.left, hotSpots[1].location.top + menuLocation.top)
        // music.playMelody("B - - A F - - - ", 360)
        // music.playMelody("D B G G - - - - ", 180)
        listBox.setPosition(menuLocation.left + screenCenter.left, menuLocation.top + listBoxTopOffset + listBox.height / 2)

        cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5, hotSpots[currentHotSpotIndex].location.top + 5)
        renderList()
        // initializeControls()
    }

    export const startController = () => {
        // Cursor
        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            currentHotSpotIndex--
            if (currentHotSpotIndex < 0) {
                currentHotSpotIndex = hotSpots.length - 1
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5, hotSpots[currentHotSpotIndex].location.top + 5)
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            currentHotSpotIndex++
            if (currentHotSpotIndex > hotSpots.length - 1) {
                currentHotSpotIndex = 0
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5, hotSpots[currentHotSpotIndex].location.top + 5)
        })
        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            currentHotSpotIndex--
            if (currentHotSpotIndex < 0) {
                currentHotSpotIndex = hotSpots.length - 1
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5, hotSpots[currentHotSpotIndex].location.top + 5)
        })
        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            currentHotSpotIndex++
            if (currentHotSpotIndex > hotSpots.length - 1) {
                currentHotSpotIndex = 0
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5, hotSpots[currentHotSpotIndex].location.top + 5)
        })
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            hotSpots[currentHotSpotIndex].action()
        })
    }

    export const endController = () => {
        // Cursor
        controller.up.onEvent(ControllerButtonEvent.Pressed, () => {})
        controller.down.onEvent(ControllerButtonEvent.Pressed, () => {})
        controller.left.onEvent(ControllerButtonEvent.Pressed, () => {})
        controller.right.onEvent(ControllerButtonEvent.Pressed, () => {})
        controller.A.onEvent(ControllerButtonEvent.Pressed, () => {})
    }

    export const increaseAdoptions = () => {
        numberOfAdoptions++
    }

    export const getNumberOfAdoptions = (): number => {
        return numberOfAdoptions
    }

    /**
     * Private functions and data
     */

    // Private since the computer actually initiates the save
    // Using this function name for consistency
    function getSaveJson() {
        return {
            numberOfAdoptions
        }
    }

    /** Internal private functions */
    const clearList = () => {
        // All sprites in the list are held in the "listSprites"
        listSprites.forEach(listSprite => {
            listSprite.destroy()
        })
    }

    const onSave = () => {
        console.log('Saved!')
        // animation.runImageAnimation(
        //     saveIcon,
        //     assets.animation`saveAnimation`,
        //     100,
        //     false
        // )
    }

    const onClose = () => {
        clearList()
        cursor.destroy()
        saveIcon.destroy()
        closeIcon.destroy()
        listBox.destroy()
        window.destroy()
        endController()
        onCloseCallback()
    }

    const hotSpots = [
        {
            location: { top: 17, left: 19 },
            action: onClose,
            name: 'close'
        },
        {
            location: { top: 17, left: 42 },
            action: onSave,
            name: 'save'
        },
        {
            location: { top: 50, left: 143 },
            action: () => {
                currentTopCritterList -= 4
                if (currentTopCritterList < 0) currentTopCritterList = 0
                renderList(currentTopCritterList)
            }
        },
        {
            location: { top: 88, left: 143 },
            action: () => {
                currentTopCritterList += 4
                console.log(`${currentTopCritterList} . ${critters.length}`)
                if (currentTopCritterList >= critters.length) {
                    currentTopCritterList -= 4
                }
                renderList(currentTopCritterList)
            }
        }
    ]

    const renderList = (currentIndex: number = 0) => {
        clearList()
        let rowNumber = 0

        for (let creatIndex = currentIndex; creatIndex < currentIndex + 4 && creatIndex < critters.length; creatIndex++) {
            const critter = critters[creatIndex]
            const rowMidPoint = menuLocation.top + (8 + listBoxTopOffset + 2) + (17 * rowNumber)
            const critterSprite = sprites.create(Critters.typeToImage.bulbasaur[0])
            critterSprite.setPosition(menuLocation.left + 23, rowMidPoint)
            const nameSprite = textsprite.create(critter.name.slice(0, 9), 0, 16)
            nameSprite.setPosition(menuLocation.left + nameSprite.width / 2 + 33, rowMidPoint)

            console.log(Math.round(critter.happiness / 3))
            const happySprite = sprites.create(iconsPerHappy[Math.round(critter.happiness / 10 / 3)])
            happySprite.setPosition(menuLocation.left + 110, rowMidPoint)
            const hungerSprite = sprites.create(iconsPerHungry[Math.round(critter.health / 10 / 3)])
            hungerSprite.setPosition(menuLocation.left + 125, rowMidPoint)

            // Add all sprites we've created to the list to be disposed of
            listSprites.push(critterSprite)
            listSprites.push(nameSprite)
            listSprites.push(happySprite)
            listSprites.push(hungerSprite)

            rowNumber++
        }
    }
}
