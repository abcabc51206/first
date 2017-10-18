(function($,exports){
	var MarkQuery = function(options){
			this.init(options);
			return this;
	}
	MarkQuery.prototype = {
	 		wftQuery:null,//wfs查询
	 		wfstObj:null,//wfst增删改
	 		page:{
				pageSize:10,
				pageNum:1
			},
			init:function(options){
				this.initWFST(options);
			},
			initWFST:function(options){
				var url = options.url;
				var markLayers = options.markLayers;
	 			var wftQuery = new Geo.Query.WFSQuery(url,markLayers.pointLayer,{
				                                       });	
				var wfstObj = new Geo.Service.WFST("WFS-T服务",url);	
				this.wftQuery =wftQuery ;
				this.wfstObj =wfstObj ;
			},
			//分页查询
			queryPage:function(filter,page,successFn,failFn){
				    var that = this;
					filter = filter||this.filter;
					this.filter = filter;
					page = page||this.page;
					this.page = page;
					this.wftQuery.queryPage(filter,$.proxy(function(features){
						                                   if(successFn){successFn(features);}
					                                   },this),failFn,{
					                                   	perPageNumber:page.pageSize,
					                                   	pageNumber:page.pageNum
					                                   }
					); 	
			},
			//查询总数
		   queryTotal:function(filter,successFn,failFn){
				filter = filter||this.filter;
				this.filter = filter;
				this.wftQuery.maxFeatures = null;
				this.wftQuery.queryTotalNumber(filter,$.proxy(function(result){
						                             if(successFn){successFn(result.numberOfFeatures);}
				},this),failFn);	
			},
			//限定查询
			query:function(filter,successFn,failFn){
		   		 var that = this;
		   		 
		   		 this.wftQuery.maxFeatures = null;
				 this.wftQuery.query(filter,$.proxy(function(features){
				 									   features = that.featureToMark(features);
					                                   if(successFn){successFn(features);}
				 },this),failFn);  
	  		},
	  		// 将标绘服务查询后的结果  转换成 页面数据 结构
			featureToMark:function(features){
				for(var i=0;i<features.length;i++){
		            var text = $.evalJSON(features[i].attributes["TEXT"]);
				 	features[i].attributes.TITLE = text.title;
               	 	features[i].attributes.SUPPLYINFO = text.supplyinfo;
               	 	features[i].attributes.VERFYINFO = text.verifyinfo,
                    features[i].attributes.STATUS = text.status;
                    features[i].attributes.ICONPATH = text.iconpath;
                    features[i].attributes.TYPE = text.type;
                    features[i].attributes.DATE = text.date;
				}
				return features;
		    },
			showPage:function(page,features){
				this.trigger("showPage",{page:page,total:this.length});
			},
			//添加
            addFeatures:function(params,inserts,successFn,failFn){
            	this.wfstObj.transaction(params, inserts, null, null, function(result){
            			var responseXML = result.responseXML;
						if(!responseXML) {
							var responseText = result.responseText;
							if(typeof responseText == "string"){
					        	responseXML = OpenLayers.Format.XML.prototype.read.apply(this, [responseText]);
					        }
					    }
            			var nodes = responseXML.getElementsByTagName("ogc:FeatureId");
            			var oid;
            			if(nodes.length>0){
            				oid = nodes[0].attributes.getNamedItem("fid").value;
	            			var oidArr = oid.split(".");
	            			oid = oidArr[oidArr.length-1];
            			}
            			if(successFn){successFn(oid);}
            		},function(result){
            			if(failFn){failFn(result);}
            		});
            },
			//修改
            updateFeatures:function(params,updates,successFn,failFn){
            	this.wfstObj.transaction(params, null, updates, null, function(result){
            			var responseXML = result.responseXML;
						if(!responseXML) {
							var responseText = result.responseText;
							if(typeof responseText == "string"){
					        	responseXML = OpenLayers.Format.XML.prototype.read.apply(this, [responseText]);
					        }
					    }
            			var nodes = responseXML.getElementsByTagName("wfs:SUCCESS");
            			if(nodes.length>0){
            				result = true;
            			}else{
            				result = false;
            			}
            			if(successFn){successFn(result);}
            		},function(result){
            			if(failFn){failFn(result);}
            		});
            },
			//删除
            deleteFeatures:function(params,deletes,successFn,failFn){
            	this.wfstObj.transaction(params, null, null, deletes, function(result){
            			var responseXML = result.responseXML;
						if(!responseXML) {
							var responseText = result.responseText;
							if(typeof responseText == "string"){
					        	responseXML = OpenLayers.Format.XML.prototype.read.apply(this, [responseText]);
					        }
					    }
            			var nodes = responseXML.getElementsByTagName("wfs:SUCCESS");
            			if(nodes.length>0){
            				result = true;
            			}else{
            				result = false;
            			}
            			if(successFn){successFn(result);}
            		},function(result){
            			if(failFn){failFn(result);}
            		});
            }
		};
		exports.MarkQuery = MarkQuery;
})(jQuery,window);