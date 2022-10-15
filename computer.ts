// The compouter to display status and such
namespace Computer {
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

    export function onInteract() {
        // Draw a white screen with interactions!
        // blockSettings.writeString('savegame', JSON.stringify({
        //     critters: Critters.getSaveJson(),
        //     player: Player.getSaveJson()
        // }))
        story.startCutscene(() => {
            story.printDialog('Your creatures have been recorded', 80, 100, 50, 150, 15, 1)
            story.printDialog(`Number of adoptions: ${numberOfAdoptions}`, 80, 100, 50, 150, 15, 1)
        })
    }

    export function increaseAdoptions() {
        numberOfAdoptions++
    }

    export function getNumberOfAdoptions(): number {
        return numberOfAdoptions
    }

    /**
     * Private functions and data
     */
    let numberOfAdoptions = 0
    let critters: Critter[]
    let player: Sprite
    let map: Map

    // Private since the computer actually initiates the save
    // Using this function name for consistency
    function getSaveJson() {
        return {
            numberOfAdoptions
        }
    }
}
