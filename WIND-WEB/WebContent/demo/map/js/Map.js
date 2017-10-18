(function(){
	var Map = window.Map = function(){
			
		return this.init();
	}
	//_map2d = null;
	//_map3d = null;
	Map.prototype = {
		_isShow2D : false,
	    _isShow3D : false,
		map2d:null,
		map3d:null,
		init:function(){
			return this;
		},
		init2D:function(div){
			this.map2d = new Map2D(div);
		},
		init3D:function(){
			
		},
		setShow2D:function(isshow){
			this._isShow2D = isshow;
		},
		setShow3D:function(isshow){
			this._isShow3D = isshow;
		},
		addLayerGroup:function(layergroup,type){
			type = type?type:(this._isShow2D?"2D":"3D");
			if(this._isShow2D&&type=="2D"){
				this.map2d.map.loadLayerGroup(layergroup);
			}
			if(this._isShow2D&&type=="2D"){
				
			}
		}
	}	
})();