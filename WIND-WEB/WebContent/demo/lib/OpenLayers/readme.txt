OpenLayers 2.11裁减类清单：

"OpenLayers/Marker/Box.js"
"OpenLayers/Layer/VirtualEarth.js"
"OpenLayers/Layer/Yahoo.js"
"OpenLayers/Layer/MapGuide.js"
"OpenLayers/Layer/MapServer.js"
"OpenLayers/Layer/MapServer/Untiled.js"
"OpenLayers/Layer/KaMap.js"
"OpenLayers/Layer/KaMapCache.js"
"OpenLayers/Layer/MultiMap.js"
"OpenLayers/Layer/WorldWind.js"

"OpenLayers/Layer/GeoRSS.js"
"OpenLayers/Layer/Boxes.js"
"OpenLayers/Layer/XYZ.js"
"OpenLayers/Layer/Bing.js"
"OpenLayers/Layer/TMS.js"
"OpenLayers/Layer/TileCache.js"
"OpenLayers/Layer/Zoomify.js"
"OpenLayers/Layer/ArcGISCache.js"
"OpenLayers/Control/MouseDefaults.js"
"OpenLayers/Geometry/Surface.js"

"OpenLayers/Protocol/SQL.js"
"OpenLayers/Protocol/SQL/Gears.js"
"OpenLayers/Protocol/SOS.js"
"OpenLayers/Protocol/SOS/v1_0_0.js"
"OpenLayers/Format/Atom.js"
"OpenLayers/Format/KML.js"
"OpenLayers/Format/GeoRSS.js"
"OpenLayers/Format/OSM.js"
"OpenLayers/Format/GeoJSON.js"
"OpenLayers/Format/SOSCapabilities.js"

"OpenLayers/Format/SOSCapabilities/v1_0_0.js"
"OpenLayers/Format/SOSGetFeatureOfInterest.js"
"OpenLayers/Format/SOSGetObservation.js"
"OpenLayers/Control/MouseToolbar.js"
==============================================================================================
OpenLayers 2.11源码修改清单：
1."OpenLayers/Format/WFSDescribeFeatureType.js"
第112行变动。在读取元素的type属性的时候，如果type属性不存在，则程序将会在123行报错，
由于元素的类型可能引用其他地方的类型，所以，有时候不用type而用ref，因此代码第115行代码做如下调整:
变var type = element.type为var type = element.type || element.ref;

2."OpenLayers/Format/GML.js"
在解析GML格式时，考虑了要素类型带名字空间的情况（如:globe:road），如果不带名字空间前缀时会出错。
第193行变动。原始代码：
feature.gml = {
    featureType: node.firstChild.nodeName.split(":")[1],
    featureNS: node.firstChild.namespaceURI,
    featureNSPrefix: node.firstChild.prefix
};
修改后：
var featureType = node.firstChild.nodeName.split(":")[1] ?
                        node.firstChild.nodeName.split(":")[1]:node.firstChild.nodeName.split(":")[0];
feature.gml = {
    featureType: featureType,
    featureNS: node.firstChild.namespaceURI,
    featureNSPrefix: node.firstChild.prefix
};


3."OpenLayers/Layer/WMTS.js"
参照OGC WMTS的规范，REST方式瓦片请求地址中不能包含服务版本信息。
第396行。原始代码：var path = this.version + "/" + this.layer + "/" + this.style + "/";
修改为：var path = this.layer + "/" + this.style + "/";

4."OpenLayers/Tile/Image.js"
解决地图缩放时的过渡效果
原始代码：
269行：this.backBufferTile.resolution = this.layer.getResolution();
522行：ratio = this.backBufferTile.resolution / this.layer.getResolution();
修改为：
269行：this.backBufferTile.resolution = this.layer.map.getResolution();
522行：ratio = this.backBufferTile.resolution / this.layer.map.getResolution();

5."OpenLayers/Format/Filter/v1.js"
增加Filter标准中对SortBy标签的解析
在OpenLayers\lib\OpenLayers\Format\Filter\v1.js中writers方法的450行后添加以下代码：
            "SortBy": function(sortProperties) {
                var node = this.createElementNSPlus("ogc:SortBy");
                for (var i=0,l=sortProperties.length;i<l;i++) {
                    this.writeNode(
                        "ogc:SortProperty",
                        sortProperties[i],
                        node
                    );
                }
                return node;
            },
            "SortProperty": function(sortProperty) {
                var node = this.createElementNSPlus("ogc:SortProperty");
                this.writeNode(
                    "ogc:PropertyName",
                    sortProperty,
                    node
                );
                this.writeNode(
                    "ogc:SortOrder",
                    (sortProperty.order == 'DESC') ? 'DESC' : 'ASC',
                    node
                );
                return node;
            },
            "SortOrder": function(value) {
                var node = this.createElementNSPlus("ogc:SortOrder", {
                    value: value
                });
                return node;
            }
            
6."OpenLayers/Format/WFST/v1_0_0.js"
增加WFST解析器中对sortBy参数的处理
在OpenLayers\lib\OpenLayers\Format\WFST\v1_0_0.js中164行后添加以下代码：
                if (options.sortBy) {
                    this.writeNode("ogc:SortBy", options.sortBy, node);
                }
                
// 141~144这四行代码，是处理typeName在post请求中的值： typeName="feature:..."
// 因为带有"feature:"，服务处理后，查不出数据，所以这四行代码改为Openlayers2.10的写法。
原始代码：
                    attributes: {
                        typeName: (prefix ? prefix + ":" : "") +
                            options.featureType
                    }
修改为：
					attributes: {
                        typeName: (options.featureNS ? prefix + ":" : "") +
                            options.featureType
                    }
                    
7."OpenLayers/Layer/Grid.js"
修正图层瓦片偏移的问题
在OpenLayers\lib\OpenLayers\Layer\Grid.js中442行修改以下代码：
	var extent = this.getMaxExtent();
修改为：
	var extent = this.map.maxExtent;
                