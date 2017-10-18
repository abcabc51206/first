(function(){
	var Map2D = window.Map2D = function(div){
		return this.init(div);
	}
	 var _options;
	(function _initOptions(){
		OpenLayers.INCHES_PER_UNIT["公里"] = OpenLayers.INCHES_PER_UNIT["km"] ; 
	    OpenLayers.INCHES_PER_UNIT["米"] = OpenLayers.INCHES_PER_UNIT["m"]  ;
	    OpenLayers.INCHES_PER_UNIT["英里"] = OpenLayers.INCHES_PER_UNIT["mi"];
		OpenLayers.INCHES_PER_UNIT["英尺"] = OpenLayers.INCHES_PER_UNIT["ft"];
	    _ScaleLine=new OpenLayers.Control.ScaleLine({maxWidth:150,
	                                                   topOutUnits:"公里",  
	                                                   bottomOutUnits:"米"
	                                                  });
	    _MousePosition=new Geo.View2D.Control.MousePosition();
	    _MousePosition.numDigits=2;
		//_MousePosition.prefix="经度：";
		//_MousePosition.separator=",纬度：";
		_MousePosition.prefix="";
		_MousePosition.separator=",";
		_options={
	            controls:[
	                  _ScaleLine,
	                  _MousePosition,
	                  //new Geo.View2D.Control.TuLi(),
	                  new Geo.View2D.Control.MagnifyingGlass(),
	                  /*
	                  new OpenLayers.Control.TouchNavigation({
			                dragPanOptions: {
			                    enableKinetic: true
			                }
			            }),
			            * */
	                 // new Geo.View2D.Control.LayerSwitcher(),
	                  //geolocate,
	                  new Geo.View2D.Control.ArgParser(),
	                  new Geo.View2D.Control.Attribution()
	                  ],
                  maxExtent: new Geo.Bounds(-180,-90,180,90)
	       }	    
	})();
	Map2D.prototype = {
		addonPanelCtrls: null,
		boolOffsetMap:false,//判断在地图边界是否平移，在单击量距控件触发
		init:function(div,options){
		 	var CustomPanZoomBar=new OpenLayers.Control.PanZoomBar();
			CustomPanZoomBar.zoomWorldIcon = true;
			CustomPanZoomBar.position.x = 10;
			options = options?options:_options;
			this.map = new Geo.View2D.Map(div,options);
			this.map.addControl(CustomPanZoomBar);
			this.initAddonCtrls();
			return this;
		},
		initAddonCtrls:function(){
	     	this.addonPanelCtrls = {
				navigation: new Geo.View2D.Control.Navigation({
		                //设置拖动惯性
		                dragPanOptions: {
		                    enableKinetic: true
		                }
		            }),
				lineMeasure: new OpenLayers.Control.CustomMeasure(OpenLayers.Handler.MeasurePath),
				//lineMeasure: new Geo.View2D.Control.Measure.DistanceMeasure(),
				
				//polygonMeasure: new Geo.View2D.Control.CustomMeasure(OpenLayers.Handler.MeasurePolygon),
				zoomOut: new Geo.View2D.Control.ZoomBox({out:true}),
				zoomIn: new Geo.View2D.Control.ZoomBox()
	    	};
	    	this.addonPanel = new Geo.View2D.Control.Panel();
		    this.addonCtrls = {
		    	
		    }
		    this.addonCtrls = this.addonPanelCtrls;    	
			for(var myitem in this.addonPanelCtrls){
				this.addonPanel.addControls([this.addonPanelCtrls[myitem]]);		
			}
			var that = this;
            this.addonPanelCtrls.lineMeasure.events.on(
                              { "measure": 
                                   function(event){
												var geometry = event.geometry;
												var len = geometry.components.length;
												var units = event.units;
												var order = event.order;
												var measure = event.measure;
												var point = {
											  		x: geometry.components[len - 1].x,
											  		y: geometry.components[len - 1].y
											  	} ;
											  	var res = that.map.getResolution();
										    	var lonlat = new OpenLayers.LonLat(point.x + res * 2,point.y + res * 22);
												var out = "";
												var layer = null;
												var callfn = OpenLayers.Function.bind(function(layerid){
												    layer = that.map.getLayer(layerid);
													//先删除浮云
													for(var i=0;i<this.lengthPopup.length;i++){
	                                                     try{
	                                                          popup = this.lengthPopup[i];
	                                                          if(popup.id == layerid){
	                                                              that.map.removePopup(popup);
	                                                          }
	                                                        }catch(error){}
	                                                }
													//删除点和线的要素
													if(layer) {
	                                                    layer.destroyFeatures();
	                                                }
	                                                this.handler.point = null;
	                                                this.handler.line = null;
	                                                //删除图层
	                                                that.map.removeLayer(layer);
													//$("#measureInfo").dialog("destroy");
												},this,this.handler.layer.id);
												if(units=='km'){units='公里'}else{units='米'}
												out = "总距离:" +measure.toFixed(2) + units;
											
												var popup = new OpenLayers.Popup(this.handler.layer.id, 
										        		lonlat,
										                new OpenLayers.Size(10,10),
										                out,
										                true,callfn);
										        popup.autoSize = true;
										        popup.minSize = new OpenLayers.Size(15,17);
										        popup.border="#8B8B8B 1px solid";
										        popup.opacity="1";
												popup.backgroundColor="#e5e6e7";
										        if(that.measure!=null){
										            that.measure = null;
										        }
										        that.map.addPopup(popup);
										        this.lengthPopup.push(popup);
										        that.addonPanel.activateControl(that.addonCtrls.navigation);
										        //DC.BaseOper.mouseMove();
										        that.oldmousepop=measure.toFixed(2) + units;
										       // DC.Map.map.div.style.cursor="move";
										       $("#Map").css("cursor","url(img/cur/openhand.cur),url(img/cur/openhand.cur),default");
										       that.boolOffsetMap=false;
										       this.map.events.unregister("mouseover",this.map,DC.BaseOper.mouseOverHandler);
										  },
								"measurepartial": 
								    function(event){
												  	var geometry = event.geometry;
												  	var len = geometry.components.length;									  	
												  	var point = {
												  		x: geometry.components[len -1].x,
												  		y: geometry.components[len - 1].y
												  	}
												    var stat=this.getBestLength(geometry);
											    	var res = that.map.getResolution();
											    	var lonlat = new OpenLayers.LonLat(point.x + res * 2,point.y + res * 22);
											    	lonlat.add(point.x,point.y);
											    	var unit = event.units;
													var order = event.order;
													var measure = event.measure;
													var length;
													if(unit=='km'){unit='公里'}else{unit='米'}
													if(measure.toFixed(2)=="0.00"){
														length="起点"
													}else{
														length=measure.toFixed(2)+unit;
													}
													that.newmousepop=length;
											        var popup = new OpenLayers.Popup(this.handler.layer.id, 
											        		lonlat,
											                new OpenLayers.Size(10,10),
											                length,
											                false);
											        popup.autoSize = true;
											        popup.border="#8B8B8B 1px solid";
											        popup.opacity="1";
											        popup.backgroundColor="#e5e6e7";
											        if(that.oldmousepop==that.newmousepop){
											        that.newmousepop=null;
											        that.oldmousepop=null;
											      }else{
											      	that.map.addPopup(popup);
											      	
											      }
											        that.measure = popup;
											        this.lengthPopup.push(popup);
											        that.measureType = true;
											        that.boolOffsetMap=true;
											  },
											  
							  "measuremoseover": 
							      function(event){
												  var measure = event.measure;
												  var unit = event.units;
												  var length = 0;
												  if(unit=='km'){unit='公里'}else{unit='米'}
												   length=measure.toFixed(2);
												  this.handler.measureDistance.innerHTML = "<div style='font-size:9pt;padding: 3px; border: 1px solid blue;background-color: white;'>总长:<span style='color:#ff6319;font-weight:bold;'>" + length + "</span>"+unit+"<br>单击开始，双击结束</div>";
										},
											  
							 scope: that.addonCtrls.lineMeasure
								 });			
			//默认开启的功能是漫游的功能
		    this.addonPanel.defaultControl = this.addonPanelCtrls.navigation;
		    this.map.addControl(this.addonPanel);			
		},
		/*
		 * fuc:鼠标移动边界时候进行平移
		 */
		offsMapBymouse:function(map,e){
			if(this.boolOffsetMap==false)return;
			try{
			if(map==this.map){
		    	  var tolerance=50;
				var mid = "Map";
				var width_map = $("#"+mid).width();
				var height_map = $("#"+mid).height();
		          var map_offset = $("#" + mid).offset();// 获取地图的偏移位置	          
		         var  offsetX=e.clientX-map_offset.left;
		          var offsetY=e.clientY-map_offset.top;
		        var center = map.getCenter();
		          //判断X方向
		           if(tolerance>offsetX){
		           	    var xLon=map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX-tolerance,e.clientY)).lon-map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX,e.clientY)).lon;
		           	    var lon=center.lon+xLon;
		           	    var lat=center.lat;
		           	    var lonlat=new OpenLayers.LonLat(lon,lat);
		           	    map.panTo(lonlat,map.zoom+2);
		           }else if(width_map-offsetX<tolerance){
		           	    var xLon=map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX+tolerance,e.clientY)).lon-map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX,e.clientY)).lon
		           	    var lon=center.lon+xLon;
		           	    var lat=center.lat;
		           	    var lonlat=new OpenLayers.LonLat(lon,lat);
		           	    map.panTo(lonlat,map.zoom+2);
		           }
		           
		         //判断Y方向  
		          if(tolerance>offsetY){
		           	    var yLat=map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX,e.clientY-tolerance)).lat-map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX,e.clientY)).lat;
		           	    var lon=center.lon;
		           	    var lat=center.lat+yLat;
		           	    var lonlat=new OpenLayers.LonLat(lon,lat);
		           	    map.panTo(lonlat,map.zoom+2);
		           }else if(height_map-offsetY<tolerance){
		           	    var yLat=map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX,e.clientY+tolerance)).lat-map.getLonLatFromPixel(new OpenLayers.Pixel(e.clientX,e.clientY)).lat
		           	    var lon=center.lon;
		           	    var lat=center.lat+yLat;
		           	    var lonlat=new OpenLayers.LonLat(lon,lat);
		           	    map.panTo(lonlat,map.zoom+2);
		           }
		    	}
			}catch(e){
				
			}
		}
    }	

})();