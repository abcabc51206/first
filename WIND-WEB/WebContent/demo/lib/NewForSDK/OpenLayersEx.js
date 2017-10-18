
OpenLayers.Handler.MeasurePath = OpenLayers.Class(OpenLayers.Handler.Point, {
    line: null,
    freehand: false,
    measureDistance:null,
    freehandToggle: 'shiftKey',
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.Point.prototype.initialize.apply(this, arguments);
    },
    createFeature: function(pixel) {
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([this.point.geometry])
        );
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.line, this.point], {silent: true});
    },
    destroyFeature: function() {
        OpenLayers.Handler.Point.prototype.destroyFeature.apply(this);
        this.line = null;
    },
    removePoint: function() {
        if(this.point) {
            this.layer.removeFeatures([this.point]);
        }
    },    
    deactivate: function() {
        if(!OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            return false;
        }
        if(this.drawing) {
            this.cancel();
        }
        return true;
    }, 
    addPoint: function(pixel) {
        //this.layer.removeFeatures([this.point]);
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line.geometry.addComponent(
            this.point.geometry, this.line.geometry.components.length
        );
        this.callback("point", [this.point.geometry, this.getGeometry()]);
        this.callback("modify", [this.point.geometry, this.getSketch()]);
        //this.drawFeature();
        this.layer.addFeatures([this.line, this.point], {silent: false});
    },
    freehandMode: function(evt) {
        return (this.freehandToggle && evt[this.freehandToggle]) ?
                    !this.freehand : this.freehand;
    },
    modifyFeature: function(pixel) {
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point.geometry.x = lonlat.lon;
        this.point.geometry.y = lonlat.lat;
        this.callback("modify", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.drawFeature();
    },
    drawFeature: function() {    
        this.layer.drawFeature(this.line, this.style);
        this.layer.drawFeature(this.point, this.style);
    },
    getSketch: function() {
        return this.line;
    },
    getGeometry: function() {
        var geometry = this.line && this.line.geometry;
        if(geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiLineString([geometry]);
        }
        return geometry;
    },
    mousedown: function(evt) {
        if (this.lastDown && this.lastDown.equals(evt.xy)) {
            return false;
        }
        if(this.lastDown == null) {
            if(this.persist) {
                this.destroyFeature();
            }
            this.createFeature(evt.xy);
        } else if((this.lastUp == null) || !this.lastUp.equals(evt.xy)) {
            this.addPoint(evt.xy);
        }
        this.mouseDown = true;
        this.lastDown = evt.xy;
        this.drawing = true;
        return false;
    },
    mousemove: function (evt) {
        if(this.drawing) {
            if(this.mouseDown && this.freehandMode(evt)) {
                this.addPoint(evt.xy);
            } else {
                this.modifyFeature(evt.xy);
            }
            if (this.lastDown != null) {           
	            if (this.measureDistance == null) {
	            	var x = evt.xy.x + 15;
	            	var y = evt.xy.y + 15;
	                this.measureDistance = OpenLayers.Util.createDiv(null, new OpenLayers.Pixel(x,y), new OpenLayers.Size(140, 18), null, "absolute");
	            }
	            else {
	                this.measureDistance.style.left = evt.xy.x + 15;
	                this.measureDistance.style.top = evt.xy.y + 15;
	            }            
	            this.layer.div.appendChild(this.measureDistance);
	            //this.measureDistance.innerHTML = "<div style='font-size:9pt;padding: 3px; border: 1px solid blue;background-color: white;'>单击确定，双击结束</div>";
	            this.measureDistance.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
	            this.callback("measuremoseover", [this.point.geometry, this.getGeometry()]);
        	}
	    }
        return true;
    },
    mouseup: function (evt) {
        this.mouseDown = false;
        if(this.drawing) {
            if(this.freehandMode(evt)) {
                this.removePoint();
                this.finalize();
            } else {
                if(this.lastUp == null) {
                   this.addPoint(evt.xy);
                }
                this.lastUp = evt.xy;
            }
            return false;
        }
        return true;
    },
    dblclick: function(evt) {
    	this.drawing = false;
    	this.measureDistance.innerHTML = "";
        if(!this.freehandMode(evt)) {
            var index = this.line.geometry.components.length - 1;
            this.line.geometry.removeComponent(this.line.geometry.components[index]);
            this.removePoint();
            this.finalize();
        }
        return false;
    },
    CLASS_NAME: "OpenLayers.Handler.MeasurePath"
});

OpenLayers.Handler.MeasurePolygon = OpenLayers.Class(OpenLayers.Handler.MeasurePath, {
    polygon: null,
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.MeasurePath.prototype.initialize.apply(this, arguments);
    },
    createFeature: function(pixel) {
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LinearRing([this.point.geometry])
        );
        this.polygon = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Polygon([this.line.geometry])
        );
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.polygon, this.point], {silent: true});
    },
    destroyFeature: function() {
        OpenLayers.Handler.MeasurePath.prototype.destroyFeature.apply(this);
        this.polygon = null;
    },
    drawFeature: function() {
        this.layer.drawFeature(this.polygon, this.style);
        this.layer.drawFeature(this.point, this.style);
    },
    getSketch: function() {
        return this.polygon;
    },
    getGeometry: function() {
        var geometry = this.polygon && this.polygon.geometry;
        if(geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiPolygon([geometry]);
        }
        return geometry;
    },   
    mousemove: function (evt) {
        if(this.drawing) {
            if(this.mouseDown && this.freehandMode(evt)) {
                this.addPoint(evt.xy);
            } else {
                this.modifyFeature(evt.xy);
            }

            if (this.measureDistance == null) {
            	var x = evt.xy.x + 15;
            	var y = evt.xy.y + 15;
                this.measureDistance = OpenLayers.Util.createDiv(null, new OpenLayers.Pixel(x,y), new OpenLayers.Size(140, 18), null, "absolute");
            }
            else {
                this.measureDistance.style.left = evt.xy.x + 15;
                this.measureDistance.style.top = evt.xy.y + 15;
            }
            this.layer.div.appendChild(this.measureDistance);
            this.measureDistance.innerHTML = "<div style='font-size:9pt;padding: 3px; border: 1px solid blue;background-color: white;'>单击确定，双击结束</div>";
            this.measureDistance.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        }
        return true;
    },
    dblclick: function(evt) {
    	this.measureDistance.innerHTML = "";
        if(!this.freehandMode(evt)) {
            var index = this.line.geometry.components.length - 2;
            this.line.geometry.removeComponent(this.line.geometry.components[index]);
            this.removePoint();
            this.finalize();
        }
        return false;
    },
    CLASS_NAME: "OpenLayers.Handler.MeasurePolygon"
});

