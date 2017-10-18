
OpenLayers.Control.PanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoom, {
    zoomStopWidth: 9,
    zoomStopHeight: 11,
    slider: null,
    sliderEvents: null,
    zoomBarDiv: null,
    leftTip:[""],
    leftTooltips:null,
    divEvents: null,
    zoomWorldIcon: false,
    initialize: function() {
        OpenLayers.Control.PanZoom.prototype.initialize.apply(this, arguments);
    },
    destroy: function() {
        this._removeZoomBar();
        this.map.events.un({
            "changebaselayer": this.redraw,
            scope: this
        });
        OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);
    },
    setMap: function(map) {
        OpenLayers.Control.PanZoom.prototype.setMap.apply(this, arguments);
        this.map.events.register("changebaselayer", this, this.redraw);
    },
    redraw: function() {
        if (this.div != null) {
            this.removeButtons();
            this._removeZoomBar();
        }
        this.draw();
    },
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = [];
        this.leftTip=[];
        var sz = new OpenLayers.Size(24,24);
        var centered = new OpenLayers.Pixel(px.x+sz.w/2, px.y);
        var wposition = sz.w;

        if (this.zoomWorldIcon) {
            centered = new OpenLayers.Pixel(px.x+sz.w, px.y);
        }

        this._addButton("panup", "panzoombar_blue/north-mini.png", centered, sz,"向上平移");
        px.y = centered.y+sz.h;
        this._addButton("panleft", "panzoombar_blue/west-mini.png", px, sz,"向左平移");
        if (this.zoomWorldIcon) {
            this._addButton("zoomworld", "panzoombar_blue/zoom-world-mini.png", px.add(sz.w, 0), sz,"全部地图");
            
            wposition *= 2;
        }
        this._addButton("panright", "panzoombar_blue/east-mini.png", px.add(wposition, 0), sz,"向右平移");
        this._addButton("pandown", "panzoombar_blue/south-mini.png", centered.add(0, sz.h*2), sz,"向下平移");
        this._addButton("zoomin", "panzoombar_blue/zoom-plus-mini.png", centered.add(0, sz.h*3+5), sz,"放大一级");
        centered = this._addZoomBar(centered.add(8, sz.h*4 + 4));
        this._addButton("zoomout", "panzoombar_blue/zoom-minus-mini.png", centered.add(-8,-1), sz,"缩小一级");
        //添加 zoomToolTip
        var tooltipSZ = new OpenLayers.Size(62,12);
        var imgLocation = OpenLayers.Util.getImagesLocation();
        this._addZoomToolTip("zoomtooltip", "panzoombar_blue/zoom_0.png", centered.add(20,0), tooltipSZ);
        
        //x :图片的宽度


        this.leftTooltips = {
            	//zltGlb:{url:"panzoombar_blue/zoom_Global.png",x:33,res:0.3515625},
            	//zltContinent:{url:"panzoombar_blue/zoom_Continent.png",x:30,res:0.087890625},
            	zltCountry:{url:"panzoombar_blue/zoom_Country.png",x:30,res:0.02197265625},
            	zltPro:{url:"panzoombar_blue/zoom_Province.png",x:30,res:0.0054931640625},
            	zltCity:{url:"panzoombar_blue/zoom_City.png",x:30,res:0.0006866455078125},
            	zltStr:{url:"panzoombar_blue/zoom_Street.png",x:30,res:0.00002145767211914062}
        };
        for(var myitem in this.leftTooltips){
			var leftTooltipObj = this.leftTooltips[myitem];
        	this._addZoomLeftTip(myitem,
								leftTooltipObj.url,
								centered.add(-leftTooltipObj.x,0),
								new OpenLayers.Size(leftTooltipObj.x,22),
								leftTooltipObj.res);        	
        }
      
        //centred, slider位置(x,y)
        return this.div;
    },
    //添加 zoomToolTip
    _addZoomToolTip:function(id, img, xy, sz) {
    	var imgLocation = OpenLayers.Util.getImagesLocation()+img;
        var tooltip = OpenLayers.Util.createAlphaImageDiv(
            "OpenLayers_Control_PanZoom_" + id, 
            xy, sz, imgLocation, "absolute");
         //初始化不显示
	    OpenLayers.Control.PanZoomBar.isVisible = false;
	    this.tooltip = tooltip;
	    this.tooltip.style.display = "none";
        this.div.appendChild(tooltip);
        return tooltip;
    },
    //添加 _addZoomLeftTip
    _addZoomLeftTip:function(id, img, xy, sz,res) {
    		if(res <= this.map.baseLayer.maxResolution && res >= this.map.baseLayer.minResolution){
	    	var imgLocation = OpenLayers.Util.getImagesLocation()+img;
	        var tooltipLeft = OpenLayers.Util.createAlphaImageDiv(
	        		"OpenLayers_Control_PanZoom_" + id, xy, sz, imgLocation, "absolute");
		    this.tipEvents = new OpenLayers.Events(this, tooltipLeft, null, true,
	                {includeXY: true});

			var mapMaxZoom = this.getCurrentZoomNumFromResolution(this.map.baseLayer.maxResolution,
																this.map.baseLayer.minResolution);
			var zoom = this.map.getZoomForResolution(res);
			var tipTop = (mapMaxZoom  - zoom ) * this.zoomStopHeight + this.startTop;
		    this.tipEvents.on({
	            "click": this.tipClick,
	            "mouseover":this.slideMouseOver,
	            "mouseout": this.mouseOut
	        });
	        
		    this.leftTip.push(tooltipLeft);
		    this.tooltipLeft = tooltipLeft;
		    tooltipLeft.res=res;
		    tooltipLeft.style.top=(tipTop -3) + "px";
		    tooltipLeft.style.display = "none";
		    tooltipLeft.style.cursor = "pointer";
		    
	        this.div.appendChild(tooltipLeft);
	        return tooltipLeft;
        }else{
        	return;
        }
    },
    tipClick: function (evt) {
		var srcElement = evt.srcElement ? evt.srcElement : evt.target;
    	var leftTipName = srcElement.id.split("_")[3];
    	var res = this.leftTooltips[leftTipName]["res"];
		var zoom = this.map.getZoomForResolution(res);
        if(res == 0.3515625){
        	this.map.setCenter(new OpenLayers.LonLat(104.293175,0),zoom);
        }else{
            this.map.zoomTo(zoom);
        }
        OpenLayers.Event.stop(evt);
    },
    /** 
    * Method: _addZoomBar
    * 
    * Parameters:
    * location - {<OpenLayers.Pixel>} where zoombar drawing is to start.
    */
    _addZoomBar:function(centered) {
        var imgLocation = OpenLayers.Util.getImagesLocation();
        
        var id = this.id + "_" + this.map.id;
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var slider = OpenLayers.Util.createAlphaImageDiv(id,
                       centered.add(-6, zoomsToEnd * this.zoomStopHeight), 
                       new OpenLayers.Size(20,13), 
                       imgLocation+"panzoombar_blue/slider.png",
                       "absolute");
        this.slider = slider;
        
        this.sliderEvents = new OpenLayers.Events(this, slider, null, true,
                                            {includeXY: true});
        this.sliderEvents.on({
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp,
            "dblclick": this.doubleClick,
            "click": this.doubleClick,
            "mouseover":this.slideMouseOver,
            "mouseout": this.mouseOut
        });
        
        var sz = new OpenLayers.Size();
        sz.h = this.zoomStopHeight * this.map.getNumZoomLevels();//zoombar 的高度



        sz.w = this.zoomStopWidth;
        var div = null;
        
        if (OpenLayers.Util.alphaHack()) {
            var id = this.id + "_" + this.map.id;
            div = OpenLayers.Util.createAlphaImageDiv(id, centered,
                                      new OpenLayers.Size(sz.w, 
                                              this.zoomStopHeight),
                                      imgLocation + "panzoombar_blue/zoombar.png", 
                                      "absolute", null, "crop");
            div.style.height = sz.h + "px";
        } else {
            div = OpenLayers.Util.createDiv(
                        'OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id,
                        centered,
                        sz,
                        imgLocation+"panzoombar_blue/zoombar.png");
        }
        
        this.zoombarDiv = div;
        
        this.divEvents = new OpenLayers.Events(this, div, null, true, 
                                                {includeXY: true});
        this.divEvents.on({
            "mousedown": this.divClick,
            "mousemove": this.passEventToSlider,
            "dblclick": this.doubleClick,
            "click": this.doubleClick,
            "mouseout": this.mouseOut
        });
        
        this.div.appendChild(div);

        this.startTop = parseInt(div.style.top);
        this.div.appendChild(slider);

        this.map.events.register("zoomend", this, this.moveZoomBar);

        centered = centered.add(0, 
            this.zoomStopHeight * this.map.getNumZoomLevels());
        return centered; 
    },
    _removeZoomBar: function() {
        this.sliderEvents.un({
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp,
            "dblclick": this.doubleClick,
            "click": this.doubleClick,
            "mouseover":this.slideMouseOver,
            "mouseout": this.mouseOut
        });
        this.sliderEvents.destroy();
        this.divEvents.un({
            "mousedown": this.divClick,
            "mousemove": this.passEventToSlider,
            "dblclick": this.doubleClick,
            "click": this.doubleClick,
            "mouseout": this.mouseOut
        });
        this.divEvents.destroy();
        for(var i=0;i<this.leftTip.length;i++){
        	
        	this.div.removeChild(this.leftTip[i]);
        }
        this.tooltipLeft = null;
        
        this.div.removeChild(this.zoombarDiv);
        this.zoombarDiv = null;
        this.div.removeChild(this.slider);
        this.slider = null;
        this.map.events.unregister("zoomend", this, this.moveZoomBar);
    },
    slideMouseOver: function(evt) {
    	OpenLayers.Control.PanZoomBar.isVisible = true;
    	this.tooltip.style.display = "";
    	for(var i=0;i<this.leftTip.length;i++){
    		this.leftTip[i].style.display = "";
    	}
    	/*var topTileSize = this.map.pyramid.getTopTileSize();
        var pyramidMaxResolution = (topTileSize.w / this.map.pyramid.tileSize.w) /  
		                            Math.pow(2, this.map.pyramid.topLevelIndex);

        this.getCurrentZoomNum(pyramidMaxResolution,this.map.getResolution());*/
        
        var fixZoom = this.getCurrentZoomNum();
        //var fixZoom = this.map.getZoom();
        var fixTop = 
        	((this.map.getNumZoomLevels()-1) - this.map.getZoom()) * 
            this.zoomStopHeight + this.startTop + 1;
        
        var imgLocation = OpenLayers.Util.getImagesLocation();
        var toolTipTop = fixTop;
		this.tooltip.style.top = (toolTipTop-3) + "px";
		
		var img = this.tooltip.childNodes[0];
		img.src = imgLocation+"panzoombar_blue/zoom_"+(parseInt(fixZoom)+0)+".png";
    },
  //鼠标移动响应
    passEventToSlider:function(evt) {
    	OpenLayers.Control.PanZoomBar.isVisible = true;
    	this.tooltip.style.display = "";
    	for(var i=0;i<this.leftTip.length;i++){
    		this.leftTip[i].style.display = "";
    	}
    	var newTop = 
            ((this.map.getNumZoomLevels()-1) - this.map.getZoom()) * 
            this.zoomStopHeight + this.startTop + 1;
        
        //var overZoom = this.getFixZoom(evt.y);
		var overZoom = this.getFixZoom(evt.xy.y) - 10;
        if(overZoom==-1) {
        	overZoom = 0;
        }
        
        //计算当前分辨率相对金字塔级别
        var topTileSize = this.map.pyramid.getTopTileSize();
        var pyramidMaxResolution = (topTileSize.w / this.map.pyramid.tileSize.w) /  
		                            Math.pow(2, this.map.pyramid.topLevelIndex);
        var currentResolution = this.map.getResolutionForZoom(overZoom);
        var fixZoom = this.getCurrentZoomNumFromResolution(pyramidMaxResolution, currentResolution);
        
        
        
        var fixTop = 
        	((this.map.getNumZoomLevels()-1) - overZoom) * 
            this.zoomStopHeight + this.startTop + 1;
        
        var imgLocation = OpenLayers.Util.getImagesLocation();
        var toolTipTop = fixTop;
		this.tooltip.style.top = (toolTipTop-3) + "px";
		
		var img = this.tooltip.childNodes[0];
		img.src = imgLocation+"panzoombar_blue/zoom_"+(parseInt(fixZoom)+0)+".png";
		
        this.sliderEvents.handleBrowserEvent(evt);
    },
    
    /**
     * Method: getDataExtent
     * 计算当前分辨率相对于金字塔的级别数


     */
    getCurrentZoomNum: function(){
    	var topTileSize = this.map.pyramid.getTopTileSize();
        var pyramidMaxResolution = (topTileSize.w / this.map.pyramid.tileSize.w) /  
		                            Math.pow(2, this.map.pyramid.topLevelIndex);

        var fixZoom = this.getCurrentZoomNumFromResolution(pyramidMaxResolution,this.map.getResolution());
        return fixZoom;
    },
    /**
     * Method: getDataExtent
     * 从给定金字塔最大分辨率和地图当前分辨率计算当前级别数


     */
	getCurrentZoomNumFromResolution: function(maxRes,currentRes){
	
		//原计算方法直接取地图当前级别：parseInt(this.map.getZoom());
		//现在的方法计算当前分辨率相对于金字塔最大分辨率的级别


        var zoomRatio =  maxRes / currentRes;
        
        //如果当前分辨率比金字塔最大分辨率还大，说明出错


        if(zoomRatio < 1) return 0;
        
        var zoom = 0;
        while( (zoomRatio / 2) >= 1 ){
        	zoom++;
        	zoomRatio = zoomRatio/2;
        };
        return zoom ;
	},
    getFixZoom: function(height) {
    	var currentZoom = this.map.getZoom();
		var newTop = 
        	((this.map.getNumZoomLevels()-1) - currentZoom) * 
        	this.zoomStopHeight + this.startTop + 6;
        while(true) {
        	var tmp = height - newTop;
        	if(tmp>=0) {
        		if(tmp<this.zoomStopHeight/2) {
        			break;
        		}
        		currentZoom--;
        		newTop = newTop + this.zoomStopHeight;
        	} else {
        		if(tmp>=-this.zoomStopHeight/2) {
        			break;
        		}
        		currentZoom++;
        		newTop = newTop - this.zoomStopHeight;
        	}
        }
        return currentZoom;
    },
    mouseOut: function(evt) {
    	var tooltip = this.tooltip;
    	OpenLayers.Control.PanZoomBar.isVisible = false;
    	var callfn = OpenLayers.Function.bind(function() {
			if(!OpenLayers.Control.PanZoomBar.isVisible) {
				tooltip.style.display = "none";
				for(var i=0;i<this.leftTip.length;i++){
		    		this.leftTip[i].style.display = "none";
		    	}
			}
    	},this);
    	
    	window.setTimeout(callfn,1000);
    	OpenLayers.Event.stop(evt);
    },
    divClick: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        //var y = evt.xy.y;
        //var top = OpenLayers.Util.pagePosition(evt.object)[1];
        //var levels = (y - top)/this.zoomStopHeight;
        var levels = evt.xy.y / this.zoomStopHeight;
        if(this.forceFixedZoomLevel || !this.map.fractionalZoom) {
            levels = Math.floor(levels);
        }
        var zoom = (this.map.getNumZoomLevels() - 1) - levels;
        zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
        this.map.zoomTo(zoom);
        
        OpenLayers.Event.stop(evt);
    },
    zoomBarDown:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        this.map.events.on({
            "mousemove": this.passEventToSlider,
            "mouseup": this.passEventToSlider,
            scope: this
        });
        this.mouseDragStart = evt.xy.clone();
        this.zoomStart = evt.xy.clone();
        this.div.style.cursor = "move";
        this.zoombarDiv.offsets = null;
        OpenLayers.Event.stop(evt);
    },
    zoomBarDrag:function(evt) {
        if (this.mouseDragStart != null) {
            var deltaY = this.mouseDragStart.y - evt.xy.y;
            var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
            if ((evt.clientY - offsets[1]) > 0 &&
                (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
                var newTop = parseInt(this.slider.style.top) - deltaY;
                this.slider.style.top = newTop+"px";
                this.mouseDragStart = evt.xy.clone();
            }
            OpenLayers.Event.stop(evt);
        }
    },
    zoomBarUp:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        if (this.zoomStart) {
            this.div.style.cursor="";
            this.map.events.un({
                "mouseup": this.passEventToSlider,
                "mousemove": this.passEventToSlider,
                scope: this
            });
            var deltaY = this.zoomStart.y - evt.xy.y;
            var zoomLevel = this.map.zoom;
            if (this.map.fractionalZoom) {
                zoomLevel += deltaY/this.zoomStopHeight;
                zoomLevel = Math.min(Math.max(zoomLevel, 0),
                                     this.map.getNumZoomLevels() - 1);
            } else {
                zoomLevel += Math.round(deltaY/this.zoomStopHeight);
            }
            this.map.zoomTo(zoomLevel);
            this.moveZoomBar();
            this.mouseDragStart = null;
            OpenLayers.Event.stop(evt);
        }
    },
    moveZoomBar:function() {
    	OpenLayers.Control.PanZoomBar.isVisible = false;
    	this.tooltip.style.display = "";
    	/*for(var i=0;i<this.leftTip.length;i++){
    		this.leftTip[i].style.display = "";
    	}*/
    	//获取当前级别相对于金字塔级别
    	var inPyramidZoom = this.getCurrentZoomNum();
    	
    	var imgLocation = OpenLayers.Util.getImagesLocation();
        var newTop =
            ((this.map.getNumZoomLevels()-1) - this.map.getZoom()) *
            this.zoomStopHeight + this.startTop + 1;
        
        this.tooltip.style.top = (newTop-3) + "px";
		var img = this.tooltip.childNodes[0];

		img.src = imgLocation+"panzoombar_blue/zoom_"+(parseInt(inPyramidZoom)+0)+".png";
		
        this.slider.style.top = newTop + "px";
        
        var tooltip = this.tooltip;
        var callfn = OpenLayers.Function.bind(function() {
			if(!OpenLayers.Control.PanZoomBar.isVisible) {
				tooltip.style.display = "none";
				for(var i=0;i<this.leftTip.length;i++){
		    		this.leftTip[i].style.display = "none";
		    	}
			}
    	},this);
    	
    	window.setTimeout(callfn,1000);
    },
       buttonDown: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }

        switch (this.action) {
            case "panup": 
                this.map.pan(0, -this.getSlideFactor("h"));
                break;
            case "pandown": 
                this.map.pan(0, this.getSlideFactor("h"));
                break;
            case "panleft": 
                this.map.pan(-this.getSlideFactor("w"), 0);
                break;
            case "panright": 
                this.map.pan(this.getSlideFactor("w"), 0);
                break;
            case "zoomin": 
                this.map.zoomIn(); 
                break;
            case "zoomout": 
                this.map.zoomOut(); 
                break;
            case "zoomworld": 
                this.map.setCenter(new OpenLayers.LonLat(DC.Cfg.City.lon,DC.Cfg.City.lat),DC.Cfg.City.zoom); //与配置文件同步
                break;
        }

        OpenLayers.Event.stop(evt);
    },
    CLASS_NAME: "OpenLayers.Control.PanZoomBar"
});