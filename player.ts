namespace Player {
    let critterBeingCarried: Critter | null = null
    export let ginny: Sprite = null
    
    export function init() {
        ginny = sprites.create(assets.image`ginny`, SpriteKind.Player)
        // Move Ginny
        controller.moveSprite(ginny, 60, 60)
        // Controller events
        controller.down.onEvent(ControllerButtonEvent.Released, function () {
            animation.stopAnimation(animation.AnimationTypes.All, ginny)
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            animation.stopAnimation(animation.AnimationTypes.All, ginny)
            animation.runImageAnimation(
                ginny,
                assets.animation`walkDown`,
                200,
                true
            )
        })
        controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
            animation.runImageAnimation(
                ginny,
                assets.animation`walkUp`,
                200,
                true
            )
        })
        controller.up.onEvent(ControllerButtonEvent.Released, () => {
            animation.stopAnimation(animation.AnimationTypes.All, ginny)
        })
        controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
            animation.runImageAnimation(
                ginny,
                assets.animation`walkLeft`,
                100,
                true
            )
        })
        controller.left.onEvent(ControllerButtonEvent.Released, () => {
            animation.stopAnimation(animation.AnimationTypes.All, ginny)
        })
        controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
            animation.runImageAnimation(
                ginny,
                assets.animation`walkRight`,
                100,
                true
            )
        })
        controller.right.onEvent(ControllerButtonEvent.Released, () => {
            animation.stopAnimation(animation.AnimationTypes.All, ginny)
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
}
