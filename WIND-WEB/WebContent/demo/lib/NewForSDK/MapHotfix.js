Geo.View2D.Map.prototype.addLayer = function(layer, _notResetLayers){

    var isUpdateBaseLayer = false;
    
    if (layer.maxResolution && layer.minResolution) {
        isUpdateBaseLayer = true;
    }
    //强行将基础图层属性改为false
    layer.isBaseLayer = false;
    
    //如果是置顶图层，则添加插入至图层顶层。否则添加插入至置顶图层的最底层的位置。
    if (layer.isOnTop) {
        this.insertLayerFirst(layer);
    }
    else {
        var idx = this._getLastTopLayerPosition();
        this.insertLayerIndex(layer, idx);
    }
    if (!_notResetLayers) {
        if (isUpdateBaseLayer) {
            this.updateBaseLayer();
        }
    }
};

Geo.View2D.Map.prototype.updateBaseLayer = function(options){
    var defOptions = {
        displayInLayerSwitcher: false,
        isBaseLayer: true
    }
    var blOptions = {};
    if (!options) {
        blOptions = {
        	resolutions:this.resolutions,
            maxResolution: this.getLayersMaxResolution(),
            minResolution: this.getLayersMinResolution(),
            maxExtent: this.getLayersMaxExtent()
        };
    }
    else {
        OpenLayers.Util.extend(blOptions, options);
    }
    OpenLayers.Util.extend(blOptions, defOptions);
    var bl = new OpenLayers.Layer("GeoGlobeBaseLayer", blOptions);
    
    if (this.baseLayer) {
        this.removeLayer(this.baseLayer);
    }
    OpenLayers.Map.prototype.addLayer.apply(this, [bl]);
    this.setLayerIndex(bl, 0);
};


Geo.View2D.Map.prototype.loadLayerGroup = function(layerGroup){
    if (this.layerGroup == layerGroup) {
        var msg = "不能重复加载图层组到地图中！";
        OpenLayers.Console.warn(msg);
        return false;
    }
    this.unloadLayerGroup();
    layerGroup.setMap(this);
    this.layerGroup = layerGroup;
    
    this.updateBaseLayer();
    this.events.triggerEvent("loadlayergroup", {
        layerGroup: layerGroup,
        map: this
    });
};

//取最后一个置顶图层位置
Geo.View2D.Map.prototype._getLastTopLayerPosition = function(){
    var layersNum = this.layers.length;
    var topIndex = layersNum - 1;
    for (var i = topIndex; i >= 0; i--) {
        var layer = this.layers[i];
        //if (layer.isOnTop && !layer.isBaseLayer) {
        //this.setLayerIndex(layer, topIndex--);
        //}
        if (!layer.isOnTop) {
            return i + 1;
        }
    }
};


//插入所有图层的最顶层
Geo.View2D.Map.prototype.insertLayerFirst = function(layer){
    var idx = this.layers.length;
    this.insertLayerIndex(layer, idx);
};

//插入所有图层的最底层
Geo.View2D.Map.prototype.insertLayerLast = function(layer){
    var idx = 1;
    this.insertLayerIndex(layer, idx);
};

Geo.View2D.Map.prototype.insertLayerIndex = function(layer, idx){
    //强行将基础图层属性改为false
    layer.isBaseLayer = false;
    for (var i = 0, len = this.layers.length; i < len; i++) {
        if (this.layers[i] == layer) {
            var msg = OpenLayers.i18n('layerAlreadyAdded', {
                'layerName': layer.name
            });
            OpenLayers.Console.warn(msg);
            return false;
        }
    }
    
    if (this.events.triggerEvent("preaddlayer", {
        layer: layer
    }) ===
    false) {
        return;
    }
    
    layer.div.className = "olLayerDiv";
    layer.div.style.overflow = "";
    
    if (idx < 0) {
        idx = 1;//排除空基础图层
    }
    else 
        if (idx > this.layers.length) {
            idx = this.layers.length;
        }
    
    //this.setLayerZIndex(layer, idx);
    
    if (layer.isFixed) {
        this.viewPortDiv.appendChild(layer.div);
    }
    else {
        this.layerContainerDiv.appendChild(layer.div);
    }
    
    // this.layers.push(layer);
    this.layers.splice(idx, 0, layer);
    //重新设置图层的ZIndex样式。
    this.resetLayersZIndex();
    
    layer.setMap(this);
    layer.redraw();
    
    this.events.triggerEvent("addlayer", {
        layer: layer
    });
    layer.afterAdd();
};

Geo.View2D.BaseLayerGroup.prototype.setMap = function(map){
    if (map && !this.map) {
        this.map = map;
        for (var i = this.layers.length - 1; i >= 0; i--) {
            this.map.insertLayerIndex(this.layers[i], 1);
        }
    }
};
