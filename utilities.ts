namespace Utils {
    export function isInZone(currentX: number, currentY: number, zone: Zone) {
        let isInZone = false
        if (currentX >= zone.topLeft.x &&
            currentY >= zone.topLeft.y &&
            currentX <= zone.bottomRight.x &&
            currentY <= zone.bottomRight.y) {
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