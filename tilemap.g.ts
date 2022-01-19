// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile14 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile15 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile17 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile11 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile18 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile12 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile13 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile19 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile9 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile10 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "farm":
            case "level1":return tiles.createTilemap(hex`200018000808080808080808080808080808080808090808080b0b0808080808080808080809020f0f0f0f0f0f0f0f0f0f0f0d0908090808080b0b0808080808080808080809010909090909090909080909010908090909080b0b0808080809090808080808010909090909090909080908010808080909080b0b0808080809080808080908010909090909090908090808010708080809080b0b0808080809080808080908010909090909090908090808010809080708080b0b0809090808080808080808010909090909090908080808010808080808080b0b08080908080808080808080c0f090f0f0f0f0f0f0f0f0f0e0808080808080b0b0808080808080808080b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0808080907080808080b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b080809090808080808030a0a0a0a0a0a0a0a09090a0a03080808080808080b0b0b0808090808080808030404040504040404040404040308080808080808080b0b0b0808080808080803040404050404040404040404030808080807080808080b0b0b0808080808080304040406040404040404040403080808080808080808090b0b0b0b0b0b0b08030404040504040404040404040308070808080808080808080b0b0b0b0b0b08030404040404040404040404040308080808080808080808080809080808080803040404040404040404040404030808080908080808080808080808080808080304040404040404040404040403080808080808080909080808070808080808030404040404040404040404040308080909080808080808090808080808080803040404040404040404040404030808090809090808080808080808090808080a0a0a0a0a0a0a0a0a0a0a0a0a0a0909090808080808090909090909090808080808070708080808080808080808090808080808070808090808080808080808080808080808080708080908080808080808080808080808090909080808080808080808080808080808090908080808080808080808080808080808080808`, img`
................................
..2222222222222.................
..2...........2.................
..2...........2.................
..2...........2.................
..2...........2.................
..2...........2.................
..22.2222222222.................
................................
................................
.222222222..222.................
.2...2........2.................
.2...2........2.................
.2............2.................
.2...2........2.................
.2............2.................
.2............2.................
.2............2.................
.2............2.................
.2............2.................
.22222222222222.................
................................
................................
................................
`, [myTiles.transparency16,myTiles.tile9,myTiles.tile2,myTiles.tile11,myTiles.tile12,myTiles.tile13,myTiles.tile14,sprites.castle.tileGrass2,myTiles.tile1,myTiles.tile17,myTiles.tile18,myTiles.tile19,myTiles.tile10,myTiles.tile8,myTiles.tile3,myTiles.tile7], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "myTile12":
            case "tile14":return tile14;
            case "myTile13":
            case "tile15":return tile15;
            case "myTile14":
            case "tile16":return tile16;
            case "grass1":
            case "tile1":return tile1;
            case "grass2":
            case "tile17":return tile17;
            case "brickHorizontal":
            case "tile11":return tile11;
            case "brickTop":
            case "tile18":return tile18;
            case "woodFloor":
            case "tile12":return tile12;
            case "innerFenceVertical":
            case "tile13":return tile13;
            case "stonePath":
            case "tile19":return tile19;
            case "fieldDoorClosed":
            case "tile6":return tile6;
            case "fieldDoorOpen":
            case "tile5":return tile5;
            case "fenceVertical":
            case "tile9":return tile9;
            case "fenceBottomLeft":
            case "tile10":return tile10;
            case "fenceTopLeft":
            case "tile2":return tile2;
            case "fenceTopRight":
            case "tile8":return tile8;
            case "fenceBottomRight":
            case "tile3":return tile3;
            case "fenceHorizontal":
            case "tile7":return tile7;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
