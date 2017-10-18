/**
 * Class: Geo.Util.Format.GlobeTileCapabilities
 * GlobeTile服务getCapabilities操作请求结果的XML解析器，继承自Geo.Format.XML类，具有该类的所有属性与方法，并在此基础上进行了扩展。
 * 
 * Inherits from:
 *  - <Geo.Format.XML>
 */
Geo.Util.Format.GlobeTileCapabilities = Geo.Class(Geo.Format.XML,{
	
   /**
     * APIProperty: tagName
     * {String} 常量"ServiceCapabilities" ,根据该服务的getCapabilities请求返回而定。
     */
	tagName: "ServiceCapabilities",

	 /**
     * APIMethod: read
     * 解析一个XML串并返回capabilitiesObj{Object}对象。
     *
     * Parameters:
     * data - {String} 一个XML字符串。
     *
     * Returns:
     * {Object}- capabilitiesObj
     */
    read: function(data){
		if(typeof data == "string") {
            data = Geo.Format.XML.prototype.read.apply(this, [data]);
        }
		
		var capabilitiesNode;
		if(data.nodeName != this.tagName){
			capabilitiesNode = data.getElementsByTagName(this.tagName);
		} else {
			capabilitiesNode = [data];
		}
		
		var capabilitiesObj = null;
		if(capabilitiesNode.length > 0){
			capabilitiesObj = {};
			this.runChildNodes(capabilitiesObj, capabilitiesNode[0], "capabilities");
		}
		return capabilitiesObj;
	},
	
	/**
     * Method: runChildNodes
     * 解析每一个节点字符串并把相对应值赋给传入最终返回的对象obj。
     *
     * Parameters:
     * obj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     * parentPath - {String}解析方法拼去，这里使用"capabilities"。
     * 
     */
	runChildNodes: function(obj, node, parentPath) {
        var children = node.childNodes;
        var childNode, processor;
        for(var i=0; i<children.length; ++i) {
            childNode = children[i];
            if(childNode.nodeType == 1) {
                processor = this["read_" + parentPath + "_" + childNode.nodeName];
                if(processor) {
                    processor.apply(this, [obj, childNode]);
                }
            }
        }
    },
	
	/**
     * Method: read_capabilities_Name
     * 解析节点为Name的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Name: function(capabilitiesObj, node){
		var name = this.getChildValue(node);
        if(name) {
            capabilitiesObj.name = name;
        }
	},
	
	/**
     * Method: read_capabilities_Service
     * 解析节点为Service的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Service: function(capabilitiesObj, node){
		var service = this.getChildValue(node);
        if(service) {
            capabilitiesObj.service = service;
        }
	},
	
	/**
     * Method: read_capabilities_Version
     * 解析节点为Version的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Version: function(capabilitiesObj, node){
		var version = this.getChildValue(node);
        if(version) {
            capabilitiesObj.version = version;
        }
	},
	
	/**
     * Method: read_capabilities_Abstract
     * 解析节点为Abstract的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Abstract: function(capabilitiesObj, node){
		var abstractValue = this.getChildValue(node);
        if(abstractValue) {
            capabilitiesObj.abstractValue = abstractValue;
        }
	},
	
	/**
     * Method: read_capabilities_ServerAddress
     * 解析节点为ServerAddress的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_ServerAddress: function(capabilitiesObj, node){
		var serverAddress = this.getChildValue(node);
        if(serverAddress) {
            capabilitiesObj.serverAddress = serverAddress;
        }
	},
	
	/**
     * Method: read_capabilities_OperationList
     * 解析节点为OperationList的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_OperationList: function(capabilitiesObj, node){
		var operationsNode = node.getElementsByTagName("Operations");
		if(operationsNode.length > 0){
			this.read_capabilities_OperationList_Operations(capabilitiesObj, operationsNode[0]);
		}
	},	
	
	/**
     * Method: read_capabilities_OperationList_Operations
     * 解析节点为Operations的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_OperationList_Operations: function(capabilitiesObj, node){
		var operationList = {};
		var operations = {};
		this.runChildNodes(operations, node, "capabilities_OperationList_Operations");
		operationList.operations = operations;
		capabilitiesObj.operationList = operationList;
	},	
	
	/**
     * Method: read_capabilities_OperationList_Operations_GetTile
     * 解析节点为GetTile的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_OperationList_Operations_GetTile: function(operations, node){
		var getTile = {};
		var format = [];
		var formatNode = node.getElementsByTagName("Format");
		if (formatNode.length > 0) {
			for(var i = 0; i < formatNode.length; i++){
				var formatValue = this.getChildValue(formatNode[i]);
				format.push(formatValue);
			}
			getTile.format = format;
		}
		operations.getTile = getTile;
	},
	
	/**
     * Method: read_capabilities_Data
     * 解析节点为Data的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data: function(capabilitiesObj, node){
		var tileDataNode = node.getElementsByTagName("TileData");
		if(tileDataNode.length > 0){
			this.read_capabilities_Data_TileData(capabilitiesObj, tileDataNode[0]);
		}
	},
	
	/**
     * Method: read_capabilities_Data_TileData
     * 解析节点为Data_TileData的节点。
     *
     * Parameters:
     * capabilitiesObj - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData: function(capabilitiesObj, node){
		var tileData = {}
		this.runChildNodes(tileData, node, "capabilities_Data_TileData");
		capabilitiesObj.tileData = tileData;
	},
	
	/**
     * Method: read_capabilities_Data_TileData_Tile
     * 解析节点为Tile的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_Tile: function(tileData, node){
		var tile = this.getChildValue(node);
        if(tile) {
            tileData.tile = tile;
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_CRS
     * 解析节点为CRS的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_CRS: function(tileData, node){
		var crs = this.getChildValue(node);
        if(crs) {
            tileData.crs = crs;
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_BoundBox
     * 解析节点为BoundBox的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_BoundBox: function(tileData, node){
		
		var boundBox = new Geo.Bounds(
			parseFloat(node.getAttribute("minx") || node.getAttribute("minX")),
			parseFloat(node.getAttribute("miny") || node.getAttribute("minY")),
			parseFloat(node.getAttribute("maxx") || node.getAttribute("maxX")),
			parseFloat(node.getAttribute("maxy") || node.getAttribute("maxY"))
		);
        tileData.boundBox = boundBox;
        
	},
	
	/**
     * Method: read_capabilities_Data_TileData_LevelZeroTileSizeX
     * 解析节点为LevelZeroTileSizeX的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_LevelZeroTileSizeX: function(tileData, node){
		var levelZeroTileSizeX = this.getChildValue(node);
        if(levelZeroTileSizeX) {
            tileData.levelZeroTileSizeX = parseInt(levelZeroTileSizeX);
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_LevelZeroTileSizeY
     * 解析节点为LevelZeroTileSizeY的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_LevelZeroTileSizeY: function(tileData, node){
		var levelZeroTileSizeY = this.getChildValue(node);
        if(levelZeroTileSizeY) {
            tileData.levelZeroTileSizeY = parseInt(levelZeroTileSizeY);
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_TopLevel
     * 解析节点为TopLevel的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_TopLevel: function(tileData, node){
		var topLevel = this.getChildValue(node);
        if(topLevel) {
            tileData.topLevel = parseInt(topLevel);
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_BottomLevel
     * 解析节点为BottomLevel的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_BottomLevel: function(tileData, node){
		var bottomLevel = this.getChildValue(node);
        if(bottomLevel) {
            tileData.bottomLevel = parseInt(bottomLevel);
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_TileVersionTime
     * 解析节点为TileVersionTime的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_TileVersionTime: function(tileData, node){
		var tileVerstionTime = this.getChildValue(node);
		if(tileVerstionTime){
			if(!tileData.tileVerstionTime){
				tileData.tileVerstionTime = []
			}
			tileData.tileVerstionTime.push(tileVerstionTime);
		}
	},
	
	/**
     * Method: read_capabilities_Data_TileData_TilePixelsX
     * 解析节点为TilePixelsX的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_TilePixelsX: function(tileData, node){
		var tilePixelsX = this.getChildValue(node);
        if(tilePixelsX) {
            tileData.tilePixelsX = parseInt(tilePixelsX);
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_TilePixelsY
     * 解析节点为TilePixelsY的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_TilePixelsY: function(tileData, node){
		var tilePixelsY = this.getChildValue(node);
        if(tilePixelsY) {
            tileData.tilePixelsY = parseInt(tilePixelsY);
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_CacheExpireTime
     * 解析节点为CacheExpireTime的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_CacheExpireTime: function(tileData, node){
		var cacheExpireTime = this.getChildValue(node);
        if(cacheExpireTime) {
            tileData.cacheExpireTime = parseInt(cacheExpireTime);
        }
	},
	
	/**
     * Method: read_capabilities_Data_TileData_Pyramid
     * 解析节点为Pyramid的节点。
     *
     * Parameters:
     * tileData - {Object} 最终返回的对象。
     * node - {DOMElement} 需要解析的节点对象。
     */
	read_capabilities_Data_TileData_Pyramid: function(tileData, node){
        var parser = new Geo.Util.Format.Pyramid();
		var pyramidObj = parser.read(node);
		tileData.pyramid = pyramidObj;
	},
	
	CLASS_NAME:"Geo.Util.Format.GlobeTileCapabilities"
});