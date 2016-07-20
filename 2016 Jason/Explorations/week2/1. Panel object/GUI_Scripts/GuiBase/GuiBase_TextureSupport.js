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

    // texture must be already added to texture support!
    var addTextureToGameObject = function(GameObjectName, textureName) {
        // create texture
        var newTextureRenderable = new TextureRenderable(textureName);
        // get object
        var gameObject = gGuiBase.ObjectSupport.getGameObjectByID(GameObjectName);
        // copy transform from object to new texture
        var newTextureTransform = newTextureRenderable.getXform();
        var gameObjectTransform = gameObject.getXform();
        gameObjectTransform.cloneTo(newTextureTransform);
        // gGuiBase.ObjectSupport.copyTransform(newTextureTransform, gameObjectTransform);

        var gameObjectRenderable = gameObject.getRenderable();
        gameObjectRenderable = newTextureRenderable;
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
        addTextureToGameObject: addTextureToGameObject,
        addTexture: addTexture,
        removeTexture: removeTexture,
        getTexList: getTexList
    };
    return mPublic;
}());