/**
 * Class: Geo.Service.WFST
 * OGC-WFST服务类。Web要素服务-T（Web Feature Service-Transaction简称WFST）遵循OGC的WFS1.0.0规范，
 * 本服务提供对要素的增加、修改、删除等事务操作。
 *
 * Inherits from:
 * - <Geo.Service>
 */
Geo.Service.WFST = Geo.Class(Geo.Service, {

    /**
     * Constructor: Geo.Service.WFST
     * Geo.Service.WFST类的构造函数。
     *
     * Parameters:
     * name - {String} 服务名称。
     * url - {String} 服务地址。
     * options - {Object} 实例的选项设置，此参数可选。
     */
    initialize: function(name, url, options){
        Geo.Service.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * APIMethod: getCapabilities
     * 获取服务能力描述信息。
     *
     * Parameters:
     * successFn - {Function} 请求成功的回调函数。
     * failFn - {Function} 请求失败的回调函数。
     */
    getCapabilities: function(successFn, failFn){
        var url = this.url;
        var params = {
            REQUEST: "GetCapabilities",
            SERVICE: "WFS",
            VERSION: "1.0.0"
        };
        if (!failFn) {
            failFn = function(){
                this.failFn(params.REQUEST);
            };
        }
        OpenLayers.loadURL(url, params, this, function(result){
            successFn(result);
        }, failFn);
    },
    
    /**
     * APIMethod: isExist
     * 将向服务发送“GetCapabilities”同步请求，以检测服务是否存在。
     * 注意，本方法只能验证服务是否存在，并不能保证实际功能完全正常。
     *
     * Returns:
     * {Boolean} 服务是否存在。
     */
    isExist: function(){
        var isExist = false;
        var url = this.url;
        var params = {
            REQUEST: "GetCapabilities",
            SERVICE: "WFS"
        };
        var xhr = OpenLayers.Request.GET({
            url: url,
            params: params,
            scope: this,
            async: false,
            success: function(){
                isExist = true;
            }
        });
        return isExist;
    },
    
    /**
     * APIMethod: describeFeatureType
     * 获取要素类型描述操作。
     *
     * Parameters:
     * params - {Object} 请求参数，具体内容参考OGC-WFS标准。
     *   params有三个参数(service,version,request)默认可以不填，其中version默认值是1.0.0，如果要设置其他版本请设置version参数。
     * successFn - {Function} 请求成功的回调函数。
     * failFn - {Function} 请求失败的回调函数。
     *
     * 示例：
     * (code)
     * serviceObj.describeFeatureType({
     *     TypeName: "RES1_T_PN"
     * }, showResult);
     * (end)
     */
    describeFeatureType: function(params, successFn, failFn){
        var url = this.url;
        var DEFAULT_PARAMS = {
            SERVICE: "WFS",
            VERSION: "1.0.0",
            REQUEST: "DescribeFeatureType"
        };
        OpenLayers.Util.applyDefaults(params, DEFAULT_PARAMS);
        
        if (!failFn) {
            failFn = function(){
                this.failFn(params.REQUEST);
            };
        }
        
        OpenLayers.loadURL(url, params, this, function(result){
            successFn(result);
        }, failFn);
    },
    
    /**
     * APIMethod: getFeature
     * 获取要素操作。
     *
     * Parameters:
     * params - {Object} 请求参数，具体内容参考OGC-WFS标准。
     * 	TypeName - {String} 必选 类型名称。
     * 	version - {String} 版本，默认值是1.0.0,如果用户请求的服务版本不是1.0.0，请设置该参数。
     *  MaxFeatures - {Integer} 可选 查询的返回的结果总数。
     *  filter - {Geo.Filter} 可选 过滤器。
     *  以上是常用的属性，其他属性请参考OGC-WFS标准。
     * successFn - {Function} 请求成功的回调函数。
     * failFn - {Function} 请求失败的回调函数。
     *
     * 示例:
     * (code)
     * 	 serviceObj.getFeature({
     *      TypeName: "RES1_T_PN",
     *      MaxFeatures: 10
     *   }, function(){});
     * (end)
     */
    getFeature: function(params, successFn, failFn){
        var url = this.url;
        var DEFAULT_PARAMS = {
            SERVICE: "WFS",
            VERSION: "1.0.0",
            REQUEST: "GetFeature"
        };
        OpenLayers.Util.applyDefaults(params, DEFAULT_PARAMS);
        
        if (!failFn) {
            failFn = function(){
                this.failFn(params.REQUEST);
            };
        }
        
        OpenLayers.loadURL(url, params, this, function(result){
            successFn(result);
        }, failFn);
    },
    
    /**
     * APIMethod: lockFeature
     * 锁定要素操作。
     *
     * Parameters:
     * params - {Object} 请求参数，具体内容参考OGC-WFS标准。
     * 	typeName - {String} 必选 指定操作的图层类型名称。
     * 	version - {String} 可选 版本号，默认值是1.0.0，如果用户请求的服务版本不是1.0.0，请设置该参数。
     *  expiry - {Number} 可选 锁定的分钟数，如果没有则默认为1分钟。
     *  lockAction - {String} 可选 指定如何获得锁，如果没有则默认为"ALL"。
     *  filter - {Geo.Filter} 可选 操作要素的条件过滤器。
     * successFn - {Function} 请求成功的回调函数。
     * failFn - {Function} 请求失败的回调函数。
     */
    lockFeature: function(params, successFn, failFn){
        var url = this.url;
        var DEFAULT_PARAMS = {
            service: "WFS",
            version: "1.0.0",
            request: "LockFeature",
            expiry: 1,
            lockAction: "ALL"
        };
        OpenLayers.Util.applyDefaults(params, DEFAULT_PARAMS);
        
		//解析filter对象，转换为XML字符串。
		var filterXMLString = this._parserFilterToString(params.filter);
        
        var requestStringTemplate = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<LockFeature version="${version}" service="${service}" lockAction="${lockAction}" expiry="${expiry}" ' +
	        'xmlns:wfs=" http://www.opengis.net/wfs" ' +
	        'xmlns:gml=" http://www.opengis.net/gml" ' +
	        'xmlns:myns=" http://www.someserver.com/myns" ' +
	        'xmlns:ogc=" http://www.opengis.net/ogc" ' +
	        'xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance" ' +
	        'xsi:schemaLocation="http://www.opengis.net/wfs ../wfs/1.1.0/WFS.xsd">' +
	        '<Lock typeName="${typeName}">' +
		        '${filterXMLString}' +
	        '</Lock>' +
        '</LockFeature>';
        
        var requestString = OpenLayers.String.format(requestStringTemplate, {
            version: params.version,
            service: params.service,
            lockAction: params.lockAction,
            expiry: params.expiry,
            typeName: params.typeName,
            filterXMLString: filterXMLString
        });
        
        
        if (!failFn) {
            failFn = function(){
                this.failFn(params.request);
            };
        }
        
        var xhr = new OpenLayers.Request.POST({
            url: this.url,
            data: requestString,
            scope: this,
            success: successFn,
            failure: failFn
        });
        
        //        OpenLayers.loadURL(url, params, this, function(result){
        //            successFn(result);
        //        }, failFn);
    },
    
    /**
     * APIMethod: transaction
     * 要素的事务操作，可以对服务中的要素内容进行增加、删除和修改操作。
     *
     * Parameters:
     * params - {Object} 请求参数，具体内容参考OGC-WFS标准。
     * 	version - {String} 可选 版本号，默认值是1.0.0，如果用户请求的服务版本不是1.0.0，请设置该参数。
     * 	releaseAction - {String} 可选 指定如何释放锁，提供有"ALL"和"SOME"两种方式，默认值是"ALL"。
     *             在做更新或删除要素的时候，releaseAction="ALL"或"SOME"决定LockId对应的所有要素是否全部释放。
     *             如果是"ALL",表示LockId对应的所有要素全部解锁释放。
     *             如果是"SOME",表示LockId只对正在操作的要素解锁释放，其他要素还是保持锁定状态。
     *  lockId - {String} 可选 锁定编号。
     * inserts - {Object} 添加要素的请求参数。
     *  features - {Array(<Geo.Feature.Vector>)} 必选 一系列要素的集合。
     *  typeName - {String} 必选 指定操作的图层类型名称。
     * updates - {Object} 修改要素的请求参数。
     *  feature - {<Geo.Feature.Vector>} 必选 要素对象。
     *  typeName - {String} 必选 指定操作的图层类型名称。
     *  filter - {Geo.Filter} 可选 操作要素的条件过滤器。
     * deletes - {Object} 删除要素的请求参数。
     *  typeName - {String} 必选 指定操作的图层类型名称。
     *  filter - {Geo.Filter} 可选 操作要素的条件过滤器。
     * successFn - {Function} 请求成功的回调函数。
     * failFn - {Function} 请求失败的回调函数。
     */
    transaction: function(params, inserts, updates, deletes, successFn, failFn){
		var url = this.url;
		//默认参数
        var DEFAULT_PARAMS = {
            service: "WFS",
            version: "1.0.0",
            request: "Transaction",
            releaseAction: "ALL"
        };
		//合并默认参数，获得实际请求参数
		OpenLayers.Util.applyDefaults(params, DEFAULT_PARAMS);
		
		//定义post请求模板
		var requestStringTemplate = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<wfs:Transaction releaseAction="${releaseAction}" handle="Transaction 01" version="${version}" service="${service}" '+
		'xmlns="http://www.someserver.com/myns" ' +
		'xmlns:gml="http://www.opengis.net/gml" ' +
		'xmlns:ogc="http://www.opengis.net/ogc" ' +
		'xmlns:wfs="http://www.opengis.net/wfs" ' +
		'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	        '${lockIdString}' +
	        '${transactionString}' +
        '</wfs:Transaction>';
		
		//lockId的请求标签
        var lockId = params.lockId;
		var lockIdString = "";
		if(lockId){
			lockIdString += '<LockId>' + lockId + '</LockId>';
		}
		
		var transactionString = "";
		//添加
        if (inserts) {
            transactionString += this._getInsertString(inserts);
        }
		//修改
		if(updates){
			transactionString += this._getUpdateString(updates);
		}
		//删除
		if(deletes){
			transactionString += this._getDeleteString(deletes);
		}
		
		//根据模板，获得post请求串
        var requestString = OpenLayers.String.format(requestStringTemplate, {
            releaseAction: params.releaseAction,
            version: params.version,
            service: params.service,
            lockIdString: lockIdString,
            transactionString: transactionString
        });
		
		//请求失败的回调函数
		if (!failFn) {
            failFn = function(){
                this.failFn(params.request);
            };
        }
		
		//发送post请求
		var xhr = new OpenLayers.Request.POST({
            url: url,
            data: requestString,
            scope: this,
            success: successFn,
            failure: failFn
        });
	},
	
	/**
     * Method: _getInsertString
     * 获取插入的XML字符串。 
     * 
     * Parameters:
     * insert - {object} 添加要素的参数对象。
     *
     * Returns:
     * {String} 返回插入的XML字符串。
	 */
    _getInsertString: function(inserts){
		var features = inserts.features;
		var typeName = inserts.typeName;
		var insertStr = "";
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            insertStr += '<wfs:Insert handle="Insert ' + i + '">' +
			this._getInsertFeatureString(feature, typeName) +
			'</wfs:Insert>';
        };
		return insertStr;
	},
	
	/**
     * Method: _getInsertFeatureString
     * 获取保存要素所需的外部属性串。 
     * 
     * Parameters:
     * feature - {<Geo.Feature.Vector>} 要素。
     * typeName - {String} 指定操作的图层类型名称。
     *
     * Returns:
     * {String} 返回保存要素所需的外部属性串。
	 */
    _getInsertFeatureString: function(feature, typeName){
			        
        var str = "";
        
        var featureTemplate = '<${typeName}>${content}</${typeName}>';
        var geoTemplate = "<GEOMETRY>${geometry}</GEOMETRY>";
        
        var attrTemplate = "<${tag}><![CDATA[${value}]]></${tag}>"
        
        for (var item in feature.data) {
            if (item == "OID") {
                continue;
            }
            str += OpenLayers.String.format(attrTemplate, {
                value: (feature.data[item] ? feature.data[item] : ""),
                tag: item
            });
        }
        str += OpenLayers.String.format(geoTemplate, {
            geometry: this._getGeometryString(feature)
        });
        
        str = OpenLayers.String.format(featureTemplate, {
            typeName: typeName,
            content: str
        });
        return str;
    },
	
	/**
     * Method: _getUpdateString
     * 获取插入的XML字符串。 
     * 
     * Parameters:
     * updates - {object} 修改要素的参数对象。
     *
     * Returns:
     * {String} 返回XML字符串。
	 */
    _getUpdateString: function(updates){
        var filter = updates.filter;
        var typeName = updates.typeName;
        var feature = updates.feature;
        
        //要素的要修改的属性和值的XML字符串
        var propertyString = this._getUpdatePropertyString(feature);
        //解析filter对象，转换为XML字符串。
        var filterXMLString = this._parserFilterToString(filter);
        var updateStr = '<wfs:Update typeName="' + typeName + '" handle="Update 1">' +
	        propertyString +
	        filterXMLString +
        '</wfs:Update>';
        
        return updateStr;
    },
	
	/**
     * Method: _getUpdatePropertyString
     * 获取修改的要素属性的XML字符串。 
     * 
     * Parameters:
     * feature - {<Geo.Feature.Vector>} 要素。
     *
     * Returns:
     * {String} 返回修改的要素属性的XML字符串。
	 */
    _getUpdatePropertyString: function(feature){
        var str = "";
        for (var item in feature.data) {
            if (item == "OID") {
                continue;
            }
            str += '<wfs:Property>' +
	            '<wfs:Name><![CDATA[' +
	            item +
	            ']]></wfs:Name>' +
	            '<wfs:Value><![CDATA[' +
	            (feature.data[item] ? feature.data[item] : "") +
	            ']]></wfs:Value>' +
            '</wfs:Property>';
        }
        str += '<wfs:Property>' +
	        '<wfs:Name>Geometry</wfs:Name>' +
	        '<wfs:Value>' +
	        this._getGeometryString(feature) +
	        '</wfs:Value>' +
        '</wfs:Property>';
        return str;
    },
	
	/**
     * Method: _getGeometryString
     * 获取要素geometry的XML字符串。 
     * 
     * Parameters:
     * feature - {<Geo.Feature.Vector>} 要素。
     *
     * Returns:
     * {String} 返回修改的要素geometry的XML字符串。
	 */
	_getGeometryString: function(feature){
        var  geometryNode =new OpenLayers.Format.GML().buildGeometryNode(feature.geometry);
       	var str = geometryNode.xml?geometryNode.xml:geometryNode.outerHTML;
        return str;
    },
	
	/**
     * Method: _getDeleteString
     * 获取插入的XML字符串。 
     * 
     * Parameters:
     * deletes - {object} 删除要素的参数对象。
     *
     * Returns:
     * {String} 返回插入的XML字符串。
	 */
    _getDeleteString: function(deletes){
        var filter = deletes.filter;
        var typeName = deletes.typeName;
        
        //解析filter对象，转换为XML字符串。
        var filterXMLString = this._parserFilterToString(filter);
        
        var deleteStr = "";
        deleteStr += '<wfs:Delete typeName="' + typeName + '" handle="Delete 1">';
        deleteStr += filterXMLString;
        deleteStr += '</wfs:Delete>';
        return deleteStr;
    },
	
	/**
     * Method: _parserFilterToString
     * 解析filter对象，转换为XML字符串。
     * 
     * Parameters:
     *  filter - {<Geo.Filter>} 可选 操作要素的条件过滤器。
     *
     * Returns:
     * {String} 过滤器字符串。
	 */
    _parserFilterToString: function(filter){
		//解析filter对象，转换为XML字符串。
		var filterXMLString = "";
        if (filter) {
            var filterFormatter = new Geo.Format.Filter.v1();
            var result = filterFormatter.write(filter);//{DOMElement} An ogc:Filter element.
            filterXMLString = result.xml?result.xml:result.outerHTML;
        }
		return filterXMLString;
	},
	
    CLASS_NAME: "Geo.Service.WFST"
});
