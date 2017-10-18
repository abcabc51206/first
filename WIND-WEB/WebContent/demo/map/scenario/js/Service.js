/**
 * 用户方案管理
 * @author wangshoudong
 * @version 1.0 2012/6/5
 */
(function(){
var Service = window.Service = function(){
		return new this.init();
	};
	 
	Service.url = {
		getServiceType:	"userScenario/getServiceType.do",
		getServiceById:	"userScenario/findAllById.do",
		addService:		"userScenario/saveService.do",
		updateService:	"userScenario/updateService.do",
		updateScenarioName:	"userScenario/updateScenarioName.do",
		upOnStep:	"userScenario/upOnStep.do",
		downOnStep:	"userScenario/downOnStep.do",
		upToTop:	"userScenario/upToTop.do",
		downTobottom:	"userScenario/downTobottom.do",
		getServiceFromCSW:"userScenario/getServiceFromCSW.do",
		deleteService:	"userScenario/deleteService.do"
		
	};
	
	Service.getServiceConfigTitle = "TITLE";
	Service.validateErrorImgSrc = "../images/error.gif";
	Service.saveCount = 0;
	
	
	//初始当前页
	Service.pageNum = 1;
	
	//当前页记录条数
	Service.pageSize = 10;
	
	//表单验证提示信息
	Service.validateTip = {
		srvType : {
			empty : "请选择服务类型"
		},
		
		srvUrl : {
			empty : "服务资源不能为空，请输入",
			length : "服务资源长度不能超过256个字符"
		},
		
		srvName : {
			empty : "服务名称不能为空，请输入",
			length : "服务名称长度不能超过64个字符"
		},
		
		srvVersion : {
			empty : "服务版本不能为空，请输入",
			length : "服务版本长度不能超过32个字符"
		}
	};
	
	Service.fn = Service.prototype = {
		
		// 服务列表
		serviceList:[],
		// 图层列表
		layerList:[],
		saveServiceList:[],
		scenarioType:"Vector",//
		/**
		 * 初始化
		 */
		init:function(){
			this.serviceList = [];
			this.layerList = [];
			
			this.saveServiceList = [];
			return this;
		},
		 getServiceConfigHtml:function(type){
			var str="<div>";
				  str+="<div class='config-content'>" ;
				  	str+="<div class='config-content-item groupbox'><span class='config-content-item-title'>名<span class='char2'></span>称:</span><span class='config-content-item-text'>http://www.baidu.com</span></div>" ;
				  	str+="<div class='config-content-item groupbox'><span class='config-content-item-title'>地<span class='char2'></span>址:</span><span class='config-content-item-text'>http://www.baidu.com</span></div>" ;
				  	str+="<div class='config-content-item groupbox'><span class='config-content-item-title'>图<span class='char2'></span>层:</span><span class='select'><select><option>请选择</option><option>图层1</option></select></span></div>" ;
				  	str+="<div class='config-content-item groupbox'><span class='config-content-item-title'><label>图<span class='char1-2'></span>层<span class='char1-2'></span>名:</span><input type='text' class='cn-ipt'/></label></div>" ;
				  	str+="<div class='config-content-item groupbox'><span class='config-content-item-title'>是否可见:</span><label><input type='radio' checked='checked' name='r1'>是</label><label><input type='radio' name='r1'>否</label></div>" ;
				  str+="</div>";
				  str+="</div>";
			return str;
		},
		operateRenderFunction:function(infoObj){
			var that  = this;
			var value=infoObj.dataValue;
			var node=infoObj.node;
			var tree=infoObj.tabletreeObj;
			var container=Core4j.Domhelper.createElement("div",{
					attributeNames:['className'],
					valueObject:{className:'downbtn-container'}
				});
			var handler=Core4j.Domhelper.createElement("div",{
					attributeNames:['className'],
					valueObject:{className:'downbtn-handler operate'}
				});
				handler.innerHTML="<span class='icon'>&nbsp;</span><span>操作</span>"
			var acionlist=Core4j.Domhelper.createElement("ul",{
					attributeNames:['className'],
					valueObject:{className:'downbtn-list'}
				});
			
			var scenario_actions=[
				//{name:"添加子节点",className:"add-scen",title:"添加子节点",callback:function(){}},
				{name:"添加服务",className:"add-serv",title:"添加服务",callback:function(){}},
				{name:"修改",className:"edit",title:"修改",callback:function(){}}];
			var service_actions=[
				{name:"上移",className:"up",title:"上移" },
				{name:"下移",className:"down",title:"下移"},
				{name:"删除",className:"delete",title:"删除"},
				{name:"置顶",className:"top",title:"置顶"},
				{name:"置底",className:"bottom",title:"置底"}
				];
			//不是三维则增加设置功能
			if(this.scenarioType !="Globe"){
				 service_actions.push({name:"设置",className:"setting",title:"设置",isDialog:true});
			}	
			if(node.userObject&&node.userObject.isGroup){//方案节点
					for(var i =0;i<scenario_actions.length;i++){
					var acionitem=null;
						var licls='downbtn-list-item groupbox '+" "+scenario_actions[i].className
						if(i===scenario_actions.length-1){
							licls='downbtn-list-item groupbox last'+" "+scenario_actions[i].className
						}
						acionitem=Core4j.Domhelper.createElement("li",{
							attributeNames:['className','title'],
							valueObject:{className:licls,title:scenario_actions[i].title}
						});
						acionitem.appendChild(Core4j.Domhelper.createElement("span",{
							attributeNames:['className'],
							valueObject:{className:'icon'}
						}));
						var showTitle=Core4j.Domhelper.createElement("span",{
							attributeNames:['className'],
							valueObject:{className:'show-title'}
						})
						acionitem.appendChild(showTitle);
						showTitle.innerHTML=scenario_actions[i].name;
						acionlist.appendChild(acionitem);
					}
			}else{//服务节点
					for(var i =0;i<service_actions.length;i++){
						var clsname='downbtn-list-item groupbox '+" "+service_actions[i].className;
						if(service_actions[i].isDialog){
							clsname='downbtn-list-item groupbox dialoghandler '+" "+service_actions[i].className;
						}
						var acionitem=Core4j.Domhelper.createElement("li",{
							attributeNames:['className','title'],
							valueObject:{className:clsname,title:service_actions[i].title}
						});
						acionitem.appendChild(Core4j.Domhelper.createElement("span",{
							attributeNames:['className'],
							valueObject:{className:'icon'}
						}));
						var showTitle=Core4j.Domhelper.createElement("span",{
							attributeNames:['className'],
							valueObject:{className:'show-title'}
						})
						acionitem.appendChild(showTitle);
						showTitle.innerHTML=service_actions[i].name;
						acionlist.appendChild(acionitem);
					}
			}
		
			container.appendChild(handler)
			container.appendChild(acionlist)
			Core4j.Domhelper.addEventToEl(container,Core4j.Domhelper.ElEventType.CLICK,function(o){
				//委派事件
				$(".service-add-source-menu li").die().live({
					click:function(){
						$(".service-add-source-menu li").removeClass("selected");
						$(this).addClass("selected");
						var _i=$(this).index();
						$(".service-add-source-type").removeClass("selected");
						$($(".service-add-source-type").get(_i)).addClass("selected");
					}
				});
				$(".service-config-attributes-tab li").die().live({
					click:function(){
						$(".service-config-attributes-tab li").removeClass("selected");
						$(this).addClass("selected");
						var _i=$(this).index();
						$(".service-config-attributes-content").removeClass("selected");
						$($(".service-config-attributes-content").get(_i)).addClass("selected");
					}
				});
				
				$(".service-add-source-type-table thead input[type=checkbox]").die().live({
					click:function(){
						var flag=$(this).attr("checked")?true:false;
						$(".service-add-source-type-table tr input[type=checkbox]").attr("checked",flag);
					}
				});
				
				//设置 功能
				$(".setting").unbind("click").bind('click',function(){
					var pNode=$(this).parents(".downbtn-container")
					if(pNode.hasClass("open")){
						if( node.dataObject.serviceType == "WFS" ||
							node.dataObject.serviceType == "WFS-G"){
							var _dialog=art.dialog({
							    title: 'WFS设置',
							    content: that.getWFSHtml(node),
							    ok: function(){
							       TDT.alert("设置成功");
							    }
							});	
						}else if(node.dataObject.serviceType == "TILE" || 
								 node.dataObject.serviceType == "WMTS" ||
								 node.dataObject.serviceType == "VWMTS" || 
								 node.dataObject.serviceType == "WMS" ) {
					 		var _dialog=art.dialog({
							    title: '地图服务设置',
							    content: that.getTILEHtml(node),
							    ok: function(){
							    	var name = $.trim($("#dituSetSrnName").val());
							    	var LayerArray = node.dataObject.serviceConfig.Layer
							    	if(LayerArray.length>0){
								    	var Layer = LayerArray[0];
								    	if(name!=""){
								    		node.dataObject.serviceName = name;
								    		Layer.alias = name;
								    	}
								    	if(Layer.type=="WMTS"||Layer.type=="VWMTS"){
									    	for(var i=0,len = Layer.matrixIds.length;i<len;i++){
									    		var ishave = false;
									    		for(var j=0;j<$("#showlayerlevelList input:checked").length;j++){
									    			if($("#showlayerlevelList input:checked").eq(j).attr("layerlevel")==Layer.matrixIds[i].identifier){
										    				ishave = true;
										    				break;
										    			}
									    		}
										    	if(ishave){
										    		Layer.matrixIds[i]["islevelhidden"] = false;
										    	}else{
										    		Layer.matrixIds[i]["islevelhidden"] = true;
										    	}
									    	}
								    	}
								    	
								    	var format = $("#dituSet-imageformat").val();
								    	if(!format||format==""){
								    		Layer.format = Layer.formats[0];
								    	}else{
								    		Layer.format = format;
								    	}
								    	var aa = $('input:radio[name="visibility"]:checked').val();
										Layer.visibility = aa;
								    	Layer.opacity = $("#dituTransp").val()/10;
								    	
								    	var usSrvCap = new Object();
						    			usSrvCap.Layer = [];
						    			usSrvCap.Layer.push(Layer);
								    	var url = Service.url["updateService"];
								    	var params = "userService.id="+node.id+"&userService.usSrvCap="+$.toJSON(usSrvCap)+"&userService.usSrvName="+name+"&userService.usSrvMirrorURL="+$("#dituSetusSrvMirrorURL").val();
										TDT.getDS(url,params,false,function(json){
											if(json.result){
												TDT.alert("操作成功");
												$("#services").html("");
										 		Service.fn.initdata(node.pid);
											}
										});
							    	}
							    	
							    	/***
							      	var serviceUrl = node.dataObject.serviceURL;
									var type = node.dataObject.serviceType;
									var result = Service.fn.configFromcsw(serviceUrl,type,"no");
							       var currentSele = $("#ditusetting select:first").val();
							       var imsg = $("#ditusetting select:last").val();
							       if(result){
								       $(result.Layer).each(function(i,data){
											if(data.name == currentSele){
												data.alias = $("#ditusetting .cn-ipt").val();
												var aa = $('input:radio[name="visibility"]:checked').val();
												data.visibility = aa;
												data.opacity = $("#dituTransp").val();
												data.format = $("#ditusetting select:last").val();
											}
										});
							       }
									var cap = $.toJSON(result);
									var url = Service.url["updateService"];
									var usSrvMirrorURL = $("#ditusetting textarea:first").val();
									
									var params = "userService.id="+node.id+"&userService.usSrvCap="+cap+"&userService.usSrvMirrorURL="+usSrvMirrorURL;
									TDT.getDS(url,params,false,function(json){
										if(json.result){
											TDT.alert("操作成功");
											$("#services").html("");
									 		Service.fn.initdata(node.pid);
										}
									});
									***/
							    },
							    cancelVal: '取消',
							    cancel:function(){}

							});	
						}
						
						
					}			
				});
				//zzj设置服务中的图层 下拉框的onchange事件
				$(".edit").unbind("click").bind("click",function(){
					var _dialog=art.dialog({
					    title: '方案名称修改',
					    content: that.getEditSceHTML(node),
					    ok: function(){
							var url = Service.url["updateScenarioName"];
							var scenarioName = $("#editDiv input:first").val(); 
							var params = "userScenario.usName="+scenarioName+"&userScenario.id="+node.id;
							TDT.getDS(url,params,false,function(json){
								if(json.result){
									$("#services").html("");
							 		that.initdata(node.id);
								}
							});
					    }
					    ,
					    cancelVal: '取消',
					    cancel:function(){}

					});	
				});
				$(".add-serv").unbind("click").bind("click",function(){
					//获取服务类型
					var url = Service.url["getServiceType"];
					TDT.getDS(url,null,false,function(json){
						if(json.result){
							that.bangdingResult(json.serviceTypeList,"inputService");
						}
					});
					
					var pNode=$(this).parents(".downbtn-container");
					if(pNode.hasClass("open")){
						//alert($(this).attr('title'));
						var _dialog=art.dialog({
						    title: '添加服务',
						    content: $("#addServiceDia").html(),
						    ok: function(){
						    	var add = $("#add").val();
						    	if(add =="add"){
						    		var validatorAdd = that.validatorForm("add");
						    		if(validatorAdd){
						    			that.saveServiceList = [];
						    			Service.saveCount = 0;
						    			var len = $("#layerlist input[type=checkbox]:checked").length
								    	$.each($("#layerlist input[type=checkbox]:checked"),function(i,data){
								    			var layer = that.layerList[$(data).parent("span").attr("layerid")];
								    			var obj=new Object();
								    			obj.usSrvName = layer.alias;
								    			obj.usSrvURL = $("#userService-usSrvURL").val();
								    			obj.mapUserScenario = {}
								    			obj.mapUserScenario.id = $("#US_SRV_SC_ID").val();
								    			obj.usSrvType = $("#usSrvType").val();
								    			obj.usSrvVersion = $("#userService-usSrvVersion").val();
								    			var usSrvCap = new Object();
								    			usSrvCap.Layer = [];
								    			usSrvCap.Layer.push(layer);
								    			obj.usSrvCap = usSrvCap;
								    			that.addService(obj,function(){
								    				Service.saveCount++;
								    				if(Service.saveCount==len){
								    					$("#services").html("");
														that.initdata(node.id);
								    				}
								    			})
								    			//this.saveServiceList.push(obj);
								    			
								    	});
								    	
							    	}else {
										return false;
							    	}
						    	}else { //是从csw中查询而来
						    		var selectNum = $("input[type=checkbox]:checked");
						    		if(selectNum && selectNum.length==0){
						    			TDT.alert("请至少选择一条服务进行保存!");
						    			return false;
						    		}
						    		
						    		var url = Service.url["addService"];
						    		$("#fromCSWList input:checked").each(function(i){
							    			var usSrvName = $(this).next();
							    			var usSrvURL = usSrvName.next();
							    			var usSrvType  = usSrvURL.next();
							    			var usSrvVersion = usSrvType.next();
							    			
							    			var cap = that.configFromcsw(usSrvURL.val(),usSrvType.val(),"refresh");
								    		var params = "userService.usSrvFlag="+$(this).val()+
								    					 "&userService.usSrvName="+usSrvName.val()+
								    					 "&userService.mapUserScenario.id="+node.id+
								    					 "&userService.usSrvURL="+usSrvURL.val()+
								    					 "&userService.usSrvType="+usSrvType.val()+
								    					 "&userService.usSrvVersion="+usSrvVersion.val()+
								    					 "&userService.usSrvCap="+$.toJSON(cap);
						    				TDT.getDS(url,params,false,function(json){ 
												if(json.result){
												}
						    				});
						    		});
						    		$("#services").html("");
									that.initdata(node.id);
						    	}
						    },
						    close:function(){
						    	$("#iframeDialog").hide();
						    },
						    cancelVal: '取消',
						    cancel:function(){
						    	
						    	//TDT.alert("是我取消的");
						    }
						});
						if(that.scenarioType =="Globe"){
							$("#iframeDialog").show();
						}
					}	
				});
				$(".delete").unbind("click").bind("click",function(){
					var url = Service.url["deleteService"];
					var params = "userService.id="+node.id;
						art.dialog({
						    title: '友情提示',
						    content: "确认删除此服务吗?",
						    lock : true, //锁屏
						    background: '#FFFFFF', // 背景色
						    icon: 'warning',
						    ok: function(){
						    	TDT.getDS(url,params,true,function(json){
									if(json.result){
										$("#services").html("");
										that.initdata(node.pid);
									}else{
										TDT.alert("删除失败!");
									}
								});
						    	return true;
						    },
						    close:function(){
						    	$("#iframeDialog").hide();
						    },
						    cancel: function(){
						    	return true;
						    }
						});
					if(that.scenarioType =="Globe"){
							$("#iframeDialog").show();
					}
				});
				//zzj 上下移动
				$(".top").unbind("click").bind("click",function(){
					var url = Service.url["upToTop"];
					var params = "userService.id="+node.id;
					TDT.getDS(url,params,true,function(json){
						if(json.result){ 
							$("#services").html("");
							that.initdata(node.pid);
						}
					});
				});
				$(".up").unbind("click").bind("click",function(){
					var url = Service.url["upOnStep"];
					var params = "userService.id="+node.id;
					TDT.getDS(url,params,true,function(json){
						if(json.result){
							$("#services").html("");
							that.initdata(node.pid);
						}
					});
				});
				$(".down").unbind("click").bind("click",function(){
					var url = Service.url["downOnStep"];
					var params = "userService.id="+node.id;
					TDT.getDS(url,params,true,function(json){
						if(json.result){
							$("#services").html("");
							that.initdata(node.pid);
						}
					});
				});
				$(".bottom").unbind("click").bind("click",function(){
					var url = Service.url["downTobottom"];
					var params = "userService.id="+node.id;
					TDT.getDS(url,params,true,function(json){
						if(json.result){
							$("#services").html("");
							that.initdata(node.pid);
						}
					});
				});
				$(".view").unbind("click").bind("click",function(){
					var realURL = node.dataObject.serviceFlag;
//					realURL = "9543c6c6-5369-4d2e-810b-202c099e3065";
					if(realURL==""){
						TDT.alert("暂无查看的服务");
					}else {
						var url = node.dataObject.src_center_url+realURL;
						window.open(url,"_srcCenter");
					}
				});
				
			});
			return container;
		},
		getWFSHtml:function(node){
			$("#dituSetSrnURL").html(node.dataObject.serviceURL);
			$("#dituSetSrnType").html(node.dataObject.serviceType);
			$("#dituSetSrnName").html(node.dataObject.serviceName);
					
			return document.getElementById("wfssetting");
		},
		getEditSceHTML:function(node){
			$("#editDiv input:first" ).val(node.dataObject.scenarioName);
			return document.getElementById("editSceDiv");
		},
		// 设置瓦片服务的 图层设置
		getTILEHtml:function(node){
			//配置弹出此框:
			$("#dituSetSrnURL").html(node.dataObject.serviceURL);
			$("#dituSetSrnType").html(node.dataObject.serviceType);
			$("#dituSetSrnName").val(node.dataObject.serviceName);
			var serviceUrl = node.dataObject.serviceURL;
			var type = node.dataObject.serviceType;
			//zzj配置框
			//var result = this.configFromcsw(serviceUrl,type,"refresh");
			//$("#jsonResult").val(result);
			
			// 策略 是 一个服务一个图层
						
			var objArr = node.dataObject.serviceConfig;
			var serviceMirrorURL = node.dataObject.serviceMirrorURL;
			$("#dituSetusSrvMirrorURL").val(serviceMirrorURL);
			//var currentSele = $("#ditusetting select:first").val();
			if(objArr){
				var that = this;
				$(objArr.Layer).each(function(i,data){
						$("#dituSetlayername").html(data.name);
						if(data.visibility){
							$("#ditusetting input[type='radio'][value='"+data.visibility+"']").attr("checked","checked");
						}
						var imageFormat = data.formats;
						$("#ditusetting select:last").html("");
						$(imageFormat).each(function(i,f){
							if(f==data.format){
								$("<option value="+f+" selected = true >"+f+"</option>").appendTo("#ditusetting select:last");
							}else{
								$("<option value="+f+">"+f+"</option>").appendTo("#ditusetting select:last");
							}
						});
						$("#dituTransp").val(data.opacity*10);
						$("#slider-range-max").slider("value",data.opacity*10);
						if(data.type=="WMTS"){
							$("#dituset-layerlevel").show();
							// 设置图层级别
							var layerlevelHtmlStr = that.layerlevelHtmlStr(data.matrixIds);
							$("#showlayerlevelList").html(layerlevelHtmlStr);
							
						}else{
							$("#dituset-layerlevel").hide();
						}
						//that.setchecklayerlevel(data.matrixIds);
				});
			}
			return document.getElementById("ditusetting");
		},
		 layerlevelHtmlStr:function(layerlevelArray){
 			var template = $("#showlayerlevelListTemplate");
 			var temp = template.html();
 			var html = [];
	    	for(var i=0,len=layerlevelArray.length;i<len;i++){
				var row =temp;
 				row = row.replace(/\%{layerlevel}%/g, layerlevelArray[i].identifier);
 				row = row.replace(/\%{!islevelhidden}%/g, layerlevelArray[i].islevelhidden?'':'checked');
 				html.push(row);
			};
			return html.join("");
	    },
		configFromcsw:function(serviceUrl,type,refresh){

			var imageFormat = ["image/png","image/jpeg","image/tile","image/gif","tiles"];
 			var result;
			if(type=="TILE"){
 			}else if(type=="WMTS"){
	 				if(serviceUrl.indexOf("?")>0){
	 					var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"&1=1&service=wmts";
	 				}else{
	 					var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1&service=wmts";
	 				}
 				var format = new OpenLayers.Format.WMTSCapabilities();
			  	OpenLayers.Request.GET({
		            url: url,
		            params: {
		                REQUEST: "GetCapabilities",
		                SERVICE:"wmts"
		            },
		            async:false,
		            success: function(request){
		            	var json = format.read(request.responseText);
	                	var layers = json.contents.layers;

						var tileMatrixSets = json.contents.tileMatrixSets;
						var layerArr = [];
						$(layers).each(function(i,data){
							var layerObj = {};
							layerObj["name"]=data.identifier;
							layerObj["alias"]= data.identifier;
							layerObj["opacity"]=1;
							layerObj["visibility"]=true;
							layerObj["transitionEffect"]="resize";
							layerObj["zoomOffset"]="0";
							layerObj["format"]= " ";
							if(data.styles.length&&data.styles.length>0){
							   layerObj["style"]=data.styles[0].identifier;
							}else{
							   layerObj["style"]="default";
							}
							
							layerObj["tileFullExtent"]=data.bounds.left+","+data.bounds.bottom+","+data.bounds.right+","+data.bounds.top;
							layerObj["matrixSet"]= data.tileMatrixSetLinks[0].tileMatrixSet;
							var topLevel ;  //得到最小的等级
							var bottomLevel = 0 ; //得到最大的等级
							var scales;
							var matrixIds = [];
							$(tileMatrixSets[data.tileMatrixSetLinks[0].tileMatrixSet].matrixIds).each(function(j,d){
							    /*
								topLevel = d.identifier;
								if(parseInt(topLevel)>parseInt(d.identifier)){
									topLevel = d.identifier;
								}
								if(parseInt(d.identifier)>parseInt(bottomLevel)){
									bottomLevel = d.identifier;
								}
								if(j ==0 ){
									scales = d.scaleDenominator;
								}else {
									scales +=","+d.scaleDenominator;
								}
								*/
								  var matrixid = {};
						          matrixid.identifier =d.identifier;
						          matrixid.scaleDenominator =d.scaleDenominator;
						          matrixid.tileHeight =d.tileHeight;
						          matrixid.tileWidth =d.tileWidth;
						          //matrixid.matrixHeight =_tileMatrixSet.matrixIds[i].matrixHeight;
						          //matrixid.matrixWidth =_tileMatrixSet.matrixIds[i].matrixWidth;
						          matrixIds.push(matrixid);
							});
							layerObj["topLevel"] = topLevel;
							layerObj["bottomLevel"] = bottomLevel;
							layerObj["matrixIds"] = matrixIds;
							layerArr.push(layerObj);
						});
						var json = {};
						json["Layer"] = layerArr;
						result = json;
						
		            },
		            failure: this.failFn
		        });
	 			return result;
 			}else if(type="WMS"){
 			}
		},
		initdata:function(id){
			var that = this;
			var fifaGirdTree=new Core4j.toolbox.TableTree4j({
				columns:[
						{isNodeClick:true,width:'35%',renderFunction:function(infoObj){
							var node=infoObj.node;
							var data=node.dataObject;
							var uerObj=node.userObject;
							if(uerObj&&uerObj.isGroup){
								return data.scenarioName
							}else{
								return data.serviceTitle+"[<span class='service-type'>"+data.serviceType+"</span>]"
							}
						}},
						{width:'15%',renderFunction:function(infoObj){
							var node=infoObj.node;
							var data=node.dataObject;
							var uerObj=node.userObject;
							if(uerObj&&uerObj.isGroup){
								return data.scenarioTypeTitle
							}else{
								return data.serviceTypeTitle
							}
						}},
						{dataIndex:'datetime',width:'20%',canSort:true},
						{width:'30%',canSort:false,renderFunction:$.proxy(that.operateRenderFunction,that)}
						],
				treeMode:'gird',
				renderTo:'services',
				useLine:true,
				useIcon:true,
				id:'myworldcupgirdtree',
				useCookie:false,
				onExpandNodeEvents:[],
				headers:[{
					  	columns:[{dataIndex:'serviceName'},{dataIndex:'stype'},{dataIndex:'datetime'},{dataIndex:'operate'}],
						dataObject:{serviceName:'名称',stype:'服务类型',datetime:'创建日期',operate:'操作'},
						trAttributeNames:['classStyle','style'],
						trAttributeValueObject:{classStyle:'headerbg',style:''}
					  }
					],
				//footers:jsonfooters,
				themeName:'arrow',
				selectMode:'single'
				//floatRight:true
			});
			
			var results=[];
			
		 	var url = Service.url["getServiceById"];
			var params = "userScenario.id="+id;
		 	TDT.getDS(url,params,true,function(json){
				fifaGirdTree.build(json,true);
				var jsonList = null;
				var layergroup;
				if(that.scenarioType == "Globe"){
					jsonList = ServiceUI.ServiceView.getLayerList3DBySerJsonList(json);
					layergroup =new Geo.View3D.LayerGroup({layers:[]});
				}else{
					jsonList = ServiceUI.ServiceView.getLayerListBySerJsonList(json);
		      		layergroup =new Geo.View2D.BaseLayerGroup({layers:[]});
				}
				if(layergroup){
					jsonList.reverse();
					layergroup.layers = jsonList;
					ServiceUI.ServiceView.loadLayerGroup(layergroup);
				}
				//绑定打开关闭事件
				$(".downbtn-handler").live({
					click:function(){
						$(".downbtn-container").removeClass("open");
						$(this).parent().addClass("open")
					}
				});
			});
			//build tree by nodes
			
			
		/*	var url = Service.url["getServiceById"];
			var params = "userServicemapUserScenario.id="+node.id;  
			fifaGirdTree.build(results,true);
			
			
			;*/
			
		},
		queryServiceFromCSW:function(srvKeyword){
			var that = this;
			//获取服务类型
			var url = Service.url["getServiceFromCSW"];
			var params = "pageNum="+Service.pageNum+"&pageSize="+Service.pageSize+"&srvKeyword="+srvKeyword;
			TDT.getDS(url,params,true,function(json){
				if(json.cswResource.page.recordCount > 0){
					that.bangdingResultCSW(json.cswResource.listInfo,"fromCSW");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Service.pageNum, Service.pageSize, json.cswResource.page.recordCount, pagerObj, function(p){
						Service.pageNum = p;
						that.queryServiceFromCSW();
					});
				} else{
					$("#fromCSWList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
				
				
			});
			
			
		 
		},
		bangdingResultCSW:function(json,key){
			$("#noData").hide();
			var list = $("#"+key+"List");
			list.html("");
			var html = [];
			var template = $("#"+key+"Template");
			$.each(json,function(i,data){
				var row = template.html();
				if(i%2==0){
					row = row.replace(/\%{even}%/g, "even");
				}else {
					row = row.replace(/\%{even}%/g, "odd");
				}
				row = row.replace(/\%{mdId}%/g, data.metadataID);
				row = row.replace(/\%{serviceName}%/g, data.resTitle);
				row = row.replace(/\%{serviceURL}%/g, TDT.strCut(data.agencyRpLinkage,90));
				row = row.replace(/\%{displayServiceType}%/g, data.serType);
				row = row.replace(/\%{version}%/g, data.serVersion||"");
				html.push(row);
			});
			list.html(html.join(""));
		},
		bangdingResult:function(json,key){
			var list = $("#"+key+"List");
			list.html("");
			var html = [];
			var template = $("#"+key+"Template");
			$.each(json,function(i,data){
				var row = template.html();
				row = row.replace(/\%{image}%/g, "<img src='../images/serviceType/"+data.svrTypeEnName+".gif' >");
				
				row = row.replace(/\%{svrTypeName}%/g, data.svrTypeEnName);
				row = row.replace(/\%{radioValue}%/g, "'"+data.svrTypeName+"'");
				row = row.replace(/\%{title}%/g, data.svrTypeName);
				row = row.replace(/\%{description}%/g, data.svrTypeDesc);
				html.push(row);
			});
			list.html(html.join(""));
			if(this.scenarioType =="Globe"){
				 list.find("input:hidden[value='VWMTS']").parent().parent("dt").hide();
			}else{
				 list.find("input:hidden[value='MODEL']").parent().parent("dt").hide();
				 list.find("input:hidden[value='TERRAIN']").parent().parent("dt").hide();
			}
		},
		// 验证服务
		checkService:function(){
			// 验证服务是否有效
			var validator = this.validatorForm();
			if(validator){
				var usSrvURL = $("#userService-usSrvURL").val();
				var usSrvType = $('#usSrvType').val(); 
				//验证服务是否有效后,查询服务的其它信息
				this.getServiceOption(usSrvURL,usSrvType);
			}
		},
		//显示图层列表
		showLayerList:function(layerList){
			//layerList = layerList?layerList:this.layerList
			this.layerList = layerList;
			
			var layerlistStrArray = new Array();
			var template = $("#layerlistTemple");
			for(var i=0;i<layerList.length;i++){
				if(i%3==0&&i!=0){layerlistStrArray.push("</tr><tr>");}
				var row = template.html();
				row = row.replace(/\%{layerid}%/g, i);
				row = row.replace(/\%{layername}%/g, layerList[i].alias);
				layerlistStrArray.push(row);
			}
			$("#layerlist").html("<tr>"+layerlistStrArray.join("")+"</tr>");
			//如果是三维隐藏设置功能
			if(this.scenarioType =="Globe"){
				 $("#layerlist .setLayer").hide();
			}
			this.bulidLayerList();
		},
		// 绑定UI事件
		bulidLayerList:function(){
			var that = this;
			$("#layerlist .setLayer").off("click").on("click",function(){
				var layerid =  $(this).parent("span").attr("layerid");
				var layer = that.layerList[layerid];
				that.setLayer(layer);
			});
		},
		// 设置 图层 条件
		setLayer:function(layer){
			var that = this;
			//this.createSetLayerDialogHtml(layer);
					 		var _dialog=art.dialog({
							    title: '图层设置',
							    content: that.createSetLayerDialogHtml(layer),
							    ok: function(){
							    	var alias  = $("#setlayer-layeralias").val();
							    	layer.alias = alias;
							    	if(layer.type=="WMTS"||layer.type=="VWMTS"){
								    	for(var i=0,len = layer.matrixIds.length;i<len;i++){
								    		var ishave = false;
								    		for(var j=0;j<$("#setlayer-layerlevel input:checked").length;j++){
								    			if($("#setlayer-layerlevel input:checked").eq(j).attr("layerlevel")==layer.matrixIds[i].identifier){
									    				ishave = true;
									    				break;
									    			}
								    		}
									    	if(ishave){
									    		layer.matrixIds[i]["islevelhidden"] = false;
									    	}else{
									    		layer.matrixIds[i]["islevelhidden"] = true;
									    	}
								    	}
							    	}
							    	if(layer.type=="VWMTS"){
							    		layer.dimension = $("#setlayer-dimensions").val();
									}
							    	var format = $("#setlayer-imageformat").val();
							    	layer.format = format;
							    	layer.opacity = $("#setlayer-opacity").val()/10;
							    	for(var i=0;i<that.layerList.length;i++){
							    		if(that.layerList[i].name == layer.name){
							    			$("#layerlist  span[layerid="+i+"]").find("label").text(layer.alias);
							    			break;
							    		}
							    	}
							    },
							    cancelVal: '取消',
							    cancel:function(){}

							});		
		},
		createSetLayerDialogHtml:function(layer){
			$("#setlayer-layername").text(layer.name);    
			$("#setlayer-layeralias").val(layer.alias);
			if(layer.type=="WMTS"||layer.type=="VWMTS"){
				$("#setlayer-layerlevel").show();
				var layerlevelHtmlStr = this.layerlevelHtmlStr(layer.matrixIds);
				$("#setlayer-layerlevel").html(layerlevelHtmlStr);
			}else{
				$("#setlayer-layerlevel").hide();
			}
			if(layer.type=="VWMTS"){
				$("#setlayer-dimensions-div").show();
				$(layer.dimensions).each(function(i,f){
					if(f==layer.dimension){
						$("<option value=\""+f+"\" selected = true >"+f+"</option>").appendTo("#setlayer-dimensions");
					}else{
						$("<option value=\""+f+"\" >"+f+"</option>").appendTo("#setlayer-dimensions");
					}
				});				
			}else{
				$("#setlayer-dimensions-div").hide();
			}
			$(layer.formats).each(function(i,f){
				if(f==layer.format){
					$("<option value=\""+f+"\" selected = true >"+f+"</option>").appendTo("#setlayer-imageformat");
				}else{
					$("<option value=\""+f+"\" >"+f+"</option>").appendTo("#setlayer-imageformat");
				}
			});
			
			
				$("#setlayer-opacity-slider").slider({
					range: "max",
					min: 0,
					max: 10,
					value: 1,
					slide: function( event, ui ) {
						$("#setlayer-opacity").val(ui.value);
					}
				});
			$("#setlayer-opacity").val(layer.opacity*10);
			$("#setlayer-opacity-slider").slider("value",layer.opacity*10);
			return document.getElementById("layersetting");
		},
		validatorForm:function(type){
			// 选择的服务类型
			var usSrvType =$('input:radio[name="userService.usSrvDisplayType"]:checked').val();
			if(!usSrvType){
				TDT.alert(Service.validateTip.srvType.empty)
				return false;
			}
			//url 
			var usSrvURL =$("#userService-usSrvURL");
			var usSrvurl = usSrvURL.val();
			// 服务地址为空
			if(usSrvurl == ""){
				usSrvURL.parent().find(".required").html("<img src='"+Service.validateErrorImgSrc+"'/>"+Service.validateTip.srvUrl.empty);
				usSrvURL.focus(function(){
					$(this).parent().find(".required").html("*");
				});
				return false;
			} else {
				// 服务地址长度大于256个字符
				if(usSrvurl.length > 256){
					usSrvURL.parent().find(".required").html("<img src='"+Service.validateErrorImgSrc+"'/>"+Service.validateTip.srvUrl.length);
					usSrvURL.focus(function(){
						$(this).parent().find(".required").html("*");
					});
					return false;
				}
			}
			
			// 添加 的时候判断
			if(type){//添加时判断
				//服务名称
				/*
				var usSrvName =$("input[name='userService.usSrvName']");
				var brief = usSrvName.val();
				if(brief == ""){
					usSrvName.parent().find(".required").html("<img src='"+Service.validateErrorImgSrc+"'/>"+Service.validateTip.srvName.empty);
					usSrvName.focus(function(){
						$(this).parent().find(".required").html("*");
					});
					return false;
				} else {
					if(brief.length > 64){
						usSrvName.parent().find(".required").html("<img src='"+Service.validateErrorImgSrc+"'/>"+Service.validateTip.srvName.length);
						usSrvName.focus(function(){
							$(this).parent().find(".required").html("*");
						});
						return false;
					}
				}
				*/
				//服务版本
				var usSrvVer =$("#userService-usSrvVersion");
				var usSrvVerVal = usSrvVer.val();
				if(usSrvVerVal == ""){
					usSrvVer.parent().find(".required").html("<img src='"+Service.validateErrorImgSrc+"'/>"+Service.validateTip.srvVersion.empty);
					usSrvVer.focus(function(){
						$(this).parent().find(".required").html("*");
					});
					return false;
				} else {
					if(usSrvVerVal.length > 32){
						usSrvVer.parent().find(".required").html("<img src='"+Service.validateErrorImgSrc+"'/>"+Service.validateTip.srvVersion.length);
						usSrvVer.focus(function(){
							$(this).parent().find(".required").html("*");
						});
						return false;
					}
				}
			}
			return true;
		},
		//从服务信息中获取不类型的详细信息
 		getServiceOption : function(serviceUrl,type){
 			var that = this;
 			if(serviceUrl =="")
 				return;
 				
 			if(type=="TILE"){
 				var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"/GetCapabilities";
	 			var format = new Geo.Util.Format.GlobeTileCapabilities();
				OpenLayers.Request.GET({
		            url: url,
		            params: {
		            },
		            async:false,
		            success: function(request){
		            	var json = format.read(request.responseText)
		                var arrayFeatureType = [];
		                try {
		                	$("#userService-usSrvVersion").val(json.version);
		                	var layerArry = that.TILEAnalyzer(json);
		                	that.layerList = layerArry;
		                	//显示图层信息
		                	that.showLayerList(that.layerList);
		                } 
		                catch (e) {
		                    that.failFn;
		                }
		            },
		            failure: this.failFn
		        });
 			}else if(type=="WMTS"){
	 				if(serviceUrl.indexOf("?")>0){
	 					var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"&1=1&service=wmts";
	 				}else{
	 					var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1&service=wmts";
	 				}
 				var format = new OpenLayers.Format.WMTSCapabilities();
			  	OpenLayers.Request.GET({
		            url: url,
		            params: {
		                REQUEST: "GetCapabilities"
		            },
		            async:false,
		            success: function(request){
		                var arrayFeatureType = [];
		                try {
		                	// 版本号赋值
		            		var json = format.read(request.responseText)
		                	$("#userService-usSrvVersion").val(json.version);
		                	var layerArry =that.WMTSAnalyzer(json);
		                	that.layerList = layerArry;
		                	//显示图层信息
		                	that.showLayerList(that.layerList);
		                } 
		                catch (e) {
		                    that.failFn;
		                }
		            },
		            failure: this.failFn
		        });
 			}else if(type=="WMS"){
 				var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1";
	 			var format = new OpenLayers.Format.WMSCapabilities();
				OpenLayers.Request.GET({
		            url: url,
		            params: {
		                REQUEST: "GetCapabilities",
		                SERVICE:"WMS"
		            },
		            async:false,
		            success: function(request){
		            	var json = format.read(request.responseText)
		                var arrayFeatureType = [];
		                try {
		                	$("#userService-usSrvVersion").val(json.version);
		                	var layerArry = that.WMSAnalyzer(json);
		                	that.layerList = layerArry;
		                	//显示图层信息
		                	that.showLayerList(that.layerList);
		                } 
		                catch (e) {
		                    that.failFn;
		                }
		            },
		            failure: this.failFn
		        });
 			}else if(type=="VWMTS"){
 				var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1";
				OpenLayers.Request.GET({
		            url: url,
		            params: {
		                REQUEST: "GetCapabilities",
		                SERVICE:"WMTS"
		            },
		            async:false,
		            success: function(request){
		 				var xmlobj ;
		 				if(document.all){ 
						　　var xmlDom=new ActiveXObject("Microsoft.XMLDOM");
						　　xmlDom.loadXML(request.responseText) ;
							xmlobj = xmlDom;
					　　} 
					　　else {
					　　     xmlobj = new DOMParser().parseFromString(request.responseText, "text/xml") 
					　　} 
						var xmlParser = new Geo.Format.XML();
						var xmlStr = xmlParser.write(xmlobj);
						var parser = new OpenLayers.Format.VWMTSCapabilities.v1_0_0();
                		var json = parser.read(xmlStr);
                		
		                try {
		                	$("#userService-usSrvVersion").val(json.version);
		                	var layerArry = that.VWMTSAnalyzer(json);
		                	that.layerList = layerArry;
		                	//显示图层信息
		                	that.showLayerList(that.layerList);
		                } 
		                catch (e) {
		                    that.failFn;
		                }
		            },
		            failure: this.failFn
		        }); 				
 			}else if(type=="MODEL"){
 				var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"/GetCapabilities";
	 			var format = new Geo.Util.Format.GlobeTileCapabilities();
				OpenLayers.Request.GET({
		            url: url,
		            params: {
		            },
		            async:false,
		            success: function(request){
		            	var json = format.read(request.responseText);
		                var arrayFeatureType = [];
		                try {
		                	$("#userService-usSrvVersion").val(json.version);
		                	var layerArry = that.MODELAnalyzer(json);
		                	that.layerList = layerArry;
		                	//显示图层信息
		                	that.showLayerList(that.layerList);
		                } 
		                catch (e) {
		                    that.failFn;
		                }
		            },
		            failure: this.failFn
		        });
 			}else if(type=="TERRAIN"){
 				var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"/GetCapabilities";
	 			var format = new Geo.Util.Format.GlobeTileCapabilities();
				OpenLayers.Request.GET({
		            url: url,
		            params: {
		            },
		            async:false,
		            success: function(request){
		            	var json = format.read(request.responseText);
		                var arrayFeatureType = [];
		                try {
		                	$("#userService-usSrvVersion").val(json.version);
		                	var layerArry = that.TERRAINAnalyzer(json);
		                	that.layerList = layerArry;
		                	//显示图层信息
		                	that.showLayerList(that.layerList);
		                } 
		                catch (e) {
		                    that.failFn;
		                }
		            },
		            failure: this.failFn
		        });
 			}else {
 				alert("没有该类型的服务");
 			}
 			 
		},
		failFn:function(){
			TDT.alert("失败");
		},
		getInfoByLayer:function(serviceUrl,layer){
			var that = this;
			 var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1";
			 OpenLayers.Request.GET({
	            url: url,
	            params: {
	                typename: layer,
	                REQUEST: "describeFeatureType"
	            },
	            async:false,
	            success: function(request){
	                //var doc = request.responseXML;
	                var doc = request.responseText;
	                var parser = new OpenLayers.Format.WFSDescribeFeatureType();
	                var jsonObj = parser.read(doc);
	                var proPerties = jsonObj.featureTypes[0].properties;
	                var arrProperties = [];
		            var propertiesObj = {};
	                for (var i = 0; i < proPerties.length; i++) {
	                	propertiesObj.push(proPerties[i].name) ;
	                }
	                layerObj["ObjectData"] = propertiesObj;
	            },
	            failure: that.failFn
	        });
		},
		/*
		 * 
		 
		 */
		TILEAnalyzer:function(json){
			var data = json.tileData;
			var layerArr = [];
			var layerObj = {};
			
			layerObj["name"] = json.name;
			layerObj["formats"]=json.operationList.operations.getTile.format;
			layerObj["format"]=json.operationList.operations.getTile.format[0];
			layerObj["alias"]= data.tile;
			layerObj["opacity"]=1;
			layerObj["visibility"]=true;
			layerObj["bottomLevel"] = data.bottomLevel;
			layerObj["topLevel"] = data.topLevel;
			layerObj["maxExtent"] = data.boundBox.left+","+data.boundBox.bottom+","+
				data.boundBox.right+","+data.boundBox.top;
			
			layerArr.push(layerObj);
			
			return  layerArr;
		},
		/*
		 * 
		 
		 */
		MODELAnalyzer:function(json){
			var data = json.tileData;
			var layerArr = [];
			var layerObj = {};
			
			layerObj["name"] = json.name;
			layerObj["alias"]= data.tile;
			layerObj["opacity"]=1;
			layerObj["visibility"]=true;
			layerObj["bottomLevel"] = data.bottomLevel;
			layerObj["topLevel"] = data.topLevel;
			layerObj["maxExtent"] = data.boundBox.left+","+data.boundBox.bottom+","+
				data.boundBox.right+","+data.boundBox.top;
			
			layerArr.push(layerObj);
			
			//var json = {};
			//json["Layer"] = layerArr;
			//$("#usSrvCap").val($.toJSON(json));
			return  layerArr;
		},
		/*
		 * 
		 
		 */
		TERRAINAnalyzer:function(json){
			var data = json.tileData;
			var layerArr = [];
			var layerObj = {};
			
			layerObj["name"] = data.tile;
			layerObj["alias"]= data.tile;
			layerObj["opacity"]=1;
			layerObj["visibility"]=true;
			layerObj["bottomLevel"] = data.bottomLevel;
			layerObj["topLevel"] = data.topLevel;
			layerObj["maxExtent"] = data.boundBox.left+","+data.boundBox.bottom+","+
				data.boundBox.right+","+data.boundBox.top;
			
			layerArr.push(layerObj);
			
			return  layerArr;
		},
		/*
		 * 
		 */
		WMTSAnalyzer:function(json){
		//WMTS类型的服务数据 解析.
			var layers = json.contents.layers;
			var tileMatrixSets = json.contents.tileMatrixSets;
			var layerArr = [];
			$(layers).each(function(i,data){
				var layerObj = {};
				layerObj["name"]=data.identifier;
				layerObj["type"] = "WMTS";
				layerObj["alias"]= data.identifier;
				layerObj["opacity"]=1;
				layerObj["visibility"]=true;
				layerObj["transitionEffect"]="resize";
				layerObj["zoomOffset"]="0";
				layerObj["formats"]=data.formats;
				layerObj["format"]=data.formats[0];//"image/tile";
				layerObj["style"]=data.styles[0].identifier;
				layerObj["tileFullExtent"]=data.bounds.left+","+data.bounds.bottom+","+data.bounds.right+","+data.bounds.top;
				layerObj["matrixSet"]= data.tileMatrixSetLinks[0].tileMatrixSet;
				var matrixIds = [];
				$(tileMatrixSets[data.tileMatrixSetLinks[0].tileMatrixSet].matrixIds).each(function(j,d){
				  var matrixid = {};
		          matrixid.identifier =d.identifier;
		          matrixid.scaleDenominator =d.scaleDenominator;
		          matrixid.tileHeight =d.tileHeight;
		          matrixid.tileWidth =d.tileWidth;
		          //matrixid.matrixHeight =_tileMatrixSet.matrixIds[i].matrixHeight;
		          //matrixid.matrixWidth =_tileMatrixSet.matrixIds[i].matrixWidth;
		          matrixIds.push(matrixid);
				});
				layerObj["matrixIds"] = matrixIds;
				layerArr.push(layerObj);
			});
			var json = {};
			json["Layer"] = layerArr;
			$("#usSrvCap").val($.toJSON(json));
			return layerArr;
		},
		VWMTSAnalyzer:function(json){
			var layers = json.contents.layers;
			var tileMatrixSets = json.contents.tileMatrixSets;
			var layerArr = [];
			$(layers).each(function(i,data){
				var layerObj = {};
				layerObj["name"]=data.identifier;
				layerObj["type"] = "VWMTS";
				layerObj["alias"]= data.identifier;
				layerObj["opacity"]=1;
				layerObj["visibility"]=true;
				layerObj["transitionEffect"]="resize";
				layerObj["zoomOffset"]="0";
				layerObj["formats"]=data.formats;
				layerObj["format"]=data.formats[0];//"image/tile";
				layerObj["style"]=data.styles[0].identifier;
				layerObj["tileFullExtent"]=data.bounds.left+","+data.bounds.bottom+","+data.bounds.right+","+data.bounds.top;
				layerObj["matrixSet"]= data.tileMatrixSetLinks[0].tileMatrixSet;
				if( data.dimensions&& data.dimensions[0]){
					layerObj["dimensions"] = data.dimensions[0].values;
					layerObj["dimension"] = data.dimensions[0].values[data.dimensions[0].values.length-1];
				}
				var matrixIds = [];
				$(tileMatrixSets[data.tileMatrixSetLinks[0].tileMatrixSet].matrixIds).each(function(j,d){
				  var matrixid = {};
		          matrixid.identifier =d.identifier;
		          matrixid.scaleDenominator =d.scaleDenominator;
		          matrixid.tileHeight =d.tileHeight;
		          matrixid.tileWidth =d.tileWidth;
		          //matrixid.matrixHeight =_tileMatrixSet.matrixIds[i].matrixHeight;
		          //matrixid.matrixWidth =_tileMatrixSet.matrixIds[i].matrixWidth;
		          matrixIds.push(matrixid);
				});
				layerObj["matrixIds"] = matrixIds;
				layerArr.push(layerObj);
			});	
			return layerArr;
		},
		WMSAnalyzer:function(json){
			//WMS类型的服务数据 解析.
			var layers = json.capability.layers;
			var layerArr = [];
			$(layers).each(function(i,data){
				var layerObj = {};
				layerObj["type"] = "WMS";
				layerObj["alias"]=data.title;
				layerObj["name"]= data.name;
				layerObj["opacity"]=1;
				layerObj["visibility"]=true;
				layerObj["format"]=data.formats[0];//"image/jpeg";
				layerObj["formats"]=data.formats;//"image/jpeg","image/png","image/gif";
				for(var key in data.srs){
		                	layerObj["maxExtent"] = data.bbox[key].bbox.join(",");
		                }
				//layerObj["maxExtent"]=data.llbbox[0]+","+data.llbbox[1]+","+data.llbbox[2]+","+data.llbbox[3]; 
				layerArr.push(layerObj);
			});
			//var json = {};
			//json["Layer"] = layerArr;
			//$("#usSrvCap").val($.toJSON(json));
			return layerArr;
		},
		addService:function(service,successFN){
			//var params = "userService.usSrvFlag="+$(this).val()+
    		var params = "&userService.usSrvName="+service.usSrvName+
    					 "&userService.mapUserScenario.id="+service.mapUserScenario.id+
    					 "&userService.usSrvURL="+service.usSrvURL+
    					 "&userService.usSrvType="+service.usSrvType+
    					 "&userService.usSrvVersion="+service.usSrvVersion+
    					 "&userService.usSrvCap="+$.toJSON(service.usSrvCap);
			TDT.getDS(Service.url["addService"],params,false,function(json){ 
				if(json.result){
					if(successFN){successFN();}
				}
			});			
		}
	};
	
	Service.fn.init.prototype = Service.fn;
	
})();
