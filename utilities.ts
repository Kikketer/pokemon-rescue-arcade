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
}