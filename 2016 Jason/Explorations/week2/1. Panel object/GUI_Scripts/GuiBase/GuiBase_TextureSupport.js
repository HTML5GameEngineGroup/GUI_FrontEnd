/**
 * Created by MetaBlue on 7/18/16.
 */
//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.TextureSupport = (function() {
    
    var mAllTextures = {};

    var addTexture = function ( texName ) {
        mAllTextures[texName] = true;
    };

    var getTexList = function () {
        var texList = [];
        for (var texName in mAllTextures) {
            texList.push(texName);
        }
        return texList;
    };

    var mPublic = {
        addTexture: addTexture,
        getTexList: getTexList
    };
    return mPublic;
}());