Geo.View2D.BaseLayerGroup.prototype.setMap = function(map){
    if (map && !this.map) {
        this.map = map;
        for (var i = this.layers.length - 1; i >= 0; i--) {
            this.map.insertLayerIndex(this.layers[i], 1);
        }
    }
};
