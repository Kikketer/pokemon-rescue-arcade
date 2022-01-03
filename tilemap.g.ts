// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "farm":
            case "level1":return tiles.createTilemap(hex`100010000101010101010101010101010101010101010101010101010101010101010101010101020303030401010101010101010101010a0606060501010101010101010101010a0606060501010101010101010101010a060606050101010101010101010101090707070801010101010101010101010d0d0d0d0d01010101010101010101010101010101010101010101010101010101010101010101010101010101010b0b0b0b0b0b0b0b0b01010b0b0b01010b0c0c0c0c0c0c0c0c0c0c0c0c0b01010b0c0c0c0c0c0c0c0c0c0c0c0c0b01010b0c0c0c0c0c0c0c0c0c0c0c0c0b01010b0c0c0c0c0c0c0c0c0c0c0c0c0b01010b0b0b0b0b0b0b0b0b0b0b0b0b0b01`, img`
. . . . . . . . . . . . . . . . 
. . 2 2 2 2 2 2 2 . . . . . . . 
. . 2 . . . . . 2 . . . . . . . 
. . 2 . . . . . 2 . . . . . . . 
. . 2 . . . . . 2 . . . . . . . 
. . 2 . . . . . 2 . . . . . . . 
. . 2 . . . . . 2 . . . . . . . 
. . 2 2 . 2 2 2 2 . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. 2 2 2 2 2 2 2 2 2 . . 2 2 2 . 
. 2 . . . . . . . . . . . . 2 . 
. 2 . . . . . . . . . . . . 2 . 
. 2 . . . . . . . . . . . . 2 . 
. 2 . . . . . . . . . . . . 2 . 
. 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
`, [myTiles.transparency16,sprites.castle.tileGrass1,sprites.castle.tilePath1,sprites.castle.tilePath2,sprites.castle.tilePath3,sprites.castle.tilePath6,sprites.castle.tilePath5,sprites.castle.tilePath8,sprites.castle.tilePath9,sprites.castle.tilePath7,sprites.castle.tilePath4,sprites.builtin.forestTiles26,sprites.builtin.forestTiles10,sprites.castle.tileGrass3], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
