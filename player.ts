namespace Player {
    let critterBeingCarried: Critter | null = null
    export let ginny: Sprite = null
    const movement = { up: false, down: false, right: false, left: false }
    let previousMovement = { up: false, down: false, right: false, left: false }
    
    export function init() {
        ginny = sprites.create(assets.image`ginny`, SpriteKind.Player)
        // Move Ginny
        controller.moveSprite(ginny, 60, 60)
        // Controller events
        controller.down.onEvent(ControllerButtonEvent.Released, function () {
            movement.down = false
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
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

        // Drop critters with B
        controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Released, function () {
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
                            critter.sprite.say(`H:${critter.health},F:${critter.happiness}`, 2000)
                        }
                    }
                })
            }
        })
    }

    // This sets the animation based on the resulting moveDirection
    // Since it needs to be an "event" we keep track of the previous direction as

    // Still not perfect but better
    forever(() => {
        let moveAnimation: Array<Image> | undefined
        // Determine the animation based on direction
        if (movement.left && !previousMovement.left) {
            moveAnimation = assets.animation`walkLeft`
        } else if (movement.right && !previousMovement.right) {
            moveAnimation = assets.animation`walkRight`
        } else if (movement.up && !previousMovement.up) {
            moveAnimation = assets.animation`walkUp`
        } else if (movement.down && !previousMovement.down) {
            moveAnimation = assets.animation`walkDown`
        } else {
            // Don't "start over" the animation (causes stuttering)
            moveAnimation = undefined
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
