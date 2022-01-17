// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile14 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile15 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
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
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile10 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile9 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "farm":
            case "level1":return tiles.createTilemap(hex`20001800181818181818181818181818181818181819181818181818181818181818181818190f0a0a0a0a0a0a0a0a0a0a0a10191819181818181818181818181818181818190e01020202031718171819190e191819191918181818181818191918181818180e09050505041718181819180e181818191918181718181818191818181819180e09050505041717181918180e171818181918181818181818191818181819180e09050505041717181918180e181918171818181818191918181818181818180e08060606071718181818180e181818181818181718181918181818181818180d0a0b0a0a0a0a0a0a0a0a0a0c18181818181818181818181818181818181818181818181818181818181818181818181818181918181818191718181818181818181818181818181818181818181919181818191918181819191818181818111a1a1a1a1a1a1a1a15161a1a111818181818181818181818181918181818181112121213121212121212121211181818181818181818181818181818181818111212121312121212121212121118181818171818181818181818181818181811121212141212121212121212111818181818181818181919181819191818181112121213121212121212121211181718181818181818181818191918181818111212121212121212121212121118181818181818181818181819181818181811121212121212121212121212111818181918181818181818181818181818181112121212121212121212121211181818181818181919181818171818181818111212121212121212121212121118181919181818181818191818181818181811121212121212121212121212111818191819191818181818181818191818181a1a1a1a1a1a1a1a1a1a1a1a1a1a1919191818181818191919191919191818181818171718181818181818181818191818181818171818191818181818181818181818181818181718181918181818181818181818181818191919181818181818181818181818181818191918181818181818181818181818181818181818`, img`
................................
..2222222.......................
..2.....2.......................
..2.....2.......................
..2.....2.......................
..2.....2.......................
..2.....2.......................
..22.2222.......................
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
`, [myTiles.transparency16,sprites.castle.tilePath1,sprites.castle.tilePath2,sprites.castle.tilePath3,sprites.castle.tilePath6,sprites.castle.tilePath5,sprites.castle.tilePath8,sprites.castle.tilePath9,sprites.castle.tilePath7,sprites.castle.tilePath4,myTiles.tile4,myTiles.tile6,myTiles.tile7,myTiles.tile8,myTiles.tile9,myTiles.tile2,myTiles.tile3,myTiles.tile11,myTiles.tile12,myTiles.tile13,myTiles.tile14,myTiles.tile15,myTiles.tile16,sprites.castle.tileGrass2,myTiles.tile1,myTiles.tile17,myTiles.tile18], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "myTile4":
            case "tile6":return tile6;
            case "myTile12":
            case "tile14":return tile14;
            case "myTile13":
            case "tile15":return tile15;
            case "myTile14":
            case "tile16":return tile16;
            case "fenceHorizontal":
            case "tile4":return tile4;
            case "fenceBottomRight":
            case "tile7":return tile7;
            case "fenceBottomLeft":
            case "tile8":return tile8;
            case "fenceTopRight":
            case "tile3":return tile3;
            case "fenceDoorOpen":
            case "tile5":return tile5;
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
            case "fenceCorner":
            case "tile2":return tile2;
            case "fenceVerticalRight":
            case "tile10":return tile10;
            case "fenceVerticalLeft":
            case "tile9":return tile9;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
