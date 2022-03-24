function checkAndPromptNewArrival() {
    if (Math.percentChance(newCreatureOdds)) {
        // Create a new creature in the wilderness
        newCreatureOdds = 4
        game.showLongText('Spawned Critter!', DialogLayout.Bottom)
    } else {
        // Odds improve over time
        newCreatureOdds += 1
    }
}
