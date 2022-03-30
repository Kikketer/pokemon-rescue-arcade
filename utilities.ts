namespace Utils {
    export function isInZone(x: number, y: number, zone: Zone) {
        // Convert the pixels of x/y to TileScaleconst tileX = Math.floor(critter.sprite.x / 16)
        const tileY = Math.floor(y / 16)
        const tileX = Math.floor(x / 16)

        let isInZone = false
        if (tileX >= zone.topLeft.x &&
            tileY >= zone.topLeft.y &&
            tileX <= zone.bottomRight.x &&
            tileY <= zone.bottomRight.y) {
            isInZone = true
        }
        return isInZone
    }

    export function setPosition(sprite: Sprite, tileX: number, tileY: number) {
        // 8px offset for the 16px sprites (the placement is middle)
        sprite.setPosition(tileX * 16 + 8, tileY * 16 + 8)
        return sprite
    }
}