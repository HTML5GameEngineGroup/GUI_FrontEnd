/**
 * Created by MetaBlue on 7/18/16.
 */
//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.TextureSupport = (function() {
    
    var gAllTextures = {};

    var addTexture = function ( texName ) {
        gAllTextures[texName] = true;
    };

    var removeTexture = function ( texName ) {
        delete gAllTextures[texName];
    };

    var getTexList = function () {
        var texList = [];
        for (var texName in gAllTextures) {
            texList.push(texName);
        }
        return texList;
    };

    var mPublic = {
        gAllTextures: gAllTextures,
        addTexture: addTexture,
        removeTexture: removeTexture,
        getTexList: getTexList
    };
    return mPublic;
}());