/**
 * 兴趣点配置模块对象
 * @author 朱泽江
 * @version 1.0 2012/9/1
 */
 (function(){
 	var Wfsconfig = window.Wfsconfig = function(){
 		return new Wfsconfig.fn.init();
 	};
 	
 	Wfsconfig.url = {
 		getAll:"wfsConfig/queryEntityByType.do",
 		update:"wfsConfig/updateEntity.do"
 	};
 	
 	Wfsconfig.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	Wfsconfig.validateTip = {
		url : {
			empty : "服务地址不能为空，请输入",
			unCheck:"服务未验证",
			success : "服务可用",
			fail:"服务不可用"
		},
		searchType:{
			noSet : "分类字段没有设置"
		},
		pageSize:{
			empty : "显示条数不能为空",
			notNumber:"显示条数不为正整数"
		},
		pageTotalRecord:{
			empty : "总记录不能为空",
			notNumber:"总记录不为正整数"
		}
	};
 	
 	Wfsconfig.fn = Wfsconfig.prototype = {
 		init:function(){
 			return this;
 		},
 		initData:function(type){
 			var url = Wfsconfig.url["getAll"];
			var params = "wfsconfig.serviceType="+type;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					//获取数据库设置信息
					Wfsconfig.fn.bingdingData(json.wfsconfig);
				}
			});
 		},
 		
 		//获取服务图层列表
 		checkURL : function(serviceUrl){
 			var url = TDT.getAppPath("")+"proxyHandler?url="+serviceUrl+"?1=1";
	        OpenLayers.Request.GET({
	            url: url,
	            params: {
	                request: "GetCapabilities",
	                service:"GeoCoding",
	                output:"json",
	                version: "1.0.0"
	            
	            },
	            async:false,
	            success:function(result){
	                //var doc = request.responseXML;
	               	var format =  new Geo.Format.JSON();
	                try{
						var category = format.read(result.responseText);
						$("#srvURL").parents("td").find(".required").html(Wfsconfig.validateTip.url.success);
						$("#wfsconfig-srvURL").val(serviceUrl);
					}catch(e) {
						$("#srvURL").parents("td").find(".required").html("<img src='"+Wfsconfig.validateErrorImgSrc+"'/>"+Wfsconfig.validateTip.url.fail);
						$("#srvURL").focus();
					}
	            },
	            failure: function(){
	            	$("#srvURL").parents("td").find(".required").html("<img src='"+Wfsconfig.validateErrorImgSrc+"'/>"+Wfsconfig.validateTip.url.fail);
					$("#srvURL").focus();
	            }
	        });
		}, 

 		bingdingData:function(json){
 			//绑定服务图层列表
 			
			$("#srvURL").val(json.serviceURL);
			$("#pageSize").val(json.pageSize);
			
			$("#wfsconfig-id").val(json.id);
			$("#wfsconfig-srvURL").val(json.serviceURL);
			$("#wfsconfig-srvType").val(json.serviceType);
			$("#wfsconfig-popupShowField").val(json.popupShowfield);
			$("#wfsconfig-pageSize").val(json.pageSize);
			
			if(json.popupShowfield){
				var popupShowfield = $.evalJSON(json.popupShowfield);
				this.loopSearchType(popupShowfield.showSearchType);
			}
 		},
 		loopSearchType:function(searchType){
 			if(!searchType){return;}
 			var ids = ["#st-first","#st-second","#st-third"];
 			for(var i=0;i<searchType.length;i++){
 				for(var key in searchType[i]){
	 				$(ids[i]+"_ipt").val(key);
					$(ids[i]+"-code").val(searchType[i][key]);
					$(ids[i]+"_hidden").val(searchType[i][key]);//这个是设置id的，但是我们数据库没有存id，所以设定初始化值
				}
 			}
 		},
 		updateForm:function(){
 			var url = Wfsconfig.url["update"];
			var isValidate = this.validateSarForm();
			if(isValidate){
 				this.buildField();
				TDT.formSubmit("wfsconfigUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.alert("恭喜您，更新成功!");
					}else {
						TDT.alert("更新失败!");
					}
				});
			}
 		},
 		
 		//构造显示字段和浮云配置域
 		buildField : function(){
			/**
			 *  浮云显示增加 分类搜索配置
			 */
			popupShowfield = {};
			popupShowfield.showSearchType = [];
			var addSearchType = function(ids){
				for(var i in ids){
					var search = {};
					var title = $(ids[i]+"_ipt").val();
					var code = $(ids[i]+"-code").val();
					search[title] = code;
					popupShowfield.showSearchType.push(search);
				}
			}
			addSearchType(["#st-first","#st-second","#st-third"]);
			
			$("#wfsconfig-popupShowField").val($.toJSON(popupShowfield));
			$("#wfsconfig-pageSize").val($("#pageSize").val());;
			
 		},
 		
 		validateSarForm:function(){
 			var srvURL = $("#srvURL");
 			if(srvURL.val() ==""){
				srvURL.parents("td").find(".required").html("<img src='"+Wfsconfig.validateErrorImgSrc+"'/>"+Wfsconfig.validateTip.url.empty);
				srvURL.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}else{
				if(srvURL.val()!=$("#wfsconfig-srvURL").val()){
					srvURL.parents("td").find(".required").html("<img src='"+Wfsconfig.validateErrorImgSrc+"'/>"+Wfsconfig.validateTip.url.unCheck);
					srvURL.focus();
					return false;
				}
			}
			var pageSize = $("#pageSize");
			var reg = /^[1-9]\d*$/i;
			if(pageSize.val() ==""){
				pageSize.parents("td").find(".required").html("<img src='"+Wfsconfig.validateErrorImgSrc+"'/>"+Wfsconfig.validateTip.pageSize.empty);
				pageSize.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			r = pageSize.val().match(reg);
 			if(!r){
				pageSize.parents("td").find(".required").html("<img src='"+Wfsconfig.validateErrorImgSrc+"'/>"+Wfsconfig.validateTip.pageSize.notNumber);
				pageSize.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			$("#wfsconfig-pageSize").val(pageSize.val());;
			//验证分类字段是否设置
			var ids = ["#st-first","#st-second","#st-third"];
			for(var i in ids){
				var searchType = $(ids[i]+"_hidden");
				if(searchType.val()=="root"){
					$(".station label").eq(2).click();
					searchType.parents("li").find(".required").html("<img src='"+Wfsconfig.validateErrorImgSrc+"'/>"+Wfsconfig.validateTip.searchType.noSet);
					$(ids[i]+"_ipt").focus(function(){
						$(this).parents("li").find(".required").html("*");
					});
					return false;
				}
			}
			return true;
 		}
 		
  	};
 	
 	Wfsconfig.fn.init.prototype = Wfsconfig.fn;
 	
 })();