OpenLayers.Control.CustomMeasure = OpenLayers.Class(OpenLayers.Control, {
    EVENT_TYPES: ['measure', 'measurepartial','measuremoseover'],
    handlerOptions: null,
    callbacks: null,
    displaySystem: 'metric',
    geodesic: false,
    displaySystemUnits: {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm']
    },
    partialDelay: 100,
    delayedTrigger: null,
    persist: false,
    lengthPopup:[],
    initialize: function(handler, options) {
        this.EVENT_TYPES =
            OpenLayers.Control.CustomMeasure.prototype.EVENT_TYPES.concat(
            OpenLayers.Control.prototype.EVENT_TYPES
        );
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.callbacks = OpenLayers.Util.extend(
            {done: this.measureComplete, point: this.measurePartial,measuremoseover:this.measuremoseover},
            this.callbacks
        );
        this.lengthPopup = [];
        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({symbolizer: OpenLayers.Control.Measure.CustomsketchSymbolizers})
        ]);
        var measureStyleMap = new OpenLayers.StyleMap({"default": style});
        this.persist = true;
        this.handlerOptions = OpenLayers.Util.extend(
            {persist: this.persist,
             layerOptions: {styleMap: measureStyleMap}
            }, this.handlerOptions
        );
        this.handler = new handler(this, this.callbacks, this.handlerOptions);
    },
    cancel: function() {
        this.handler.cancel();
    },
    updateHandler: function(handler, options) {
        var active = this.active;
        if(active) {
            this.deactivate();
        }
        this.handler = new handler(this, this.callbacks, options);
        if(active) {
            this.activate();
        }
    },
    measureComplete: function(geometry) {
        if(this.delayedTrigger) {
            window.clearTimeout(this.delayedTrigger);
        }
        this.measure(geometry, "measure");
    },
    measurePartial: function(point, geometry) {
    	var geo = geometry.clone();
        this.delayedTrigger = window.setTimeout(
            OpenLayers.Function.bind(function() {
                this.measure(geo, "measurepartial");
            }, this),
            this.partialDelay
        );
    },
    measuremoseover: function(point, geometry) {
    	var geo = geometry.clone();
        this.delayedTrigger = window.setTimeout(
            OpenLayers.Function.bind(function() {
                this.measure(geo, "measuremoseover");
            }, this),
            this.partialDelay
        );
    },
    measure: function(geometry, eventType) {
        var stat, order;
        if(geometry.CLASS_NAME.indexOf('LineString') > -1) {
            stat = this.getBestLength(geometry);
            order = 1;
        } else {
            stat = this.getBestArea(geometry);
            order = 2;
        }
        this.events.triggerEvent(eventType, {
            measure: stat[0],
            units: stat[1],
            order: order,
            geometry: geometry
        });
    },
    removeAllTip:function(){
	    for(var i=0;i<this.handler.lengthPopup.length;i++){
		    try{
		    	DC.Map.map.removePopup(this.handler.lengthPopup[i]);
		    }catch(error){}
		}
    },
    getBestArea: function(geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, area;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            area = this.getArea(geometry, unit);
            if(area > 1) {
                break;
            }
        }
        return [area, unit];
    },
    getArea: function(geometry, units) {
        var area, geomUnits;
        if(this.geodesic) {
            area = geometry.getGeodesicArea(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            area = geometry.getArea();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
        }
        return area;
    },
    getBestLength: function(geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, length;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            length = this.getLength(geometry, unit);
            if(length > 1) {
                break;
            }
        }
        return [length, unit];
    },
    getLength: function(geometry, units) {
        var length, geomUnits;
        if(this.geodesic) {
            length = geometry.getGeodesicLength(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            length = geometry.getLength();
            geomUnits = this.map.getUnits();
           
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            length *= (inPerMapUnit / inPerDisplayUnit);
        }
        return length;
    },
    CLASS_NAME: "OpenLayers.Control.CustomMeasure"
});

OpenLayers.Control.Measure.CustomsketchSymbolizers = {
	"Point": {
		pointRadius: 4,
		graphicName: "square",
		fillColor: "white",
		fillOpacity: 1,
		strokeWidth: 1,
		strokeOpacity: 1,
		strokeColor: "#333333"
	},
	"Line": {
		strokeWidth: 3,
		strokeOpacity: 0.8,
		strokeColor: "#79A6D3",
		fillOpacity: 0.1,
		strokeDashstyle: "soid"
	},
	"Polygon": {
		strokeWidth: 3,
		strokeOpacity: 0.8,
		strokeColor: "#79A6D3",
		fillColor: "#92DB17",
		fillOpacity: 0.2
	}
};

