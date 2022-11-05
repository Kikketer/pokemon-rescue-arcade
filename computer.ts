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
    let isPaused = false
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
        saveIcon = sprites.create(assets.image`saveIcon`)
        closeIcon = sprites.create(assets.image`closeIcon`)
        cursor = sprites.create(assets.image`cursor`)
        // Looking at hotspot locations specifically for this (cuz I'm lazy)
        closeIcon.setPosition(hotSpots[0].location.left + menuLocation.left, hotSpots[0].location.top + menuLocation.top)
        saveIcon.setPosition(hotSpots[1].location.left + menuLocation.left, hotSpots[1].location.top + menuLocation.top)
        // music.playMelody("B - - A F - - - ", 360)
        // music.playMelody("D B G G - - - - ", 180)
        listBox.setPosition(menuLocation.left + screenCenter.left, menuLocation.top + listBoxTopOffset + listBox.height / 2)

        cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5 + menuLocation.left, 
            hotSpots[currentHotSpotIndex].location.top + 5 + menuLocation.top)
        renderList()
        startController()
    }

    export const startController = () => {
        isPaused = false
        // Cursor
        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            if (isPaused) return
            currentHotSpotIndex--
            if (currentHotSpotIndex < 0) {
                currentHotSpotIndex = hotSpots.length - 1
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5 + menuLocation.left, 
                hotSpots[currentHotSpotIndex].location.top + 5 + menuLocation.top)
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            if (isPaused) return
            currentHotSpotIndex++
            if (currentHotSpotIndex > hotSpots.length - 1) {
                currentHotSpotIndex = 0
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5 + menuLocation.left,
                hotSpots[currentHotSpotIndex].location.top + 5 + menuLocation.top)
        })
        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            if (isPaused) return
            currentHotSpotIndex--
            if (currentHotSpotIndex < 0) {
                currentHotSpotIndex = hotSpots.length - 1
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5 + menuLocation.left,
                hotSpots[currentHotSpotIndex].location.top + 5 + menuLocation.top)
        })
        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            if (isPaused) return
            currentHotSpotIndex++
            if (currentHotSpotIndex > hotSpots.length - 1) {
                currentHotSpotIndex = 0
            }
            cursor.setPosition(hotSpots[currentHotSpotIndex].location.left + 5 + menuLocation.left, 
                hotSpots[currentHotSpotIndex].location.top + 5 + menuLocation.top)
        })
        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            if (isPaused) return
            hotSpots[currentHotSpotIndex].action()
        })
    }

    export const stopController = () => {
        isPaused = true
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
        const savedSprite = textsprite.create('Saved!', 0, 15);
        savedSprite.setPosition(saveIcon.left + 36, saveIcon.top + 8)
        setTimeout(() => {
            savedSprite.destroy()
        }, 2000)
        blockSettings.writeString('savegame', JSON.stringify({
            computer: Computer.getSavedGame(),
            critters: Critters.getSaveJson(),
            player: Player.getSaveJson()
        }))
        // animation.runImageAnimation(
        //     saveIcon,
        //     assets.animation`saveAnimation`,
        //     100,
        //     false
        // )
    }

    const onWipe = () => {
        // TODO wipe the save game, with confirmation prompt
        // blockSettings.clear()
    }

    const onClose = () => {
        clearList()
        cursor.destroy()
        saveIcon.destroy()
        closeIcon.destroy()
        listBox.destroy()
        window.destroy()
        stopController()
        onCloseCallback()
    }

    const hotSpots = [
        {
            location: { top: 17, left: 19 },
            action: onClose,
        },
        {
            location: { top: 17, left: 42 },
            action: onSave,
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
            const critterSprite = sprites.create(Critters.typeToImage[critter.critterType][critter.level * 2])
            critterSprite.setPosition(menuLocation.left + 23, rowMidPoint)
            const nameSprite = textsprite.create(critter.name.slice(0, 9), 0, 16)
            nameSprite.setPosition(menuLocation.left + nameSprite.width / 2 + 33, rowMidPoint)

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
