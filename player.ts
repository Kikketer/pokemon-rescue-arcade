namespace Player {
    export let ginny: Sprite = null
    export let numberOfAdoptions = 0
    
    let critterBeingCarried: Critter | null = null
    const movement = { up: false, down: false, right: false, left: false }
    let previousMovement = { up: false, down: false, right: false, left: false }
    
    export function init({ saveGame }: { saveGame?: SaveGame }) {
        if (saveGame && saveGame.player) {
            numberOfAdoptions = saveGame.player.numberOfAdoptions
        }

        ginny = sprites.create(assets.image`ginny`, SpriteKind.Player)
        // Move Ginny
        controller.moveSprite(ginny, 60, 60)
        // Controller events
        controller.down.onEvent(ControllerButtonEvent.Released, () => {
            movement.down = false
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
            movement.down = true
        })
        controller.up.onEvent(ControllerButtonEvent.Released, () => {
            movement.up = false
        })
        controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
            movement.up = true
        })
        controller.left.onEvent(ControllerButtonEvent.Released, () => {
            movement.left = false
        })
        controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
            movement.left = true
        })
        controller.right.onEvent(ControllerButtonEvent.Released, () => {
            movement.right = false
        })
        controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
            movement.right = true
        })

        // Pickup and Drop critters with A
        controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Released, function () {
            if (critterBeingCarried) {
                critterBeingCarried.sprite.follow(null)
                critterBeingCarried.sprite.setVelocity(20, 0)
                critterBeingCarried = null
            } else {
                Critters.critters.forEach((critter: Critter) => {
                    if (critter.sprite) {
                        if (ginny.overlapsWith(critter.sprite) && !critterBeingCarried) {
                            critterBeingCarried = critter
                            critter.sprite.follow(ginny)
                            Critters.onPickup(critter)
                        }
                    }
                })

                // Do signs and other B button things
                if (!critterBeingCarried && !Events.currentlyEvent) {
                    if (Utils.isInZone(ginny.x, ginny.y, Environment.phoneZone)) {
                        Events.onPickupPhone(result => {
                            if (result === PhoneResult.adopted) {
                                numberOfAdoptions++
                            }
                        })
                    } else if (Utils.isInZone(ginny.x, ginny.y, Environment.computerZone)) {
                        blockSettings.writeString('savegame', JSON.stringify({ 
                            critters: Critters.getSaveJson(), 
                            player: Player.getSaveJson() 
                        }))
                        story.startCutscene(() => {
                            story.printDialog('Your creatures have been recorded', 80, 100, 50, 150, 15, 1)
                            story.printDialog(`Number of adoptions: ${numberOfAdoptions}`, 80, 100, 50, 150, 15, 1)
                        })
                    }
                }
            }
        })
    }

    // The blob of stuff to save
    export function getSaveJson() {
        return {
            numberOfAdoptions
        }
    }

    // This sets the animation based on the resulting moveDirection
    // Since it needs to be an "event" we keep track of the previous direction as
    // Still not perfect but better
    forever(() => {
        // If any movements have flipped to false, reset the whole previous to reeval the animation
        if ((!movement.left && previousMovement.left) ||
            (!movement.right && previousMovement.right) ||
            (!movement.up && previousMovement.up) ||
            (!movement.down && previousMovement.down)) {
            previousMovement = {
                up: false, down: false, right: false, left: false
            }
        }

        let moveAnimation: Array<Image> | undefined
        // Determine the animation based on direction (only set on change)
        if (movement.left !== previousMovement.left) {
            moveAnimation = assets.animation`walkLeft`
        } else if (movement.right !== previousMovement.right) {
            moveAnimation = assets.animation`walkRight`
        } else if (movement.up !== previousMovement.up) {
            moveAnimation = assets.animation`walkUp`
        } else if (movement.down !== previousMovement.down) {
            moveAnimation = assets.animation`walkDown`
        } 

        if (moveAnimation) {
            animation.runImageAnimation(
                ginny,
                moveAnimation,
                150,
                true
            )
        } else {
            // Check if all buttons are released
            const shouldStop = !movement.left && !movement.right && !movement.up && !movement.down
            if (shouldStop) {
                animation.stopAnimation(animation.AnimationTypes.All, ginny)
            }
        }

        // Make a copy (not by reference)
        previousMovement = {
            left: movement.left,
            right: movement.right,
            up: movement.up,
            down: movement.down
        }
    })
}
