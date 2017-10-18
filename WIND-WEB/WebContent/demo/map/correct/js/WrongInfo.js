﻿(function($,exports){
	    var WrongInfo = {};
		WrongInfo.Model = function(){
			this.init();
			return this;
		}
		WrongInfo.Model.prototype = {
			wrongInfoFea:null,
			plot:null,
			lockId:"",
			markLayers:null,
			init:function(){
				
			},
			setWrongInfoFea:function(wrongInfoFea){
				this.wrongInfoFea = wrongInfoFea;
			},
			getWrongInfoFea:function(){
				return this.wrongInfoFea;
			},
			setPlot:function(plot,markLayers){
				this.markLayers = markLayers;
				this.plot = plot;
			},
			getPlot:function(){
				return this.plot;
			},
			/*
			 * 查找没有处理的 纠错点
			 */
			getWrongInfoFeaListByNoHandle:function(successFn,failFn){
			    /*
				 * 查找
				 */
				if(this.getPlot()){
					var filter = this.compositionFilter({"status":0});
					this.getPlot().query(filter,successFn,failFn);
				}
			},
			/*
			 * 查找处理过的 纠错点
			 */
			getWrongInfoFeaListByHandle:function(successFn,failFn){
			    /*
				 * 查找
				 */
				if(this.getPlot()){
					var filter = this.compositionFilter({"status":1});
					this.getPlot().query(filter,successFn,failFn);
				}
			},
			 // 组装 filter
		   compositionFilter:function(option){
		   		var strArr = [];
		   		for(var tag in option){
		   			var str = tag+"\":\""+option[tag];
		   			strArr.push(str);
		   		}
				var filter = new Geo.Filter.Comparison({
				        type: Geo.Filter.Comparison.LIKE,
				        property: "TEXT",
				        value: "*"+strArr.join("\",\"")+"*"
			    });
				return filter;
		   }, 
			/*
			 *     删除标绘
			 */
			deleteWrongInfoFea:function(oid,successFn,failFn){
				var params = {
					releaseAction: "ALL",
					lockId: this.lockId
				};
				var filter = new Geo.Filter.FeatureId({fids: [this.typeName + "."+oid]});
				var deletes = {
					filter: filter,
					typeName: this.markLayers.pointLayer
				};
				if(this.getPlot()){
					this.getPlot().deleteFeatures(params,deletes,successFn,failFn);					
				}
			},
			/*
			 * 审核 纠错
			 */
			 
			publishWrongInfoFea:function(wrongFea,verify,successFn,failFn){
				var params = {
					releaseAction: "ALL",
					lockId: this.lockId
				};
				var updates = this.updataFilter(wrongFea,{"status":"1","verifyinfo":verify});
				if(this.getPlot()){
					this.getPlot().updateFeatures(params,updates,successFn,failFn);					
				}				
			},
			//修改的属性
			updataFilter:function(wrongFea,option){
				var text = $.evalJSON(wrongFea.attributes["TEXT"]);
				var oid = wrongFea.attributes["OID"];
				for(var tag in option){
					text[tag] = option[tag];
				}
				var data = {TEXT:$.toJSON(text)};
				wrongFea.data = data;
				wrongFea.attributes = data;
				var filter = new Geo.Filter.FeatureId({fids: [this.typeName + "."+oid]});
				var updates = {
					feature: wrongFea,
					filter: filter,
					typeName: this.markLayers.pointLayer
				};
				return updates;
				
			}
						
		}
		WrongInfo.View = function(_map){
			var map;
			this.setMap = function(_map){
				map = _map;
			}
			this.getMap = function(){
				return map;
			}
			this.init(_map);
			var model;
			this.setModel = function(_model){
				model = _model;
			}
			this.getModel = function(){
				return model;
			}
			return this;
		}
		WrongInfo.View.prototype = {
			vectorLayer:null,
			pointMakerControl:null,
			wrongFeaList:[],
			currentWrongFea:[],
			page:{
				perPage:3,
				totalPage:0,
				currentPage:1,
				totalNum:0
			},
			init:function(_map){
				this.setMap(_map);
				this.getMap();
				this.initVectorLayer();
				//this.initControl();
			},
			initVectorLayer:function(){
				var _vectorLayer = new Geo.View2D.Layer.Vector("wrong");
				this.vectorLayer = _vectorLayer;
				this.getMap().addOverLayer(_vectorLayer);
			},
			initControl:function(){
				var that = this;
				var pointMakerControl=  new OpenLayers.Control.DrawFeature(this.vectorLayer,OpenLayers.Handler.Point,
				                                                           {featureAdded:function(feature){
				                                                           	         that.vectorLayer.removeFeatures([feature]);
				                                                           	         that.getModel().setWrongInfoFea(feature);
				                                                           	         //window.open('wrong.html','newPage','toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no');
				                                                           	         //window.location.href="wrong.html";
				                                                           	         window.open("wrong.html?lon="+feature.geometry.x+"&lat="+feature.geometry.y+"&z="+that.getMap().getZoom());
				                                                           	         that.pointMakerControl.deactivate();
				                                                           	     }
				                                                           });
				var _styleMap = new OpenLayers.StyleMap({
						    "default": new OpenLayers.Style({
									   	    externalGraphic: "../images/mark/noNumberMarker.png",
									    	graphicWidth:27,
											graphicHeight:35,
											graphicXOffset:-8,
											graphicYOffset:-35,
											graphicZIndex:1,
											cursor: "pointer"
								    }) 
				});
				pointMakerControl.handler.layerOptions.styleMap = _styleMap ;
				this.getMap().addControl(pointMakerControl);
				this.pointMakerControl = pointMakerControl;
			},
			showWrongFeaList:function(features){
				
				$("#table > tbody").empty();
				$("#wrongListTmpl").tmpl(features).appendTo("#table > tbody");
				this.currentWrongFea = features;
			},
			showWrongFeaWrongPlace:function(oldfeature,newfeature){
				oldfeature.style={
							   	    externalGraphic: "../images/mark/NumberMarker_s1.png",
							    	graphicWidth:27,
									graphicHeight:35,
									graphicXOffset:-8,
									graphicYOffset:-35,
									graphicZIndex:1,
									cursor: "pointer"
				                }
			   newfeature.style={
							   	    externalGraphic: "../images/mark/noNumberMarker.png",
							    	graphicWidth:27,
									graphicHeight:35,
									graphicXOffset:-8,
									graphicYOffset:-35,
									graphicZIndex:1,
									cursor: "pointer"
				                }
			    this.vectorLayer.addFeatures([oldfeature,newfeature]);
			    var dataExtent = this.vectorLayer.getDataExtent();
		        if(dataExtent){
		            //this.getMap().zoomToExtent(dataExtent);
		        }
		        this.getMap().setCenter(new Geo.LonLat(oldfeature.geometry.x,oldfeature.geometry.y),12);
			},
			showWrongFeaNoExist:function(feature){
				feature.style={
							   	    externalGraphic: "../images/mark/NumberMarker_s1.png",
							    	graphicWidth:27,
									graphicHeight:35,
									graphicXOffset:-8,
									graphicYOffset:-35,
									graphicZIndex:1,
									cursor: "pointer"
				                }
				this.vectorLayer.addFeatures([feature]);
			    var dataExtent = this.vectorLayer.getDataExtent();
		        if(dataExtent){
		          // this.getMap().zoomToExtent(dataExtent);
		        }
		        this.getMap().setCenter(new Geo.LonLat(feature.geometry.x,feature.geometry.y),12);
			},
			deleteWrongInfoFea:function(oid){
				this.getModel().deleteWrongInfoFea(oid,$.proxy(function(result){
					if(!result){TDT.alert("删除失败");return}
					TDT.alert("删除成功");
					for(var i =0;i<this.currentWrongFea.length;i++){
						if(oid==this.currentWrongFea[i].attributes.OID){
							break;
						}
					}
				    this.wrongFeaList.splice((this.page.currentPage-1)*this.page.perPage+i,1);
				    this.changePage();
				    this.trunPage(this.page.currentPage);
				    if($("#poiname_div").css("display")!="none"){
				    	$("#backbtn").click();
				    }
				},this),function(){TDT.alert("删除失败");});
				
			},
			publishWrongInfoFea:function(oid,verify){
				var wrongFea = null;
				for(var i =0;i<this.currentWrongFea.length;i++){
						if(oid==this.currentWrongFea[i].attributes.OID){
							wrongFea = this.currentWrongFea[i];
							break;
						}
				}
				this.getModel().publishWrongInfoFea(wrongFea,verify,$.proxy(function(result){
					if(!result){TDT.alert("审核失败");return}
					TDT.alert("审核成功");
				    this.wrongFeaList.splice((this.page.currentPage-1)*this.page.perPage+i,1);
				    this.changePage();
				    this.trunPage(this.page.currentPage);
				    $("#backbtn").click();
				},this),function(){TDT.alert("审核失败");});				
			},
			initPage:function(){
				this.page.currentPage = 1;
				this.page.totalNum = this.wrongFeaList.length;
				this.page.totalPage = Math.ceil(this.wrongFeaList.length / this.page.perPage);
				$(".page span").eq(1).text(this.page.currentPage+"/"+this.page.totalPage);
				$(".page span").eq(2).text("共"+this.page.totalNum+"条记录");
				//if(){
					
				//}
			},
			changePage:function(){
				this.page.totalNum = this.wrongFeaList.length;
				this.page.totalPage = Math.ceil(this.wrongFeaList.length / this.page.perPage);
				if(this.page.currentPage > this.page.totalPage){this.page.currentPage=this.page.totalPage;}
				$(".page span").eq(1).text(this.page.currentPage+"/"+this.page.totalPage);
				$(".page span").eq(2).text("共"+this.page.totalNum+"条记录");
			},
			fristPage:function(){
				this.page.currentPage = 1;
				this.currentWrongFea = [];
				for(var i=0;(i<this.page.perPage&&i<this.page.totalNum);i++){
					 this.currentWrongFea.push(this.wrongFeaList[i]);
				}
				this.showWrongFeaList(this.currentWrongFea);
				$(".page span").eq(1).text(this.page.currentPage+"/"+this.page.totalPage);
			},
			prevPage:function(){
				if(this.page.currentPage>1){
					this.page.currentPage--;
					var start = (this.page.currentPage-1)*this.page.perPage;
					var end =  this.page.currentPage*this.page.perPage-1;
					this.currentWrongFea = [];
					for(var i=start; (i<this.page.totalNum&&i<=end);i++){
						this.currentWrongFea.push(this.wrongFeaList[i]);
					}
					this.showWrongFeaList(this.currentWrongFea);
				}
				$(".page span").eq(1).text(this.page.currentPage+"/"+this.page.totalPage);
			},
			nextPage:function(){
				if(this.page.currentPage<this.page.totalPage){
					this.page.currentPage++;
					var start = (this.page.currentPage-1)*this.page.perPage;
					var end =  this.page.currentPage*this.page.perPage-1;
					this.currentWrongFea = [];
					for(var i=start; (i<this.page.totalNum&&i<=end);i++){
						this.currentWrongFea.push(this.wrongFeaList[i]);
					}
					this.showWrongFeaList(this.currentWrongFea);
				}	
				$(".page span").eq(1).text(this.page.currentPage+"/"+this.page.totalPage);			
			},
			lastPage:function(){
					this.page.currentPage = this.page.totalPage;
					var start = (this.page.currentPage-1)*this.page.perPage;
					var end =  this.page.currentPage*this.page.perPage-1;
					this.currentWrongFea = [];
					for(var i=start; (i<this.page.totalNum&&i<=end);i++){
						this.currentWrongFea.push(this.wrongFeaList[i]);
					}
					this.showWrongFeaList(this.currentWrongFea);
					$(".page span").eq(1).text(this.page.currentPage+"/"+this.page.totalPage);
			}
			,trunPage:function(pagenum){
				if(pagenum>0&&pagenum<=this.page.totalPage){
					this.page.currentPage = pagenum;
					var start = (this.page.currentPage-1)*this.page.perPage;
					var end =  this.page.currentPage*this.page.perPage-1;
					this.currentWrongFea = [];
					for(var i=start; (i<this.page.totalNum&&i<=end);i++){
						this.currentWrongFea.push(this.wrongFeaList[i]);
					}
					this.showWrongFeaList(this.currentWrongFea);
					$(".page span").eq(1).text(this.page.currentPage+"/"+this.page.totalPage);					
				}else{
					$("#table > tbody").html("");
				}
			}
		}
		exports.WrongInfo = WrongInfo;
})(jQuery,window);